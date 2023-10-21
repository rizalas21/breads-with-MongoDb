var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();

module.exports = function (db) {

    const Todo = db.collection('todos')
    const User = db.collection('users')

    // GET users
    router.get('/', async function (req, res, next) {
        try {
            const { page = 10, title, complete, strdeadline, enddeadline, sortBy = '_id', sortMode, limit = 10, executor } = req.query
            const sort = {}
            sort[sortBy] = sortMode
            const params = {}


            if (executor) params['executor'] = new ObjectId(executor)
            if (title) params['title'] = new RegExp(title, 'i')
            if (complete) params['complete'] = complete
            if (strdeadline && enddeadline) {
                params['deadline'] = {deadline: {$gt: new Date(strdeadline), $lt: new Date (enddeadline)}}
            } else if (strdeadline) {
                params['deadline'] = { $gte: new Date(strdeadline) }
            } else if (enddeadline) {
                params['deadline'] = { $lte: new Date (enddeadline) }
            }

            const offset = (page - 1) * limit

            const total = await Todo.count(params)
            const pages = Math.ceil(total / limit)

            console.log('ini params => ', params)
            
            const todos = await Todo.find(params).sort(sort).limit(limit).skip(offset).toArray();
            res.json({
                data: todos,
                total,
                pages,
                page,
                limit
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
            const user = await User.findOne({ _id: new ObjectId(executor) })
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
            const todos = await Todo.findOneAndDelete({ _id: new ObjectId(id) })

            if(todos) {
                res.status(200).json(todos)
            } else {
                res.status(500).json({ message: 'Todo Not Found'})
            }
        } catch (err) {
            res.status(500).json({ err })
        }
    });

    // UPDATE USER
    router.put('/:id', async function (req, res, next) {
        try {
            const { title, deadline, complete } = req.body
            const id = req.params.id
            const todos = await Todo.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { title: title, deadline: deadline, complete: complete } })
            if(todos) {
                res.status(201).json(todos)
            } else {
                res.status(500).json({message: `Todo Not Found`})
            }
        } catch (err) {
            res.status(500).json({ err })
        }
    });

    return router;
}