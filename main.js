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
            //save to local storage
            const todoList = getTodoList();
            const newTodoList = todoList.filter(x => x.id !== todo.id);
            localStorage.setItem('todo_list', JSON.stringify(newTodoList));

            //remove
            todoElement.remove();
        })
    }
    //add click event for mark-as-done button
    const markAsDoneButton = todoElement.querySelector('.mark-as-done');
    if(markAsDoneButton) {
        markAsDoneButton.addEventListener('click', function() {
            //update switch data-status in li element 
            //update class for div inner li element
            const currentStatus = todoElement.dataset.status;
            const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

            // get current todoList
            // update field 'status' of current todo
            // save to localStorage
            const todoList = getTodoList();
            const index = todoList.findIndex(x => x.id === todo.id);
            if(index >= 0) {
                todoList[index].status = newStatus;
                localStorage.setItem('todo_list', JSON.stringify(todoList));
            }

            //update data-status
            todoElement.dataset.status = newStatus;

            //update alert class
            const newAlertClass = currentStatus === 'completed' ? 'alert-secondary' : 'alert-success';
            divElement.classList.remove('alert-secondary', 'alert-success');
            divElement.classList.add(newAlertClass);
        })
    }

    //add click event form edit button
    const editButton = todoElement.querySelector('.edit');
   
    if(editButton) {
        editButton.addEventListener('click', function() {
            const submitForm = getFormSubmitElement();
            submitForm.dataset.id = todo.id;

            // get title todo
            const todoList = getTodoList();
            const targetTodo = todoList.find(x => x.id === todo.id);
            const todoTitle = targetTodo.title;
            
            // fill title to input field
            const inputText = document.getElementById('form__input');
            if(!inputText) return;
            inputText.value = todoTitle;

            console.log()
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
        return JSON.parse(localStorage.getItem('todo_list')) || [];
    } catch {
        return [];
    }
}

function addTodo() {
    // handle default submit form
    const submitForm = getFormSubmitElement();
    if(!submitForm) return;

    submitForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const dataSubmitFormId = submitForm.dataset.id;
        if(dataSubmitFormId) {
            const inputText = document.getElementById('form__input');
            //get todoList
            const currentTodo = getTodoList();
            const index = currentTodo.findIndex(x => x.id.toString() === submitForm.dataset.id);
            currentTodo[index].title = inputText.value;
            localStorage.setItem('todo_list', JSON.stringify(currentTodo));
            const todoTitle = document.querySelector(`#todoList > li[data-id="${dataSubmitFormId}"] .todo__title`);
            todoTitle.textContent = currentTodo[index].title;
        }else{

        // get input value
        const inputText = document.getElementById('form__input');
        if(!inputText || inputText.value.length === 0) return;
        // create new todo
        const newTodo = {
            id: Date.now() * Math.random(),
            title: inputText.value,
            status: 'pending'
        }

        //get lastest todo list
        const todoList = getTodoList();
        //add new todo
        todoList.push(newTodo);

        //save to localStorage
        localStorage.setItem('todo_list', JSON.stringify(todoList))
        const newLiElement = createTodoElement(newTodo);

        //update UI
        const ulElement = getTodoListElement();
        if(!ulElement) return;
       
        ulElement.appendChild(newLiElement);
        }
        submitForm.reset();
    })
}

// query form submit
function getFormSubmitElement() {
    return document.getElementById('submitForm');
}

// query todo list
function getTodoListElement() {
    return document.getElementById('todoList');
}

function setTodoList() {
    const todo = [
        {
            "id": Date.now() * Math.random(),
            "title":"VanllinaJS",
            "status":"completed"
        },
        {
            "id": Date.now() * Math.random(),
            "title":"TypeScript",
            "status":"pending"
        },
        {
            "id": Date.now() * Math.random(),
            "title":"RTK Query",
            "status":"pending"
        },
        {   
            "id": Date.now() * Math.random(),
            "title":"React Query",
            "status":"pending"
        },
        {
            "id": Date.now() * Math.random(),
            "title":"GraphQL",
            "status":"pending"
        }
    ]
    
    localStorage.setItem('todo_list', JSON.stringify(todo));
}

(function(){
    const todoList = getTodoList();
    renderTodoList(todoList, 'todoList');
    addTodo();
})()