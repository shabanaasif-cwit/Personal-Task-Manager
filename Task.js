export default class Task {
  constructor(id, title, category, priority) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.priority = priority;
    this.isCompleted = false;
    this.createdAt = new Date();
  }

  toggleComplete() {
    this.isCompleted = !this.isCompleted;
  }

  getDetails() {
    return `${this.title} | ${this.category} | ${this.priority} | ${
      this.isCompleted ? "Completed" : "Pending"
    }`;
  }
}
    