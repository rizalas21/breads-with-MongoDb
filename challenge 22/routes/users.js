
var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();

module.exports = function (db) {

  const User = db.collection('users')

  // GET users
  router.get('/', async function (req, res, next) {
    try {
      const { page = 1, name, phone, sortBy='_id', sortMode='desc' } = req.query
      const sort = {}
      sort[sortBy] = sortMode == 'asc' ? 1 : -1
      const params = {}

      if (name) {
        params['name'] = new RegExp(name, 'i')
      }

      if (phone) {
        params['phone'] = new RegExp(phone, 'i')
      }

      const limit = 5
      const offset = (page - 1) * limit

      const total = await User.count(params)
      const pages = Math.ceil(total / limit)

      const users = await User.find(params).sort(sort).limit(limit).skip(offset).toArray();
      res.json({
        data: users,
        total,
        pages,
        page,
        limit,
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
      const users = await User.findOne({ _id: new ObjectId(id) })
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ err })
    }
  })

  // CREATE USER
  router.post('/', async function (req, res, next) {
    try {
      const { name, phone } = req.body
      const users = await User.insertOne({ name, phone })
      res.status(201).json(users)
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
      const users = await User.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { name: name, phone: phone } })
      res.status(201).json(users)
    } catch (err) {
      res.status(500).json({ err })
    }
  });

  return router;
}