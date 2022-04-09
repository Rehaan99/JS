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
  const overallTask = JSON.parse(localStorage.getItem("todos"));
  addTaskToPage(overallTask[overallTask.length - 1]);
}

function addTaskToPage({ task: todo, isComplete: complete, id: id }) {
  const todoDiv = document.createElement("div"),
    newTodo = document.createElement("li"),
    completedButton = document.createElement("button"),
    trashButton = document.createElement("button");

  todoDiv.classList.add("todo");
  newTodo.innerText = todo;
  newTodo.id = id;
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
  const item = event.target,
    todo = item.parentElement;

  if (item.classList[0] === "trash-btn") {
    removeLocalToDos(todo);
    todo.classList.add("fall");
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  } else if (item.classList[0] === "complete-btn") {
    todo.classList.toggle("completed");
    const todos = localStorageTasks(),
      filteredTodos = todos.filter(function (task) {
        return task.id === parseInt(todo.children[0].id);
      });
    filteredTodos[0].isComplete = !filteredTodos[0].isComplete;
    removeLocalToDos(todo, true);
    saveLocalTodos(filteredTodos[0]);
  }
}

function removeLocalToDos(todo, changedState) {
  const todos = localStorageTasks(),
    todoIndex = parseInt(todo.children[0].id),
    filteredTodos = todos.filter(function (task) {
      return task.id !== todoIndex;
    }),
    deletedTask = todos.filter(function (task) {
      return task.id === todoIndex;
    });
  if (changedState) {
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
  } else {
    localStorage.setItem(
      "todos",
      JSON.stringify(orderStorageByIds(filteredTodos, deletedTask[0].id))
    );
  }
}

function orderStorageByIds(listOfStorageTasks, deletedId) {
  listOfStorageTasks.forEach((task) => {
    if (task.id > deletedId) {
      document.getElementById(task.id.toString()).id = task.id -= 1;
    }
  });
  return listOfStorageTasks;
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
