'use strict';

$(document).ready(init);

function init() {
  populateTasks();
  $('#addTodo').click(addTodo);
  $('#output').on('click', '.toggle', toggle);
}

function addTodo() {
  var newTask = $('#newTask').val();
  $.post('/todos', { task: newTask, completion: "incomplete" })
  .success(function(data) {
    var $item = $('<div>').addClass('item row'); 
    var $task = $('<span>').text(newTask).addClass('col-xs-8'); 
    var $completion = $('<span>').text("incomplete").addClass('col-xs-2'); 
    var $toggle = $('<button>').addClass('toggle col-xs-1 btn btn-primary btn-sm').text('Toggle');
    $item.append($task, $completion, $toggle);
    $('#output').append($item);
  })
  .fail(function(err) {
    alert('something went wrong :(')
  });
}

function populateTasks() {
  $.get('/todos', function(data) {
    var $todos = data.map(function(item) {
      var $item = $('<div>').addClass('item row'); 
      var $task = $('<span>').text(item.task).addClass('col-xs-8'); 
      var $completion = $('<span>').text(item.completion).addClass('col-xs-2'); 
      var $toggle = $('<button>').addClass('toggle col-xs-1 btn btn-primary btn-sm').text('Toggle');
      $item.append($task, $completion, $toggle);
      return $item;
    });
    $('#output').append($todos);
  });
}
function toggle(){
  var $this = $(this);
  var $item = $this.closest('.item');
  var index = $item.index(); 
  console.log(index); 
  $.put('/todos/:itemindex', function(data) {
    var $todos = data.map(function(item) {
      var $item = $('<div>').addClass('item row'); 
      var $task = $('<span>').text(item.task).addClass('col-xs-8'); 
      var $completion = $('<span>').text(item.completion).addClass('col-xs-2'); 
      var $toggle = $('<button>').addClass('toggle col-xs-1 btn btn-primary btn-sm').text('Toggle');
      $item.append($task, $completion, $toggle);
      return $item;
    });
    $('#output').append($todos);
  });



}