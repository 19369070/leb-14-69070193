
const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

let tasks = [];

const savedTasks = localStorage.getItem("tasks");

if (savedTasks !== null) {
    tasks = JSON.parse(savedTasks);
} else {
    const oldTasks = todoList.querySelectorAll("li");

    for (let i = 0; i < oldTasks.length; i++) {
        tasks.push(oldTasks[i].childNodes[0].textContent.trim());
    }

    saveTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTasks() {
    todoList.innerHTML = "";

    for (let i = 0; i < tasks.length; i++) {
        const li = document.createElement("li");
        li.textContent = tasks[i];

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "ลบ";

        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }
}

addBtn.addEventListener("click", function() {
    const task = todoInput.value.trim();

    if (task !== "") {
        tasks.push(task);
        saveTasks();
        showTasks();
        todoInput.value = "";
    }
});

todoList.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-btn")) {
        const li = event.target.parentElement;
        const index = Array.from(todoList.children).indexOf(li);

        tasks.splice(index, 1);
        saveTasks();
        showTasks();
    }
});

showTasks();
