
var express = require('express');
var router = express.Router();

module.exports = function (db) {
  router.get('/', function (req, res, next) {
    res.render('index') 
  });

  router.get('/users/:id/todos', function (req, res, next) {
    const id = req.params.id
    res.render('todo', {id}) 
  });
  return router
}