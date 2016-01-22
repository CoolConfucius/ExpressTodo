'use strict';

var isAlpha = false; 

$(document).ready(init);

function init() {
  populateTodos();
  $('#addTodo').click(addTodo);
  $('#removeComplete').click(removeComplete);
  $('#showIncomplete').click(filter);
  $('#showComplete').click(filter);
  $('#showAll').click(showAll);
  $('#sortAlpha').click(sortAlpha);
  
  $('#output').on('click', '.toggle', toggle);
  $('#output').on('click', '.remove', remove);
}

function addTodo() {
  var newTask = $('#newTask').val();
  if (!newTask) {
    alert("Enter a task to do.");
    return; 
  };
  
  var newDue = $('#newDue').val(); 
  
  $.post('/todos', { task: newTask, completion: "incomplete", due: newDue })
  .success(function(data) {
    var $item = $('<div>').addClass('item incomplete row'); 
    var $task = $('<span>').text(newTask).addClass('col-xs-6 task'); 
    var $due = $('<span>').text(newDue).addClass('col-xs-2 due'); 
    var $completion = $('<span>').text("incomplete").addClass('col-xs-2 completion'); 
    var $toggle = $('<button>').addClass('toggle col-xs-1 btn btn-primary btn-sm').text('Toggle');
    var $remove = $('<button>').addClass('remove col-xs-1 btn btn-danger btn-sm').text('X');
    $item.append($task, $completion, $due, $toggle, $remove);
    $('#output').append($item);
  })
  .fail(function(err) {
    alert('something went wrong :(')
  });
}

function populateTodos() {
  $.get('/todos', function(data) {
    var $todos = data.map(function(item) {
      var $item = $('<div>').addClass('item row'); 
      if (item.completion === "complete") {
        $item.addClass('complete');
      } else {
        $item.addClass('incomplete');
      }

      var $task = $('<span>').text(item.task).addClass('col-xs-6 task'); 
      var $due = $('<span>').text(item.due).addClass('col-xs-2 due'); 
      var $completion = $('<span>').text(item.completion).addClass('col-xs-2 completion'); 
      var $toggle = $('<button>').addClass('toggle col-xs-1 btn btn-primary btn-sm').text('Toggle');
      var $remove = $('<button>').addClass('remove col-xs-1 btn btn-danger btn-sm').text('X');
      $item.append($task, $completion, $due, $toggle, $remove);
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
    $completion.text('complete'); 
    $item.removeClass('incomplete').addClass('complete');
  } else {
    $completion.text('incomplete'); 
    $item.removeClass('complete').addClass('incomplete');
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


function removeComplete(){
  var $items = $('#output').children('.item'); 
  $items.each(function( index ){
    if ($items.eq(index).children('.completion').text() === "complete") {
      $items.eq(index).addClass("toRemove"); 
    };
  });
  $('.toRemove').remove(); 

  $.ajax({
    url: "/todos",
    method: "DELETE"
  }); 
}

function filter(){
  var $id = $(this).attr('id');
  $('.item').addClass('hide'); 
  if ($id === "showComplete") {
    $('.complete').removeClass('hide');
  } else {
    $('.incomplete').removeClass('hide');
  }
}

function showAll(){
  $('#output').empty();
  populateTodos();
}

function sortAlpha(e){
  var az = (e.shiftKey) ? "/todos/sort/z" : "/todos/sort/a"
  $.get(az, function(data) {
    showAll(); 
  });
}
