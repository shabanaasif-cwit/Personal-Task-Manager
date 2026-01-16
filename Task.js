document.addEventListener("DOMContentLoaded", () => {
  // ---------- Task ----------
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

  // ---------- Task Manager ----------
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

      const task = new Task(crypto.randomUUID(), title, category, priority);
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

  // ---------- App ----------
  const manager = new TaskManager();

  const form = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");
  const allBtn = document.getElementById("allBtn");
  const pendingBtn = document.getElementById("pendingBtn");
  const completedBtn = document.getElementById("completedBtn");

  let currentFilter = "all";

  // ---------- Helpers ----------
  function clearTasks() {
    taskList.innerHTML = "";
  }

  function createText(tag, text, className = "") {
    const el = document.createElement(tag);
    el.textContent = text;
    if (className) el.className = className;
    return el;
  }

  // ---------- Render ----------
  function renderTask(task) {
    const container = document.createElement("div");
    container.className = "flex justify-between items-center border-b pb-2";

    const info = document.createElement("div");

    const title = createText( 
      "p",
      task.title,
      `font-medium ${task.isCompleted ? "line-through text-gray-400" : ""}`
    );

    const meta = createText(
      "p",
      `${task.category} • ${task.priority}`,
      "text-sm text-gray-500"
    );

    info.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "flex gap-2";

    const toggleBtn = createText("button", "✔", "text-green-600");
    toggleBtn.addEventListener("click", () => {
      manager.toggleTask(task.id);
      showTasks(currentFilter);
    });

    const deleteBtn = createText("button", "✖", "text-red-600");
    deleteBtn.addEventListener("click", () => {
      manager.deleteTask(task.id);
      showTasks(currentFilter);
    });

    actions.append(toggleBtn, deleteBtn);
    container.append(info, actions);
    taskList.appendChild(container);
  }

  function showTasks(filter) {
    currentFilter = filter;
    clearTasks();

    const tasks = manager.filterTasks(filter);
    if (tasks.length === 0) {
      taskList.appendChild(
        createText("p", "No tasks found", "text-gray-400 text-center")
      );
      return;
    }

    tasks.forEach(renderTask);
  }

  // ---------- Events ----------
  form.addEventListener("submit", e => {
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

    form.reset();
    showTasks(currentFilter);
  });

  allBtn.addEventListener("click", () => showTasks("all"));
  pendingBtn.addEventListener("click", () => showTasks("pending"));
  completedBtn.addEventListener("click", () => showTasks("completed"));

  // ---------- Init ----------
  showTasks("all");
});
