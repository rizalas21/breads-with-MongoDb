var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();

module.exports = function (db) {

    const Todo = db.collection('todos')
    const User = db.collection('users')

    // GET users
    router.get('/', async function (req, res, next) {
        try {
            const { page = 1, title, complete = '', startdateDeadline, enddateDeadline, sortBy = '_id', sortMode, limit = 5, executor } = req.query
            const sort = {}
            sort[sortBy] = sortMode
            const params = {}


            if (executor) params['executor'] = new ObjectId(executor)
            if (title) params['title'] = new RegExp(title, 'i')
            if (complete) params['complete'] = JSON.parse(complete)
            if (startdateDeadline && enddateDeadline) {
                params['deadline'] = { $gte: new Date(startdateDeadline), $lte: new Date(enddateDeadline) }
            } else if (startdateDeadline) {
                params['deadline'] = { $gte: new Date(startdateDeadline) }
            } else if (enddateDeadline) {
                params['deadline'] = { $lte: new Date(enddateDeadline) }
            }

            const offset = (page - 1) * limit

            const data = await Todo.find(params).toArray()
            const total = data.length
            const pages = Math.ceil(total / limit)
            const todos = await Todo.find(params).sort(sort).limit(parseInt(limit)).skip(offset).toArray();
            res.json({
                data: todos,
                total,
                pages,
                page: Number(page),
                limit: Number(limit)
            })
        } catch (err) {
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
            const date = new Date()
            date.setDate(date.getDate() + 1)
            const user = await User.findOne({ _id: new ObjectId(executor) })
            const newTodo = await Todo.insertOne({ title, complete: false, deadline: date, executor: user._id })
            if (newTodo.acknowledged) {
                const insertedId = newTodo.insertedId
                const todo = await Todo.findOne({ _id: insertedId })
                if (todo) {
                    res.status(201).json(todo)
                } else {
                    res.status(500).json({ message: 'error get new data todo', err })
                }
            } else {
                res.status(500).json({ message: 'error add data' })
            }

        } catch (err) {
            res.status(500).json({ err })
        }
    });

    // DELETE USER
    router.delete('/:id', async function (req, res, next) {
        try {
            const id = req.params.id
            const todos = await Todo.findOneAndDelete({ _id: new ObjectId(id) })

            if (todos) {
                res.status(200).json(todos)
            } else {
                res.status(500).json({ message: 'Todo Not Found' })
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
            await Todo.updateOne({ _id: new ObjectId(id) }, { $set: { title: title, deadline: new Date(deadline), complete: JSON.parse(complete) } })
            const updatedTodo = await Todo.findOne({ _id: new ObjectId(id) })
            res.status(201).json(updatedTodo)
        } catch (err) {
            res.status(500).json({ err })
        }
    });

    return router;
}