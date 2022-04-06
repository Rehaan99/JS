const todoInput = document.querySelector('.todo-input'); // Returns a DOM object, it targets the todo-input in HTML file.
const todoButton = document.querySelector('.todo-button'); // This is referring to the Button that was created in HTML, it is being assigned to the constant todoButton.
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

//event listener
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click',addTodo);// the addTodo function is run when the + button on the website is clicked.
todoList.addEventListener('click',deleteCheck);
filterOption.addEventListener('change', filterTodo);

//functions
function addTodo(event){
event.preventDefault(); // prevent form from submitting
//todo div
const todoDiv = document.createElement("div"); // Creates a new instance of a div.
todoDiv.classList.add("todo");//what does this mean?
//create LI
const newTodo = document.createElement("li");
newTodo.innerText= todoInput.value;
newTodo.classList.add("todo-item");
todoDiv.appendChild(newTodo);
//Add todo to local storage
saveLocalTodos(todoInput.value);
//check mark button
const completedButton = document.createElement("button");
completedButton.innerHTML= '<i class="fas fa-check"></i>';
completedButton.classList.add("complete-btn");
todoDiv.appendChild(completedButton);
//check trash button
const trashButton = document.createElement("button");
trashButton.innerHTML= '<i class="fas fa-trash"></i>';
trashButton.classList.add("trash-btn");
todoDiv.appendChild(trashButton);
//append to list
todoList.appendChild(todoDiv);
//clear todo input value
todoInput.value="";
};

function deleteCheck(event){
    const item = event.target;
    //delete todo
    if(item.classList[0]==='trash-btn'){
        const todo = item.parentElement; // makes todo equal to the parent of item (item is the delete button)
        todo.classList.add("fall");
        removeLocalToDos(todo);
        // waits for the transition (animation in CSS to end before running)     
        todo.addEventListener('transitionend', function() { 
        todo.remove();
        });
    } else if (item.classList[0]=== "complete-btn"){
        const todo = item.parentElement;
        todo.classList.toggle("completed");// if it is true it becomes false, if false it becomes true
    };
};

function filterTodo(event){
    const todos = todoList.childNodes;
    todos.forEach(function(todo){
        switch(event.target.value){
            case "All":
                todo.style.display="flex";
                break;
            case "Complete":
                if (todo.classList.contains("completed")){
                    todo.style.display="flex";
                } else{
                    todo.style.display="none";
                }
                break;
            case "Incomplete":
                if (todo.classList.contains("completed")){
                   todo.style.display="none";
                } else{
                     todo.style.display="flex";
                }
                break;
        }
    });
};

function saveLocalTodos(todo){
    //check if local storage already exists
    let todos;
    if(localStorage.getItem('todos')=== null){
        todos=[];
    }else {
        todos=JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem("todos",JSON.stringify(todos));
}

function getTodos(){
    let todos;
    if(localStorage.getItem('todos')=== null){
        todos=[];
    }else {
        todos=JSON.parse(localStorage.getItem('todos'));
    }
    todos.forEach((todo) =>{
        //todo div
        const todoDiv = document.createElement("div"); // Creates a new instance of a div.
        todoDiv.classList.add("todo");//what does this mean?
        //create LI
        const newTodo = document.createElement("li");
        newTodo.innerText= todo;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);
        //check mark button
        const completedButton = document.createElement("button");
        completedButton.innerHTML= '<i class="fas fa-check"></i>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);
        //check trash button
        const trashButton = document.createElement("button");
        trashButton.innerHTML= '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);
        //append to list
        todoList.appendChild(todoDiv);
        //clear todo input value
        todoInput.value="";
    })
}
function removeLocalToDos(todo){
        let todos;
    if(localStorage.getItem('todos')=== null){
        todos=[];
    }else {
        todos=JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1); // what index from array do u wanna remove and how many?
    console.log(todoIndex);
    localStorage.setItem('todos',JSON.stringify(todos));
}