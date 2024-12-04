document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    const todoList = document.getElementById('todo-list');
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo();
    });

    function addTodo() {
        const task = todoInput.value.trim();
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        if (task && startTime && endTime) {
            const todo = {
                id: Date.now(),
                task,
                startTime,
                endTime,
                completed: false,
                overdue: false
            };
            todos.push(todo);
            saveToLocalStorage();
            renderTodos();
            todoInput.value = '';
            startTimeInput.value = '';
            endTimeInput.value = '';
        }
    }

    function renderTodos(filter = 'all') {
        todoList.innerHTML = '';
        let filteredTodos = [];
        let message = '';
        const currentTime = new Date().toISOString();

        switch (filter) {
            case 'completed':
                filteredTodos = todos.filter(todo => todo.completed);
                message = filteredTodos.length === 0 ? 'No tasks are completed.' : '';
                break;
            case 'pending':
                filteredTodos = todos.filter(todo => !todo.completed && !todo.overdue);
                message = filteredTodos.length === 0 ? 'No tasks are pending.' : '';
                break;
            case 'overdue':
                filteredTodos = todos.filter(todo => todo.overdue && !todo.completed);
                message = filteredTodos.length === 0 ? 'No tasks are overdue.' : '';
                break;
            default:
                filteredTodos = todos;
                break;
        }

        if (filteredTodos.length === 0 && message) {
            todoList.innerHTML = <li class="message">${message}</li>;
        }

        filteredTodos.forEach(todo => {
            if (currentTime > todo.endTime && !todo.completed) {
                todo.overdue = true;
            }
            const li = document.createElement('li');
            li.classList.add('todo-item');
            if (todo.completed) {
                li.classList.add('completed');
            }
            if (todo.overdue && !todo.completed) {
                li.classList.add('overdue');
            }
            li.innerHTML = `
                <span>${todo.task} (Start: ${new Date(todo.startTime).toLocaleString()}, End: ${new Date(todo.endTime).toLocaleString()})</span>
                <div>
                    <button class="edit" onclick="editTodo(${todo.id})">Edit</button>
                    <button class="delete" onclick="deleteTodo(${todo.id})">Delete</button>
                    <button class="complete" onclick="toggleComplete(${todo.id})">${todo.completed ? 'Undo' : 'Complete'}</button>
                </div>
            `;
            todoList.appendChild(li);
        });
    }

    function saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    window.deleteTodo = function(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveToLocalStorage();
        renderTodos();
    }

    window.editTodo = function(id) {
        const todo = todos.find(todo => todo.id === id);
        todoInput.value = todo.task;
        startTimeInput.value = todo.startTime;
        endTimeInput.value = todo.endTime;
        todos = todos.filter(todo => todo.id !== id);
        saveToLocalStorage();
        renderTodos();
    }

    window.toggleComplete = function(id) {
        const todo = todos.find(todo => todo.id === id);
        todo.completed = !todo.completed;
        todo.overdue = false;
        saveToLocalStorage();
        renderTodos();
    }

    window.filterTasks = function(filter) {
        renderTodos(filter);
    }

    renderTodos();
});
