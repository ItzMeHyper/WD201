"use strict";
const {
  Model,
  Op, // Import Op here
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      const overdueItems = await this.overdue();
      if (overdueItems.length > 0) {
        console.log("Overdue");
        overdueItems.forEach((item) => console.log(item.displayableString()));
      }
      console.log("\n");

      const dueTodayItems = await this.dueToday();
      if (dueTodayItems.length > 0) {
        console.log("Due Today");
        dueTodayItems.forEach((item) => console.log(item.displayableString()));
      }
      console.log("\n");

      const dueLaterItems = await this.dueLater();
      if (dueLaterItems.length > 0) {
        console.log("Due Later");
        dueLaterItems.forEach((item) => console.log(item.displayableString()));
      }
    }

    static async overdue() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today, // Use Op here
          },
          completed: false,
        },
      });
    }

    static async dueToday() {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.between]: [startOfDay, endOfDay],
          },
          completed: false,
        },
      });
    }

    static async dueLater() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: today, // Use Op here
          },
          completed: false,
        },
      });
    }

    static async markAsComplete(id) {
      return await Todo.update({ completed: true }, { where: { id: id } });
    }

    displayableString() {
      const checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );

  return Todo;
};
