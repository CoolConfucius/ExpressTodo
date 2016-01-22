'use strict';

$(document).ready(init);

function init() {
  populateTasks();
  $('#addTask').click(addTask);
  $('#output').on('click', '.toggle', toggleTask);
}

function addTask() {
  var newTask = $('#newTask').val();
  $.post('/tasks', {task: newTask})
  .success(function(data) {
    var $item = $('<div>').addClass('item'); 
    var $task = $('<li>').text(newTask); 
    var $toggle = $('<button>').addClass('toggle').text('Toggle');
    $item.append($task, $toggle);
    $('#output').append($item);
  })
  .fail(function(err) {
    alert('something went wrong :(')
  });
}

function populateTasks() {
  $.get('/tasks', function(data) {
    var $tasks = data.map(function(task) {
      var $item = $('<div>').addClass('item'); 
      var $task = $('<li>').text(task); 
      var $toggle = $('<button>').addClass('toggle').text('Toggle');
      $item.append($task, $toggle);
      return $item;
    });
    $('#output').append($tasks);
  });
}
function toggleTask(){
  var $this = $(this);
  var $item = $this.closest('.item');
  var index = $item.index(); 
  console.log(index); 
}