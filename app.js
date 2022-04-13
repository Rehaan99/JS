const taskInput = document.querySelector(".task-input");
const taskButton = document.querySelector(".task-create-button");
const taskList = document.querySelector(".task-list");
const filterOption = document.querySelector(".sort-task");

document.addEventListener("DOMContentLoaded", getTasks);
taskButton.addEventListener("click", createTask);
taskList.addEventListener("click", taskButtonClickCheck);
filterOption.addEventListener("change", filterTask);

function getTasks() {
  const tasks = sortList(localStorageTasks());
  tasks.forEach((task) => {
    addTaskToPage(task);
  });
}

function sortList(tasks) {
  //bubble sort
  for (i = 0; i < tasks.length; i++) {
    for (j = 0; j < tasks.length - 1; j++) {
      if (tasks[j].id > tasks[j + 1].id) {
        const index = tasks[j];
        tasks[j] = tasks[j + 1];
        tasks[j + 1] = index;
      }
    }
  }
  return tasks;
}

function createTask(event) {
  if (taskInput.value.length === 0) {
    return;
  }
  const taskList = {
    task: taskInput.value,
    id: null,
    isComplete: false,
    wontDo: false,
  };
  saveLocalTasks(taskList);
  event.preventDefault();
  const allTasks = JSON.parse(localStorage.getItem("tasks"));
  addTaskToPage(allTasks[allTasks.length - 1]);
}

function addTaskToPage({ task: task, isComplete: complete, id: id }) {
  const taskDiv = document.createElement("div"),
    newTask = document.createElement("li"),
    completedButton = document.createElement("button"),
    trashButton = document.createElement("button");
  taskDiv.classList.add("task");
  newTask.innerText = task;
  newTask.id = id;
  newTask.classList.add("task-item");
  taskDiv.appendChild(newTask);
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("complete-btn");
  taskDiv.appendChild(completedButton);
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  taskDiv.appendChild(trashButton);
  taskList.appendChild(taskDiv);
  if (complete) {
    taskDiv.classList.toggle("completed");
  }
  taskInput.value = "";
}

function saveLocalTasks(task) {
  const tasks = localStorageTasks();
  if (task.id === null) {
    task.id = tasks.length;
  }
  tasks.push(task);
  const orderedTasks = sortList(tasks);
  localStorage.setItem("tasks", JSON.stringify(orderedTasks));
}

function localStorageTasks() {
  return (tasks =
    localStorage.getItem("tasks") === null
      ? (tasks = [])
      : JSON.parse(localStorage.getItem("tasks")));
}

function taskButtonClickCheck(event) {
  const item = event.target,
    taskElement = item.parentElement;

  if (item.classList[0] === "trash-btn") {
    removeLocalTasks(taskElement);
    taskElement.classList.add("fall");
    taskElement.addEventListener("transitionend", function () {
      taskElement.remove();
    });
  } else if (item.classList[0] === "complete-btn") {
    taskElement.classList.toggle("completed");
    const tasks = localStorageTasks(),
      filteredTasks = findSpecificTask(tasks, taskElement);
    filteredTasks.isComplete = !filteredTasks.isComplete;
    removeLocalTasks(taskElement, true);
    saveLocalTasks(filteredTasks);
  }
}

function findSpecificTask(tasks, taskElement) {
  return tasks.filter(function (task) {
    return task.id === parseInt(taskElement.children[0].id);
  })[0];
}

function removeLocalTasks(taskElement, changedState) {
  const tasks = localStorageTasks(),
    filteredTasks = tasks.filter(function (task) {
      return task.id !== parseInt(taskElement.children[0].id);
    }),
    deletedTask = findSpecificTask(tasks, taskElement);
  if (changedState) {
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
  } else {
    localStorage.setItem(
      "tasks",
      JSON.stringify(orderElementsByIds(filteredTasks, deletedTask.id))
    );
  }
}

function orderElementsByIds(listOfStorageTasks, deletedId) {
  listOfStorageTasks = sortList(listOfStorageTasks);
  listOfStorageTasks.forEach((task) => {
    if (task.id > deletedId) {
      document.getElementById(task.id.toString()).id = task.id -= 1;
    }
  });
  return listOfStorageTasks;
}

function filterTask(event) {
  const tasks = taskList.childNodes;
  tasks.forEach(function (task) {
    switch (event.target.value) {
      case "Oldest":
        task.style.display = "flex";
        break;
      case "Newest":
        break;
      case "Alphabetical":
        break;
      case "Complete":
        if (task.classList.contains("completed")) {
          task.style.display = "flex";
        } else {
          task.style.display = "none";
        }
        break;
      case "Incomplete":
        if (task.classList.contains("completed")) {
          task.style.display = "none";
        } else {
          task.style.display = "flex";
        }
        break;
    }
  });
}
