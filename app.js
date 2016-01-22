'use strict';

var PORT = 4000;

// bring in dependencies / libraries
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

// configure general middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// route definitions
app.get('/', function(req, res) {
  var html = fs.readFileSync('./index.html').toString();
  res.send(html);
});

app.get('/tasks', function(req, res) {
  fs.readFile('./tasks.json', function(err, data) {
    if(err) return res.status(400).send(err);
    var arr = JSON.parse(data);
    res.send(arr);
  });
});

app.post('/tasks', function(req, res) {
  fs.readFile('./tasks.json', function(err, data) {
    if(err) return res.status(400).send(err);
    var arr = JSON.parse(data);
    var task = req.body.task;
    arr.push(task);
    fs.writeFile('./tasks.json', JSON.stringify(arr), function(err) {
      if(err) return res.status(400).send(err);
      res.send();
    });
  });
});

// spin up server
app.listen(PORT, function() {
  console.log('Express server listening on port', PORT)
});