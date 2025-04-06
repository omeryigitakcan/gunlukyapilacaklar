// Selectors

const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');


// Event Listeners

toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ?
    changeTheme('standard')
    : changeTheme(localStorage.getItem('savedTheme'));

// Functions;
function addToDo(event) {
    // Prevents form from submitting / Prevents form from relaoding;
    event.preventDefault();

    // toDo DIV;
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);

    // Create LI
    const newToDo = document.createElement('li');
    if (toDoInput.value === '') {
            alert("Mal mısın bişey yazsana");
        } 
    else {
        // newToDo.innerText = "hey";
        newToDo.innerText = toDoInput.value;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        // Adding to local storage;
        savelocal(toDoInput.value);

        // check btn;
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add('check-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(checked);
        checked.addEventListener('click', function() {
        toggleCheckStatus(checked, newToDo);  // Check durumunu değiştir
        });

        toDoDiv.appendChild(checked);
        // delete btn;
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add('delete-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        // Append to list;
        toDoList.appendChild(toDoDiv);

        // CLearing the input;
        toDoInput.value = '';
    }

}   


function deletecheck(event){

    // console.log(event.target);
    const item = event.target;

    // delete
    if(item.classList[0] === 'delete-btn')
    {
        // item.parentElement.remove();
        // animation
        item.parentElement.classList.add("fall");

        //removing local todos;
        removeLocalTodos(item.parentElement);

        item.parentElement.addEventListener('transitionend', function(){
            item.parentElement.remove();
        })
    }

    // check
    if(item.classList[0] === 'check-btn')
    {
        item.parentElement.classList.toggle("completed");
    }


}


// Saving to local storage:
function savelocal(todoText) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const newTodo = {
        text: todoText,
        completed: false  // Başlangıçta tamamlanmamış olarak kaydedilir
    };

    todos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));  // Yeni todos verisini kaydet
}



function getTodos() {
    // Check: if item/s are there;
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    // Loop through each todo item and create HTML elements
    todos.forEach(function(todo) {
        // toDo DIV;
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);

        // Create LI
        const newToDo = document.createElement('li');
        newToDo.innerText = todo.text;  // `text` kaydedildiği için burada text kullanıyoruz
        newToDo.classList.add('todo-item');
        if (todo.completed) {
            newToDo.classList.add('completed');  // Eğer tamamlanmışsa, 'completed' sınıfı eklenir
        }
        toDoDiv.appendChild(newToDo);

        // Check button (check-btn or standard-button)
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add(todo.completed ? 'standard-button' : 'check-btn', `${savedTheme}-button`);
        // Add click event to toggle completion status
        checked.addEventListener('click', function() {
            toggleCheckStatus(checked, newToDo, todo.text);  // Durumu değiştirme fonksiyonunu çağırıyoruz
        });
        toDoDiv.appendChild(checked);

        // Delete button
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        // Add click event to delete todo
        deleted.addEventListener('click', function() {
            deleteTodo(todo.text, toDoDiv);  // Todo öğesini silme fonksiyonunu çağırıyoruz
        });
        toDoDiv.appendChild(deleted);

        // Append to list;
        toDoList.appendChild(toDoDiv);
    });
}

// Toggle between check-btn and standard-button, update status
function toggleCheckStatus(button, todoElement, todoText) {
    if (button.classList.contains('check-btn')) {
        button.classList.remove('check-btn');
        button.classList.add('standard-button');
        todoElement.classList.add('completed');  // Todo'yu tamamlandı olarak işaretle
    } else {
        button.classList.remove('standard-button');
        button.classList.add('check-btn');
        todoElement.classList.remove('completed');  // Todo'yu tamamlanmamış olarak işaretle
    }
    updateTodoInLocalStorage(todoText, todoElement.classList.contains('completed'));
}

// Update the todo in localStorage after toggling completion
function updateTodoInLocalStorage(todoText, isCompleted) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoIndex = todos.findIndex(todo => todo.text === todoText);

    if (todoIndex !== -1) {
        todos[todoIndex].completed = isCompleted;  // Güncellenmiş durumu kaydet
        localStorage.setItem('todos', JSON.stringify(todos));  // Güncellenmiş todos verisini kaydet
    }
}

// Delete todo from localStorage
function deleteTodo(todoText, todoElement) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.filter(todo => todo.text !== todoText);  // Silinen öğeyi todos dizisinden kaldır
    localStorage.setItem('todos', JSON.stringify(todos));  // Güncellenmiş todos verisini kaydet

    // Silinen todo öğesini DOM'dan kaldır
    todoElement.remove();
}



function removeLocalTodos(todo){
    //Check: if item/s are there;
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    const todoIndex =  todos.indexOf(todo.children[0].innerText);
    // console.log(todoIndex);
    todos.splice(todoIndex, 1);
    // console.log(todos);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Change theme function:
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    // Change blinking cursor for darker theme:
    color === 'darker' ? 
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;
    // Change todo color without changing their status (completed or not):
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ? 
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    // Change buttons color according to their type (todo, check or delete):
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
              button.className = `check-btn ${color}-button`;  
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`; 
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
}
