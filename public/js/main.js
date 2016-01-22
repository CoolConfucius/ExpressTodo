'use strict';

$(document).ready(init);

function init() {
  populateTasks();
  $('#addTask').click(addTask);
}

function addTask() {
  var newTask = $('#newTask').val();
  $.post('/tasks', {task: newTask})
  .success(function(data) {
    var $li = $('<li>').text(newTask);
    $('#output').append($li);
  })
  .fail(function(err) {
    alert('something went wrong :(')
  });
}

function populateTasks() {
  $.get('/tasks', function(data) {
    var $tasks = data.map(function(task) {
      return $('<li>').text(task);
    });
    $('#output').append($tasks);
  });
}