// API calls
// get ToDo list
$.get('http://localhost:3000/api/todos/mihai', response => {
    generateToDoList(response)
}, 'json');

// post request to update toDo
function apiUpdateToDo(toDoObjUpdate) {
    $.post('/api/todo', toDoObjUpdate, response => {
        console.log(response)
    }, 'json')
};

// function to insert new toDo
function insertNewToDo(savedDoc) {
    $('.toDoList').append(`<li class=''><img class='trash-icon' src='/assets/images/trash.png' /><input type='checkbox' name='${ savedDoc._id }' value='${ savedDoc.isDone }' class='myCheckbox' />${ savedDoc.toDo }</li>`);

    // select <input> elm just created and its sibling <img> elem
    let $thisInput = $(`input[name='${ savedDoc._id }']`);
    let $thisImgTrashElm = $thisInput.siblings('img');

    // bind onClick event to the <img> elm in order to delete current <li> when clicked
    $thisImgTrashElm.on('click', function() {
        // on click -> execute handler
        deleteToDoItemHandler($thisImgTrashElm);
    });

    // bind event handler to listen for changes on the checkbox and check or uncheck it accordingly
    $thisInput.on('click', function() {
        // on click -> execute handler
        checkboxChangeHandler($thisInput);
    })

};

// handler for on click events to delete the current <li> element
function deleteToDoItemHandler(elm) {
    let $currentToDoMdbId = $(elm).siblings('input').attr('name');
    let $currentLiElm = $(elm).parent('li');
    $.delete('/api/todo', { "_id": $currentToDoMdbId }, function(response) {
        console.log(response);
        // now we delete the item from the list if api call successful
        if (response.status === 'ok') {
            $currentLiElm.remove();
        }
    }, 'json');
};

// handler for on click events when checkbox is ticked or unticked
function checkboxChangeHandler(currentCheckbox) {
    // select the current input element the user is clicking
    let $currentInputElm = $(currentCheckbox);
    // select the current Li element the user is clicking
    let $currentLiElm = $currentInputElm.parent();

    if ($currentInputElm.val() === 'true') {
        // current toDo is done and we make it not done
        // set value to false, remove checkbox attribute and toggle line-through class
        $currentInputElm.val(false);
        $currentInputElm.removeAttr('checked');
        $currentLiElm.toggleClass('line-through');
    } else {
        // current toDo is not done ad]nd we make is done
        // set value to true, add checkbox attribute and toggle line-through class
        $currentInputElm.val(true);
        $currentInputElm.attr('checked', true);
        $currentLiElm.toggleClass('line-through');
    };

    // grab values for the data object for the post request
    // and create the data object for the post request
    let toDoObjUpdate = {
        id: $currentInputElm.attr('name'),
        toDo: $currentLiElm.text(),
        isDone: $currentInputElm.val(),
        hasAttachment: 'false'
    };

    console.log(toDoObjUpdate);

    // call api with post request
    apiUpdateToDo(toDoObjUpdate);
};

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

// main function
function generateToDoList(toDosData) {
    $(document).ready(function() {
        console.log(toDosData);

        // html elemnts
        let $addNewButton = $('.add-new-button');
        let $newToDoBox = $('#newToDoBox');
        let $newToDoResponse = $('#newToDoResponse');
        let $inputToDo = $('#toDo');
        let $inputUsername = $('#username');
        let $inputIsDone = $('#isDone');
        let $inputHasAttachment = $('#hasAttachment');
        let $form = $('form');

        // handle newToDoFrom submit action
        $form.submit(function() {
            $.post($(this).attr('action'), $(this).serialize(), function(response) {
                if (response.status === 'ok') {
                    $newToDoResponse.text( 'Success' ).show().fadeOut( 2500 );
                    insertNewToDo(response.message)
                    $inputToDo.val('');
                    $newToDoBox.toggleClass('hidden');
                    console.log(response);
                }
            }, 'json');
            return false;
        });

        // set hidden fields for new toDo
        $inputUsername.val('mihai');
        $inputIsDone.val('false');
        $inputHasAttachment.val('false');

        // loop through each toDo and insert them as <li>
        $.each(toDosData, function(index, currentToDo) {

            let isDoneSettings = {
                liClass: '',
                inputVal: 'false',
                inputChecked: ''
            };

            if (currentToDo.isDone) {
                isDoneSettings.liClass = 'line-through';
                isDoneSettings.inputVal = 'true';
                isDoneSettings.inputChecked = 'checked';
            };

            // insert each toDo as <li> with a checkbox
            $('.toDoList').append(`<li class='${ isDoneSettings.liClass }'><img class='trash-icon' src='/assets/images/trash.png' /><input type='checkbox' name='${ currentToDo._id }' value='${ isDoneSettings.inputVal }' class='myCheckbox' ${ isDoneSettings.inputChecked } />${ currentToDo.toDo }</li>`);

            // select <input> elm just created and its sibling <img> elem
            let $thisInput = $(`input[name='${ currentToDo._id }']`);
            let $thisImgTrashElm = $thisInput.siblings('img');

            // bind onClick event to the <img> elm in order to delete current <li> when clicked
            $thisImgTrashElm.on('click', function() {
                // on click -> execute handler
                deleteToDoItemHandler($thisImgTrashElm);
            });

            // bind event handler to listen for changes on the checkbox and check or uncheck it accordingly
            $thisInput.on('click', function() {
                // on click -> execute handler
                checkboxChangeHandler($thisInput);
            });
        });

        // Show/hide newToDoBox when addNew button is clicked
        $addNewButton.on('click', function() {
            $newToDoBox.toggleClass('hidden');
            $inputToDo.focus();
        });

    });
};




/*
// Functionalities to build:

done - render all toDos with a check box at the beginning
done - marked as checked toDos which have isDone value true

done - strikethrough the text when the toDo is isDone
done - when a toDo is checked or unchecked by the user save the data to the MongoDB
done - when a toDo is checked or unchecked by the user strikethrough or delete the strikethrough
done - insert a delete option next to each toDo and when pressed delete it from MongoDB
done - insert add button to save new toDos to MongoDB

insert edit button to edit and update toDo in MongoDB

restructure the app to use different modules for the different functions used to decluter the app.js file

make the ineterface pretty
add a loading icon while api is being called

allow creating toDos for another user
allow for specifinging for which user we wnat to render the toDos

*/
