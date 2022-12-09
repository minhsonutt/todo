function createTodoElement(todo) {
    if(!todo) return null;

    // find template
    const todoTemplate = document.getElementById('todoTemplate');
    if(!todoTemplate) return;

    // clone li element
    const todoElement = todoTemplate.content.firstElementChild.cloneNode(true);
    todoElement.dataset.id = todo.id;
    todoElement.dataset.status = todo.status;

    // render todo status
    const divElement = todoElement.querySelector('div.todo');
    if(divElement) {
        const alertClass = todo.status === 'completed' ? 'alert-success' : 'alert-secondary';
        divElement.classList.remove('alert-secondary');
        divElement.classList.add(alertClass);
    }

    // update content where needed
    const titleElement = todoElement.querySelector('.todo__title');
    if(titleElement) titleElement.textContent = todo.title;
    // TODO: attach event for button
    // Each li has its own event attached
    // add click event for remove button 
    const removeButton = todoElement.querySelector('.remove');
    if(removeButton) {
        removeButton.addEventListener('click', function() {
            todoElement.remove()
        })
    }
    //add clickc event for mark-as-done button
    const markAsDoneButton = todoElement.querySelector('.mark-as-done');
    if(markAsDoneButton) {
        markAsDoneButton.addEventListener('click', function() {
            //update switch data-status in li element 
            //update class for div inner li element
            const currentStatus = todoElement.dataset.status;
            const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
            todoElement.dataset.status = newStatus;

            const newAlertClass = currentStatus === 'completed' ? 'alert-secondary' : 'alert-success';
            divElement.classList.remove('alert-secondary', 'alert-success');
            divElement.classList.add(newAlertClass);
        })
    }

    return todoElement;
}

function renderTodoList(todoList, ulElementId) {
    if(!Array.isArray(todoList) || todoList.length === 0) return;

    //find ul element
    const ulElement = document.getElementById(ulElementId);
    if(!ulElement) return;

    // loop through todoList
    // each todo --> create li element --> append to ul
    for(const todo of todoList) {
        const liElement = createTodoElement(todo);
        ulElement.appendChild(liElement)
    }
}

function getTodoList() {
    try {
        return JSON.parse(localStorage.getItem('todo_list'));
    } catch {
        return [];
    }
}

(function(){
    const todoList = getTodoList();
    renderTodoList(todoList, 'todoList');
})()