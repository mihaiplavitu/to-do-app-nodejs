

// handler for on click events to delete the current <li> element
function deleteToDoItemHandler(elm) {
    let $currentToDoMdbId = $(elm).siblings('input').attr('name');
    let $currentLiElm = $(elm).parent('li');
    $.delete('/api/todo', { id: $currentToDoMdbId }, function(response) {
        console.log(response);
        // now we delete the item from the list if api call successful
        if (response.status === 'ok') {
            $currentLiElm.remove();
        }
    }, 'json');
};

// handler for on click events when checkbox is ticked or unticked
function checkboxChangeHandler(inputElm, apiCallFunction) {
    // select the current input element the user is clicking
    let $currentCheckboxInputElm = $(inputElm);
    // select the current Li element the user is clicking
    let $currentTextInputElm = $currentCheckboxInputElm.siblings('input');

    if ($currentCheckboxInputElm.val() === 'true') {
        // current toDo is done and we make it not done
        // set value to false, remove checkbox attribute and toggle line-through class
        $currentCheckboxInputElm.val(false);
        $currentCheckboxInputElm.removeAttr('checked');
        $currentTextInputElm.toggleClass('line-through');
    } else {
        // current toDo is not done ad]nd we make is done
        // set value to true, add checkbox attribute and toggle line-through class
        $currentCheckboxInputElm.val(true);
        $currentCheckboxInputElm.attr('checked', true);
        $currentTextInputElm.toggleClass('line-through');
    };

    // grab values for the data object for the post request
    // and create the data object for the post request
    let toDoObjUpdate = {
        id: $currentCheckboxInputElm.attr('name'),
        toDo: $currentTextInputElm.val(),
        isDone: $currentCheckboxInputElm.val(),
        hasAttachment: 'false'
    };

    console.log(toDoObjUpdate);

    // call api with post request
    apiCallFunction(toDoObjUpdate);
};

function toDoTextChangeHandler(inputElm, apiCallFunction) {
    // grab clicked html elements
    let $currentTextInputElm = inputElm;
    let $currentCheckboxInputElm = $currentTextInputElm.siblings('input');

    // grab values for the data object for the post request
    // and create the data object for the post request
    let toDoObjUpdate = {
        id: $currentCheckboxInputElm.attr('name'),
        toDo: $currentTextInputElm.val(),
        isDone: $currentCheckboxInputElm.val(),
        hasAttachment: 'false'
    };

    apiCallFunction(toDoObjUpdate);
}

export { deleteToDoItemHandler, checkboxChangeHandler, toDoTextChangeHandler };
