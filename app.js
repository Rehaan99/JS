const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

//event listener
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);

//functions
function addTodo(event) {
  const taskList = {
    task: todoInput.value,
    id: 1,
    isComplete: false,
    wontDo: false,
  };
  saveLocalTodos(taskList);
  event.preventDefault();
  addTaskToPage(taskList.task);
}

function addTaskToPage(todo) {
  const todoDiv = document.createElement("div"),
    newTodo = document.createElement("li"),
    completedButton = document.createElement("button"),
    trashButton = document.createElement("button");

  todoDiv.classList.add("todo");
  newTodo.innerText = todo;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
  todoList.appendChild(todoDiv);
  todoInput.value = "";
}

function deleteCheck(event) {
  const item = event.target;
  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;
    todo.classList.add("fall");
    removeLocalToDos(todo);
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  } else if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
  }
}

function filterTodo(event) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (event.target.value) {
      case "All":
        todo.style.display = "flex";
        break;
      case "Complete":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "Incomplete":
        if (todo.classList.contains("completed")) {
          todo.style.display = "none";
        } else {
          todo.style.display = "flex";
        }
        break;
    }
  });
}

function localStorageTasks() {
  return (todos =
    localStorage.getItem("todos") === null
      ? (todos = [])
      : JSON.parse(localStorage.getItem("todos")));
}

function saveLocalTodos(todo) {
  const todos = localStorageTasks();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  const todos = localStorageTasks();
  todos.forEach(({ task: todo }) => {
    addTaskToPage(todo);
  });
}
function removeLocalToDos(todo) {
  const todos = localStorageTasks();
  const todoIndex = todo.children[0].innerText;
  const filteredTodos = todos.filter(function (task) {
    return task.task !== todoIndex;
  });
  console.log(todoIndex);
  localStorage.setItem("todos", JSON.stringify(filteredTodos));
}
