var express = require('express');
var router = express.Router();
const User = require('../models/User')

router.get('/', async function (req, res, next) {
  try {
    const { page = 1, name, phone, sortBy, sortMode } = req.query
    const sort = {}
    sort[sortBy] = sortMode
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

    const users = await User.find(params).limit(limit).skip(offset)
    res.json({
      data: users,
      page,
      pages
    })
  } catch (err) {
    res.status(500).json({ err })
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { name, phone } = req.body
    const user = await User.create({ name, phone })
    res.json(user)
  } catch (err) {
    res.status(500).json({ err })
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const { name, phone } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, { name, phone }, { new: true })
    res.json(user)
  } catch (err) {
    res.status(500).json({ err })
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const user = await User.findByIdAndRemove(req.params.id)
    res.json(user)
  } catch (err) {
    res.status(500).json({ err })
  }
});

module.exports = router;
