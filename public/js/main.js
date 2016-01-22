'use strict';

$(document).ready(init);

function init() {
  populateTasks();
  $('#addTodo').click(addTodo);
  $('#output').on('click', '.toggle', toggle);
  $('#output').on('click', '.remove', remove);
}

function addTodo() {
  var newTask = $('#newTask').val();
  $.post('/todos', { task: newTask, completion: "incomplete" })
  .success(function(data) {
    var $item = $('<div>').addClass('item row'); 
    var $task = $('<span>').text(newTask).addClass('col-xs-7 task'); 
    var $completion = $('<span>').text("incomplete").addClass('col-xs-2 completion'); 
    var $toggle = $('<button>').addClass('toggle col-xs-1 btn btn-primary btn-sm').text('Toggle');
    var $remove = $('<button>').addClass('remove col-xs-1 btn btn-danger btn-sm').text('X');
    $item.append($task, $completion, $toggle, $remove);
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
      var $task = $('<span>').text(item.task).addClass('col-xs-7 task'); 
      var $completion = $('<span>').text(item.completion).addClass('col-xs-2 completion'); 
      var $toggle = $('<button>').addClass('toggle col-xs-1 btn btn-primary btn-sm').text('Toggle');
      var $remove = $('<button>').addClass('remove col-xs-1 btn btn-danger btn-sm').text('X');
      $item.append($task, $completion, $toggle, $remove);
      return $item;
    });
    $('#output').append($todos);
  });
}

function toggle(){
  var $this = $(this);
  var $item = $this.closest('.item');
  var index = $item.index(); 
  var $completion = $item.find('.completion'); 
  if ($completion.text() === "incomplete") {
    $completion.text('completion'); 
  } else {
    $completion.text('incomplete'); 
  }

  $.ajax({
    url: "/todos/"+index,
    method: "PUT"
  });
}

function remove(){
  var $item = $(this).closest('.item');
  var index = $item.index(); 
  $item.remove(); 

  $.ajax({
    url: "/todos/"+index,
    method: "DELETE"
  });
}
