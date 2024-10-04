/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("Todolist test suite", () => {
  beforeEach(() => {
    // Clear the todos before each test
    all.length = 0;
  });

  test("Should add a new todo", () => {
    expect(all.length).toBe(0);
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    expect(all.length).toBe(1);
  });

  test("Should mark a todo as complete", () => {
    add({
      title: "Incomplete todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("Should retrieve overdue items", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    add({
      title: "Overdue todo",
      completed: false,
      dueDate: yesterday.toLocaleDateString("en-CA"),
    });
    expect(overdue().length).toBe(1);
    expect(overdue()[0].title).toBe("Overdue todo");
  });

  test("Should retrieve due today items", () => {
    const today = new Date().toLocaleDateString("en-CA");
    add({
      title: "Due today todo",
      completed: false,
      dueDate: today,
    });
    expect(dueToday().length).toBe(1);
    expect(dueToday()[0].title).toBe("Due today todo");
  });

  test("Should retrieve due later items", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    add({
      title: "Due later todo",
      completed: false,
      dueDate: tomorrow.toLocaleDateString("en-CA"),
    });
    expect(dueLater().length).toBe(1);
    expect(dueLater()[0].title).toBe("Due later todo");
  });
});
