import { completeTasks, createTasks, listTasks, importantTasks } from "../services/tasks-service.js";
import { input } from "../components/input.js";
import { logout } from "../services/sessions-service.js";
import STORE from "../../store.js";
import DOMHandler from "../../dom-handler.js";
import LoginPage from "./login-page.js";

function render() {
  const currentTab = STORE.currentList
  return `
    <header class="flex header header--home">
      <h1 class="title--home">{ do<span class="span--title--home">able</span> }</h1>
      <div class="logout--home">
        <img src="css/assets/logout.png" class="important--home--icon js-logout"></img>
      </div>
    </header>
    <main class="section">
    <section class="container">
      <div>
        <div class="flex">
          <div class="title--home--conteiner">
            <p>Sort</p>
          </div>
          <div class="input--home--conteiner">
            <select class="select__input selected--home" name="sort" id="sort">
              <option value="alphabetical" ${STORE.currentSort === "alphabetical" ? "selected" : ""}>Alphabetical (a-z)</option>
              <option value="importance" ${STORE.currentSort === "importance" ? "selected" : ""}>Importance</option>
              <option value="due_date" ${STORE.currentSort === "due_date" ? "selected" : ""}>Due date</option>
            </select>
          </div>
        </div>
        <div class="flex checkbox--home views--home--list">
          <div class="title--home--conteiner">
            <p data-tab="normal">Show</p>
          </div>
          <div class="flex class="input--home--conteiner">
            <input type="checkbox" data-tab="pending" ${currentTab === "pending" ? "checked" : ""}>
            <p class="checkbox--text--home">Only pending</p>
            <input type="checkbox" data-tab="important"  ${currentTab === "important" ? "checked" : ""}>
            <p class="checkbox--text--home">Only important</p>
          </div>
        </div>
      </div>
      <div>
        <ul class="js-tasks-list ul--home--list">
          ${currentTab == "normal" ? addTasks() : ""}
          ${currentTab == "important" ? addTasksImportant() : ""}
          ${currentTab == "pending" ? addTasksPending() : ""}
        </ul>
      </div>
      <form class="flex flex-column gap-4 mb-4 js-NewTask-form">
        ${input({
          id: "title",
          placeholder: "do the dishes...",
          name: "title",
          type: "text",
          required: true
        })}
        ${input({
          id: "due_date",
          name: "due_date",
          type: "date"
        })}
        <button type="submit" class="button button--primary">ADD TASK</button>        
      </form>
    </section>
  </main>
  `;
}

function listenSelected() {
  const a = document.querySelector(".selected--home");

  a.addEventListener("click", async (event) => {
    event.preventDefault();

    const selected = event.target.value;

    if (STORE.currentSort === selected) {
      return
    } else {
      STORE.currentSort = selected
      DOMHandler.reload()    
    }

  });
}


function listenLogout() {
  const a = document.querySelector(".js-logout");

  a.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      await logout();
      DOMHandler.load(LoginPage);
    } catch (error) {
      console.log(error);
    }
  });
}

function addTask(task) {
  let important = ""
  if (task.important == true && task.completed == true) {
    important = "importantcompleted"
  } else if (task.important == true && task.completed == false){
    important = "important"
  } else if (task.important == false) {
    important = "notimportant"
  }
  return `
    <li class="js-task list--home" data-id="${task.id}">
        <div class="js-task-info flex">
          <div class="input--home--list">
            <input type="checkbox" class="js-complete-task" data-id="${task.id}" ${task.completed == true ? "checked" : null}>
          </div>
          <div class="title--home--list">
            <p>${task.title}</p>
          </div>
          <div class="icon--home--list">
            <img src="css/assets/${important}.png" class="important--home--icon js-important-task" data-id="${task.id}"></img>
          </div>
        </div>
        <div class="${task.due_date == null ? "none" : "flex"} due_date--home--list">
          <p class="due_date--text--home--list">${task.due_date}</p>
        </div>
    </li>
  `;
}

function listenTab() {
  const viewselect = document.querySelector(".views--home--list");
  viewselect.addEventListener("click", event => {
    event.preventDefault();
    const link = event.target.dataset.tab;
    if (!link) return;

    STORE.currentList = link
    DOMHandler.reload();
  });
}

async function addTasks() {
  const tasks = await listTasks();

  STORE.tasks = tasks;

  const taskList = document.querySelector(".js-tasks-list");
  let sortTaskList = []
  if (STORE.currentSort == "alphabetical") {
    sortTaskList = tasks.sort((a, b) => {
      if (a.title.toLowerCase() === b.title.toLowerCase()) {
        return 0
      }
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1
      }
      return -1
    });
  } else if (STORE.currentSort === "importance") {
    sortTaskList = tasks.sort((a, b) => {
      return (a.important === b.important)? 0 : a.important? -1 : 1;
    });
  } else if (STORE.currentSort === "due_date") {
    sortTaskList = tasks.sort((a, b) => {
      if (a.due_date == null) return 1;
      if (b.due_date == null) return -1;

      var firstDate = new Date(a.due_date),
      secondDate = new Date(b.due_date);

      if (firstDate < secondDate) return 1;
      if (firstDate > secondDate) return -1;
      return 0
    })
  }
  taskList.innerHTML = sortTaskList.map(function(task) {
    return addTask(task);
  }).join("");
}

async function addTasksImportant() {
  const tasks = await listTasks();

  STORE.tasks = tasks;

  const taskList = document.querySelector(".js-tasks-list");
  let sortTaskList = []
  if (STORE.currentSort == "alphabetical") {
    sortTaskList = tasks.sort((a, b) => {
      if (a.title.toLowerCase() === b.title.toLowerCase()) {
        return 0
      }
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1
      }
      return -1
    });
  } else if (STORE.currentSort === "importance") {
    sortTaskList = tasks.sort((a, b) => {
      return (a.important === b.important)? 0 : a.important? -1 : 1;
    });
  } else if (STORE.currentSort === "due_date") {
    sortTaskList = tasks.sort((a, b) => {
      if (a.due_date == null) return 1;
      if (b.due_date == null) return -1;

      var firstDate = new Date(a.due_date),
      secondDate = new Date(b.due_date);

      if (firstDate < secondDate) return 1;
      if (firstDate > secondDate) return -1;
      return 0
    })
  }
  taskList.innerHTML = sortTaskList.map(function(task) {
    if (task.important === true) {
      return addTask(task);
    }
  }).join("");
}

async function addTasksPending() {
  const tasks = await listTasks();

  STORE.tasks = tasks;

  const taskList = document.querySelector(".js-tasks-list");
  let sortTaskList = []
  if (STORE.currentSort == "alphabetical") {
    sortTaskList = tasks.sort((a, b) => {
      if (a.title.toLowerCase() === b.title.toLowerCase()) {
        return 0
      }
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1
      }
      return -1
    });
  } else if (STORE.currentSort === "importance") {
    sortTaskList = tasks.sort((a, b) => {
      return (a.important === b.important)? 0 : a.important? -1 : 1;
    });
  } else if (STORE.currentSort === "due_date") {
    sortTaskList = tasks.sort((a, b) => {
      if (a.due_date == null) return 1;
      if (b.due_date == null) return -1;

      var firstDate = new Date(a.due_date),
      secondDate = new Date(b.due_date);

      if (firstDate < secondDate) return 1;
      if (firstDate > secondDate) return -1;
      return 0
    })
  }
  taskList.innerHTML = sortTaskList.map(function(task) {
    if (task.completed == false) {
      return addTask(task);
    }
  }).join("");
}

function listenSubmit() {
  const form = document.querySelector(".js-NewTask-form");
  form.addEventListener("submit", async event => {
    event.preventDefault();

    const { title, due_date } = event.target;

    const data = {
      title: title.value,
      due_date: due_date.value,
    };

    const task = await createTasks(data);
    DOMHandler.load(HomePage)
  });
}

function listenComplete() {
  const completeform = document.querySelector(".js-tasks-list");
  completeform.addEventListener("click", async event => {
    event.preventDefault();
    if (!event.target.classList.contains("js-complete-task")) return;

    const tasks = STORE.tasks.filter(
      (element) => element.id == event.target.dataset.id
    );

    try {
      if (tasks[0].completed === true) {
        tasks[0].completed = false
      } else {
        tasks[0].completed = true
      }

      const newDataForTask = {
        completed: tasks[0].completed
      }

      const updatedTask = await completeTasks(newDataForTask, event.target.dataset.id);
      STORE.tasks = await listTasks();
      DOMHandler.load(HomePage);

    } catch (error) {
      console.log(error);
    }    
  });
}

function listenImportant() {
  const importantform = document.querySelector(".js-tasks-list");
  importantform.addEventListener("click", async event => {
    event.preventDefault();
    if (!event.target.classList.contains("js-important-task")) return;

    const tasks = STORE.tasks.filter(
      (element) => element.id == event.target.dataset.id
    );

    try {
      if (tasks[0].important === true) {
        tasks[0].important = false
      } else {
        tasks[0].important = true
      }

      const newDataForTask = {
        important: tasks[0].important
      }

      const updatedTask = await importantTasks(newDataForTask, event.target.dataset.id);
      STORE.tasks = await listTasks();
      DOMHandler.load(HomePage);

    } catch (error) {
      console.log(error);
    }    
  });
}


const HomePage = {
  toString() {
    return render();
  },
  addListeners() {
    listenSubmit();
    listenComplete();
    listenImportant();
    listenTab();
    listenLogout();
    listenSelected();
  }
};

export default HomePage;