const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", taskButtonClickCheck);
filterOption.addEventListener("change", filterTodo);

function getTodos() {
  const todos = localStorageTasks();
  sortList(todos);
  todos.forEach((todo) => {
    addTaskToPage(todo);
  });
}

function sortList(todos) {
  //bubble sort
  for (i = 0; i < todos.length; i++) {
    for (j = 0; j < todos.length - 1; j++) {
      if (todos[j].id > todos[j + 1].id) {
        const index = todos[j];
        todos[j] = todos[j + 1];
        todos[j + 1] = index;
      }
    }
  }
}

function addTodo(event) {
  const taskList = {
    task: todoInput.value,
    id: null,
    isComplete: false,
    wontDo: false,
  };
  saveLocalTodos(taskList);
  event.preventDefault();
  addTaskToPage(taskList);
}

function addTaskToPage({ task: todo, isComplete: complete }) {
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
  if (complete) {
    todoDiv.classList.toggle("completed");
  }
  todoInput.value = "";
}

function saveLocalTodos(todo) {
  const todos = localStorageTasks();
  if (todo.id === null) {
    todo.id = todos.length;
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function localStorageTasks() {
  return (todos =
    localStorage.getItem("todos") === null
      ? (todos = [])
      : JSON.parse(localStorage.getItem("todos")));
}

function taskButtonClickCheck(event) {
  const item = event.target;
  const todo = item.parentElement;

  if (item.classList[0] === "trash-btn") {
    todo.classList.add("fall");
    removeLocalToDos(todo);
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  } else if (item.classList[0] === "complete-btn") {
    todo.classList.toggle("completed");
    const todos = localStorageTasks();
    const filteredTodos = todos.filter(function (task) {
      return task.task === todo.children[0].innerText;
    });
    filteredTodos[0].isComplete = !filteredTodos[0].isComplete;
    removeLocalToDos(todo);
    saveLocalTodos(filteredTodos[0]);
  }
}

function removeLocalToDos(todo) {
  const todos = localStorageTasks();
  const todoIndex = todo.children[0].innerText;
  const filteredTodos = todos.filter(function (task) {
    return task.task !== todoIndex;
  });
  localStorage.setItem("todos", JSON.stringify(filteredTodos));
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
