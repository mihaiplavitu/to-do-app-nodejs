import { appendToDo } from './html-handlers.js';
import { getExistingToDos, apiUpdateToDo } from './api-calls.js';
import { deleteToDoItemHandler, checkboxChangeHandler, toDoTextChangeHandler } from './event-handlers.js';

// get existing ToDos
getExistingToDos(generateToDoList);

// main function
function generateToDoList(toDosData) {
    $(document).ready(function() {

        // html elemnts
        let $loading = $('.loading');
        let $addNewButton = $('.add-new-button');
        let $newToDoBox = $('#newToDoBox');
        let $newToDoResponse = $('#newToDoResponse');
        let $inputToDo = $('#toDo');
        let $inputIsDone = $('#isDone');
        let $inputHasAttachment = $('#hasAttachment');
        let $form = $('#newToDoFrom');

        // api call is finsihed and we hide loading text
        $loading.addClass('hidden');

        // log the api call results
        console.log('to dos from db: ' + JSON.stringify(toDosData));

        // loop through each toDo and insert them as <li> in the html
        $.each(toDosData, function(index, currentToDo) {

            //create object for <li> attributes and settings
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
            appendToDo(isDoneSettings, currentToDo, deleteToDoItemHandler, checkboxChangeHandler, toDoTextChangeHandler, apiUpdateToDo);

        });

        // Show/hide newToDoBox when addNew button is clicked
        $addNewButton.on('click', function() {
            $newToDoBox.toggleClass('hidden');
            $inputToDo.focus();
        });

        // set hidden fields on form for new toDo
        $inputIsDone.val('false');
        $inputHasAttachment.val('false');

        // handler for newToDoFrom submit action
        $form.submit(function() {
            $.post($(this).attr('action'), $(this).serialize(), function(response) {
                if (response.status === 'ok') {
                    console.log('to do created: ' + JSON.stringify(response.message))
                    $newToDoResponse.text( 'Success' ).show().fadeOut( 2500 );

                    let isDoneSettings = {
                        liClass: '',
                        inputVal: 'false',
                        inputChecked: ''
                    };

                    let currentToDo = response.message;

                    appendToDo(isDoneSettings, currentToDo, deleteToDoItemHandler, checkboxChangeHandler, toDoTextChangeHandler, apiUpdateToDo)
                    // rest input text box to blank
                    $inputToDo.val('');
                    $newToDoBox.toggleClass('hidden');
                }
            }, 'json');
            return false;
        });

    });
};

/*
Functionalities to build for client side:

done - render all toDos with a checkbox at the beginning
done - marked as checked toDos which have isDone value true
done - strikethrough the text when the toDo is isDone
done - when a toDo is checked or unchecked by the user save the data to the MongoDB
done - when a toDo is checked or unchecked by the user strikethrough or delete the strikethrough
done - insert a delete option next to each toDo and when pressed delete it from MongoDB
done - insert add button to save new toDos to MongoDB
done - restructure the app to use different modules for the different functions used to decluter the app.js file
done - edit and update existing toDo text in MongoDB
done - make the ineterface pretty
done - add a loading icon while api is being called

if API call fails, don't render the toDo in the html. show error instead
prevent creation of empty toDos

*/
