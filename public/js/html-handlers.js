// insert each toDo as <li> with a checkbox
function appendToDo(isDoneSettings, currentToDo, deleteToDoItemHandler, checkboxChangeHandler, toDoTextChangeHandler, apiUpdateToDo) {
    $('.toDoList').append(`<li class='${ isDoneSettings.liClass }'><img class='trash-icon' src='/assets/images/trash.png' /><input type='checkbox' name='${ currentToDo._id }' value='${ isDoneSettings.inputVal }' class='myCheckbox' ${ isDoneSettings.inputChecked } /><span class='checkboxOverlay'></span><input type='text' class='toDoText ${ isDoneSettings.liClass }' value='${ currentToDo.toDo }' /></li>`);

    // select <input> elm just created and its sibling <img> elem
    let $thisInputElm = $(`input[name='${ currentToDo._id }']`);
    let $thisImgTrashElm = $thisInputElm.siblings('img');
    let $thisToDoTextInputElm = $thisInputElm.siblings('input');


    // bind onClick event to the <img> elm in order to delete current <li> when clicked
    $thisImgTrashElm.on('click', function() {
        // on click -> execute handler
        deleteToDoItemHandler($thisImgTrashElm);
    });

    // bind event handler to listen for changes on the checkbox and check or uncheck it accordingly
    $thisInputElm.on('click', function() {
        // on click -> execute handler
        checkboxChangeHandler($thisInputElm, apiUpdateToDo);
    });

    $thisToDoTextInputElm.on('change', function() {
        toDoTextChangeHandler($thisToDoTextInputElm, apiUpdateToDo);
    });
};

export { appendToDo };
