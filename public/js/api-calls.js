// helper function as jQuery dones't support $.delete method out of the box. Makes $.delete works the same was as other ajax requests
$.delete = function(url, data, callback, type){

  if ( $.isFunction(data) ){
    type = type || callback,
        callback = data,
        data = {}
  }

  return $.ajax({
    url: url,
    type: 'DELETE',
    success: callback,
    data: data,
    dataType: type
  });
}

// get ToDo list
function getExistingToDos (callbackFn) {
    $.get('/api/todos', response => {
        callbackFn(response)
    }, 'json');
};

// post request to update toDo
function apiUpdateToDo(toDoObjUpdate) {
    $.post('/api/todo', toDoObjUpdate, response => {
        console.log(response)
    }, 'json')
};

export { getExistingToDos, apiUpdateToDo };
