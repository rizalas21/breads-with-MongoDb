var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();

module.exports = function (db) {

    const Todo = db.collection('todos')
    const User = db.collection('users')

    // GET users
    router.get('/', async function (req, res, next) {
        try {
            const { page = 1, title, complete, strdeadline, enddeadline, sortBy = '_id', sortMode, executor } = req.query
            const sort = {}
            sort[sortBy] = sortMode
            const params = {}

            if (executor) params['executor'] = executor
            if (title) params['title'] = new RegExp(title, 'i')
            if (complete) params['complete'] = complete
            if (strdeadline && enddeadline) {
                params['deadline'] = { '$gte': strdeadline, '$lte': enddeadline }
            } else if (strdeadline) {
                params['deadline'] = { 'gte': strdeadline }
            } else if (enddeadline) {
                params['deadline'] = { '$lte': enddeadline }
            }

            const limit = 5
            const offset = (page - 1) * limit

            const total = await Todo.count(params)
            const pages = Math.ceil(total / limit)

            const todos = await Todo.find(params).sort(sort).limit(limit).skip(offset).toArray();
            res.json({
                data: todos,
                total,
                pages,
                page,
                limit,
                offset
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ err })
        }
    });

    // SEARCH User
    router.get('/:id', async function (req, res, next) {
        try {
            const id = req.params.id
            const todos = await Todo.findOne({ _id: new ObjectId(id) })
            res.status(200).json(todos)
        } catch (error) {
            res.status(500).json({ err })
        }
    })

    // CREATE USER
    router.post('/', async function (req, res, next) {
        try {
            const { title, executor } = req.body
            const user = await User.findOne({ _id: ObjectId(executor) })
            const todos = await Todo.insertOne({title, complete: false, deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), executor: user._id})
            res.status(201).json(todos)
        } catch (err) {
            res.status(500).json({ err })
        }
    });

    // DELETE USER
    router.delete('/:id', async function (req, res, next) {
        try {
            const id = req.params.id
            const users = await User.findOneAndDelete({ _id: new ObjectId(id) })
            res.status(200).json(users)
        } catch (err) {
            res.status(500).json({ err })
        }
    });

    // UPDATE USER
    router.put('/:id', async function (req, res, next) {
        try {
            const { name, phone } = req.body
            const id = req.params.id
            const users = await User.updateOne({ _id: new ObjectId(id) }, { $set: { name: name, phone: phone } })
            res.status(201).json(users)
        } catch (err) {
            res.status(500).json({ err })
        }
    });

    return router;
}