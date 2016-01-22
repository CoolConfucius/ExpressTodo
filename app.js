'use strict';

var PORT = 4000;
var DATAFILE = './todos.json';

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
  readTodos(function(todos){
    res.send(todos); 
  })
});

app.post('/todos', function(req, res) {

  var newTodo = {
    task: req.body.task, 
    completion: req.body.completion, 
    due: req.body.due
  }
  readTodos(function(todos){
    todos.push(newTodo);
    writeTodos(todos, function(err){
      res.send(todos);
    })
  })

});


app.put('/todos/:itemindex', function(req, res) {
  var index = parseInt(req.params.itemindex);

  readTodos(function(todos){
    if (todos[index].completion === "incomplete") {
      todos[index].completion = "complete"; 
    } else {
      todos[index].completion = "incomplete"; 
    };
    writeTodos(todos, function(err){
      res.send(todos);
    });
  });
});

app.delete('/todos/:itemindex', function(req, res) {
  var index = parseInt(req.params.itemindex);

  readTodos(function(todos){
    todos.splice(index, 1);

    writeTodos(todos, function(err){
      res.send(todos);
    });
  });
});


app.delete('/todos', function(req, res) {

  readTodos(function(todos){
    var indexes = [];
    todos.forEach(function(entry, index){
      if (entry.completion === "complete") {
        indexes.push(index); 
      };
    })
    _.pullAt(todos, indexes); 

    writeTodos(todos, function(err){
      res.send(todos);
    });
  });

});

app.get('/todos/sort/:az', function(req, res) {
  var az = req.params.az;

  readTodos(function(todos){
    switch(az) {
      case 'a': 
        todos = sortAlpha(todos, false); 
        break;
      case 'z':
        todos = sortAlpha(todos, true); 
        break;
      case 'd': 
        todos = sortDue(todos, false); 
        break;
      case 'r': 
        todos = sortDue(todos, true); 
        break;
    }

    writeTodos(todos, function(err){
      res.send(todos);
    });
  });


});


function readTodos(cb){
  fs.readFile(DATAFILE, function(err, data){
    if(err) return res.status(400).send(err);
    var todos = JSON.parse(data); 
    cb(todos); 
  }); 
}

function writeTodos(todos, cb){
  fs.writeFile(DATAFILE, JSON.stringify(todos), function(err){
    cb(err); 
  })
}



function sortAlpha(array, isAlpha){
  if (!isAlpha) {
    array.sort(function(a, b){
    if (a.task > b.task) {
      return 1; 
    };
    if (a.task < b.task) {
      return -1; 
    };
      return 0; 
    });  
  } else {
    array.sort(function(a, b){
    if (a.task > b.task) {
      return -1; 
    };
    if (a.task < b.task) {
      return 1; 
    };
      return 0; 
    });
  }
  
  return array; 
}; 

function sortDue(array, reverse){
  if (!reverse) {
    array.sort(function(a, b){
    if (a.due > b.due) {
      return 1; 
    };
    if (a.due < b.due) {
      return -1; 
    };
      return 0; 
    });  
  } else {
    array.sort(function(a, b){
    if (a.due > b.due) {
      return -1; 
    };
    if (a.due < b.due) {
      return 1; 
    };
      return 0; 
    });
  }
  
  return array; 
}; 



// spin up server
app.listen(PORT, function() {
  console.log('Express server listening on port', PORT)
});