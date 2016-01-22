'use strict';

var PORT = 4000;

// bring in dependencies / libraries
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var _ = require('lodash'); 

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

app.get('/todos', function(req, res) {
  fs.readFile('./todos.json', function(err, data) {
    if(err) return res.status(400).send(err);
    var arr = JSON.parse(data);
    res.send(arr);
  });
});

app.post('/todos', function(req, res) {
  fs.readFile('./todos.json', function(err, data) {
    if(err) return res.status(400).send(err);
    var arr = JSON.parse(data);
    var todo = {
      task: req.body.task, 
      completion: req.body.completion
    }

    arr.push(todo);
    fs.writeFile('./todos.json', JSON.stringify(arr), function(err) {
      if(err) return res.status(400).send(err);
      res.send();
    });
  });
});


app.put('/todos/:itemindex', function(req, res) {
  console.log(req.params);
  var index = parseInt(req.params.itemindex);
  fs.readFile('./todos.json', function(err, data) {
    if(err) return res.status(400).send(err);
    var arr = JSON.parse(data);
    if (arr[index].completion === "incomplete") {
      arr[index].completion = "complete"; 
    } else {
      arr[index].completion = "incomplete"; 
    };
    
    fs.writeFile('./todos.json', JSON.stringify(arr), function(err) {
      if(err) return res.status(400).send(err);
      res.send();
    });
  });
});

app.delete('/todos/:itemindex', function(req, res) {
  var index = parseInt(req.params.itemindex);
  fs.readFile('./todos.json', function(err, data) {
    if(err) return res.status(400).send(err);
    var arr = JSON.parse(data);
    arr.splice(index, 1); 
    
    fs.writeFile('./todos.json', JSON.stringify(arr), function(err) {
      if(err) return res.status(400).send(err);
      res.send();
    });
  });
});


app.delete('/todos', function(req, res) {
  fs.readFile('./todos.json', function(err, data) {
    if(err) return res.status(400).send(err);
    var arr = JSON.parse(data);
    var indexes = [];
    arr.forEach(function(entry, index){
      if (entry.completion === "complete") {
        indexes.push(index); 
      };
    })
    _.pullAt(arr, indexes); 
    
    fs.writeFile('./todos.json', JSON.stringify(arr), function(err) {
      if(err) return res.status(400).send(err);
      res.send();
    });
  });
});



// spin up server
app.listen(PORT, function() {
  console.log('Express server listening on port', PORT)
});