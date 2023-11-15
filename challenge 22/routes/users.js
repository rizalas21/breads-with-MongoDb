var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();

module.exports = function (db) {

  const User = db.collection('users')

  // GET users
  router.get('/', async function (req, res, next) {
    try {
      const { page = 1, limit = 5, query = '', sortBy, sortMode } = req.query
      const sort = {}
      sort[sortBy] = sortMode == 'asc' ? 1 : -1
      const params = {}

      if (query) {
        params['$or'] = [{ "name": new RegExp(query, 'i') }, { "phone": new RegExp(query, 'i') }]
      }

      const offset = (page - 1) * limit

      const total = await User.count(params)
      const pages = Math.ceil(total / limit)

      const users = await User.find(params).sort(sort).limit(parseInt(limit)).skip(offset).toArray();
      res.json({
        data: users,
        total,
        pages,
        page: parseInt(page),
        limit: parseInt(limit),
        offset
      })
    } catch (err) {
      res.status(500).json({ err })
    }
  });

  // SEARCH User
  router.get('/:id', async function (req, res, next) {
    try {
      const id = req.params.id
      const user = await User.findOne({ _id: new ObjectId(id) })
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ error })
    }
  })

  // CREATE USER
  router.post('/', async function (req, res, next) {
    try {
      const { name, phone } = req.body
      const newUser = await User.insertOne({ name, phone })
      if (newUser.acknowledged) {
        const insertedId = newUser.insertedId
        const user = await User.findOne({ _id: insertedId })
        if (user) {
          res.status(201).json(user)
        } else {
          res.status(500).json({ message: 'error get new data' })
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
      const user = await User.findOneAndDelete({ _id: new ObjectId(id) })
      res.status(200).json(user)
    } catch (err) {
      res.status(500).json({ err })
    }
  });

  // UPDATE USER
  router.put('/:id', async function (req, res, next) {
    try {
      const { name, phone } = req.body
      const id = req.params.id
      await User.updateOne({ _id: new ObjectId(id) }, { $set: { name: name, phone: phone } })
      const updatedUser = await User.findOne({_id: new ObjectId(id)})
      res.status(201).json(updatedUser)
    } catch (err) {
      res.status(500).json({ err })
    }
  });

  return router;
}