document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task');
    const taskList = document.getElementById('tasks-list');

    // Load tasks from local storage on page load
    loadTasks();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        if (taskText !== '') {
            addTask(taskText);
            saveTasks();
            taskInput.value = '';
        }
    });

    taskList.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const taskItem = e.target.parentElement;
            taskItem.classList.toggle('checked');
            saveTasks();
        }
    });

    function addTask(taskText, isCompleted = false) {
        const taskItem = document.createElement('div');
        taskItem.className = 'task';
    
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isCompleted;
    
        const taskIndex = taskList.children.length + 1;
        taskItem.innerHTML = `
            <input type="checkbox" ${isCompleted ? 'checked' : ''}>
            <span>${taskIndex}. ${taskText}</span>
            <button class="delete-button">Delete</button>
        `;
    
        taskList.appendChild(taskItem);
    }

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            const taskItem = e.target.parentElement;
            const taskIndex = parseInt(e.target.getAttribute('data-index'), 10);
    
            // Remove the task item from the DOM
            taskItem.remove();
    
            // Remove the task from the tasks array and update local storage
            removeTask(taskIndex);
            saveTasks();
        }
    });
    
    function removeTask(index) {
        const taskItems = taskList.querySelectorAll('.task');
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
        // Remove the task from the tasks array
        tasks.splice(index - 1, 1);
    
        // Update the index attribute for remaining task items
        taskItems.forEach((taskItem, i) => {
            const deleteButton = taskItem.querySelector('.delete-button');
            deleteButton.setAttribute('data-index', i + 1);
        });
    
        // Save the updated tasks to local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));

        location.reload();
    }

    function saveTasks() {
        const tasks = [];
        const taskItems = taskList.querySelectorAll('.task');

        taskItems.forEach((taskItem, index) => {
            const isCompleted = taskItem.classList.contains('checked');
            const taskText = taskItem.textContent.trim().slice(3); // Remove index
            tasks.push({ text: taskText, completed: isCompleted });
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
        tasks.forEach((task) => {
            if (task.text.includes("Delete")){ 
                addTask(task.text.slice(0, -6), task.completed);
            } else {
                addTask(task.text, task.completed);
            }
            
            if (task.completed) {
                // Add the 'checked' class to maintain strikethrough effect
                const taskItem = taskList.lastChild;
                taskItem.classList.add('checked');
            }
        });
    }
});
