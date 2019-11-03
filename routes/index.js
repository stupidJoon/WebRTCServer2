var express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});
router.get('/caller', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/caller.html'));
});
router.get('/callee', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/callee.html'));
});

module.exports = router;
