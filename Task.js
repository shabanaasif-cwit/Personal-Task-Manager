// ================= Task Class =================
class Task {
  constructor(id, title, category, priority, isCompleted = false, createdAt = null) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.priority = priority;
    this.isCompleted = isCompleted;
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
  }

  toggleComplete() {
    this.isCompleted = !this.isCompleted;
  }
}

// ================= TaskManager Class =================
class TaskManager {
  constructor() {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    this.tasks = saved.map(
      t => new Task(t.id, t.title, t.category, t.priority, t.isCompleted, t.createdAt)
    );
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  addTask(title, category, priority) {
    const exists = this.tasks.some(
      t => t.title.toLowerCase() === title.toLowerCase() && t.category === category
    );
    if (exists) return null;

    const task = new Task(Date.now(), title, category, priority);
    this.tasks.push(task);
    this.save();
    return task;
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.toggleComplete();
      this.save();
    }
  }

  filterTasks(filter) {
    if (filter === "completed") return this.tasks.filter(t => t.isCompleted);
    if (filter === "pending") return this.tasks.filter(t => !t.isCompleted);
    return this.tasks;
  }
}

// ================= App Logic =================
const manager = new TaskManager();

const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const allBtn = document.getElementById("allBtn");
const pendingBtn = document.getElementById("pendingBtn");
const completedBtn = document.getElementById("completedBtn");

// Add Task
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const priority = document.querySelector('input[name="priority"]:checked')?.value;

  if (!title || !category || !priority) {
    alert("Please fill all fields");
    return;
  }

  const task = manager.addTask(title, category, priority);

  if (!task) {
    alert("This task already exists in this category!");
    return;
  }

  showTasks("all");
  form.reset();
});

// Render One Task
function renderTask(task) {
  const div = document.createElement("div");
  div.className = "flex justify-between items-center border-b pb-2";

  div.innerHTML = `
    <div>
      <p class="font-medium ${task.isCompleted ? "line-through text-gray-400" : ""}">
        ${task.title}
      </p>
      <p class="text-sm text-gray-500">
        ${task.category} • ${task.priority}
      </p>
    </div>
    <div class="flex gap-2">
      <button class="text-green-600" onclick="handleToggle(${task.id})">✔</button>
      <button class="text-red-600" onclick="handleDelete(${task.id})">✖</button>
    </div>
  `;

  taskList.appendChild(div);
}

// Render List
function showTasks(filter) {
  taskList.innerHTML = "";
  manager.filterTasks(filter).forEach(renderTask);
}

// Actions
function handleToggle(id) {
  manager.toggleTask(id);
  showTasks("all");
}

function handleDelete(id) {
  manager.deleteTask(id);
  showTasks("all");
}

// Filters
allBtn.addEventListener("click", () => showTasks("all"));
pendingBtn.addEventListener("click", () => showTasks("pending"));
completedBtn.addEventListener("click", () => showTasks("completed"));

// Load saved tasks on startup
showTasks("all");
