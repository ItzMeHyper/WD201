"use strict";
const { Model, Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    // Method to add a new task to the database
    static async addTask(params) {
      return await Todo.create(params);
    }

    // Method to display the todo list
    static async showList() {
      console.log("My Todo list \n");

      // Display overdue tasks
      console.log("Overdue");
      const overdueTasks = await Todo.overdue();
      if (overdueTasks.length === 0) {
        console.log("No overdue tasks.");
      } else {
        console.log(
          overdueTasks.map((task) => task.displayableString()).join("\n"),
        );
      }
      console.log("\n");

      // Display tasks due today
      console.log("Due Today");
      const todayTasks = await Todo.dueToday();
      if (todayTasks.length === 0) {
        console.log("No tasks due today.");
      } else {
        console.log(
          todayTasks.map((task) => task.displayableString()).join("\n"),
        );
      }
      console.log("\n");

      // Display tasks due later
      console.log("Due Later");
      const laterTasks = await Todo.dueLater();
      if (laterTasks.length === 0) {
        console.log("No tasks due later.");
      } else {
        console.log(
          laterTasks.map((task) => task.displayableString()).join("\n"),
        );
      }
    }

    // Method to get overdue tasks
    static async overdue() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today, // Using Op.lt for "less than" comparison
          },
        },
      });
    }

    // Method to get tasks due today
    static async dueToday() {
      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
      );
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gte]: startOfToday, // Using Op.gte for "greater than or equal to"
            [Op.lt]: endOfToday, // Using Op.lt for "less than"
          },
        },
      });
    }

    // Method to get tasks due later
    static async dueLater() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: today, // Using Op.gt for "greater than" comparison
          },
        },
      });
    }

    // Method to mark a task as complete
    static async markAsComplete(id) {
      const todo = await Todo.findByPk(id);
      if (todo) {
        todo.completed = true; // Set completed to true
        await todo.save(); // Save the updated Todo
        console.log(`Marked todo ${id} as complete.`); // Debug log
      } else {
        throw new Error("Todo not found"); // Handle error
      }
    }

    // Method to display a task in a string format
    // Method to display a task in a string format
    displayableString() {
      const today = new Date();
      const dueDateObject = new Date(this.dueDate); // Ensure dueDate is a Date object
      const isToday =
        dueDateObject.toISOString().slice(0, 10) ===
        today.toISOString().slice(0, 10);
      let checkbox = this.completed ? "[x]" : "[ ]"; // Determine if the task is completed

      // Debugging logs
      console.log(
        `ID: ${this.id}, Title: ${this.title}, Due Date: ${dueDateObject.toISOString().slice(0, 10)}, Is Today: ${isToday}`,
      );

      // Format displayable string based on completion and due date
      if (this.completed) {
        // For completed tasks
        if (isToday) {
          return `${this.id}. ${checkbox} ${this.title}`; // Completed tasks due today do not show date
        } else {
          return `${this.id}. ${checkbox} ${this.title} ${dueDateObject.toISOString().slice(0, 10)}`; // Completed tasks due in the past or future show date
        }
      } else {
        // For incomplete tasks
        if (isToday) {
          return `${this.id}. ${checkbox} ${this.title}`; // Incomplete tasks due today do not show date
        } else {
          return `${this.id}. ${checkbox} ${this.title} ${dueDateObject.toISOString().slice(0, 10)}`; // Incomplete tasks due in the future or past show date
        }
      }
    }
  }

  // Initialize the Todo model with fields and configurations
  Todo.init(
    {
      title: DataTypes.STRING, // Title of the task
      dueDate: DataTypes.DATEONLY, // Due date of the task
      completed: DataTypes.BOOLEAN, // Completion status of the task
    },
    {
      sequelize,
      modelName: "Todo", // Name of the model
    },
  );

  return Todo; // Return the Todo model
};
