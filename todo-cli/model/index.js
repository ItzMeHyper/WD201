const { connect } = require("../connectDb.js");
const Todo = require("../TodoModel.js");

const createTodo = async () => {
  try {
    await connect();
    const todo = await Todo.addTask({
      title: "Second item",
      dueDate: new Date(),
      completed: false,
    });
    console.log(`Created todo with ID: ${todo.id}`);
  } catch (error) {
    console.error(error);
  }
};

const countTimes = async () => {
  try {
    const totalCount = await Todo.count();
    console.log(`Found ${totalCount} items in the table!`);
  } catch (error) {
    console.error(error);
  }
};
const getAllTodos = async () => {
  try {
    const todos = await Todo.findAll();
    const todoList = todos.map((todo) => todo.displayableString()).join("\n");
    console.log(todoList);
  } catch (error) {
    console.error(error);
  }
};
const getSingleTodo = async () => {
  try {
    const todo = await Todo.findOne({
      where: {
        completed: false,
      },
      order: [["id", "DESC"]],
    });
    console.log(todo.displayableString());
  } catch (error) {
    console.error(error);
  }
};

const updateItem = async (id) => {
  try {
    await Todo.update(
      { completed: true },
      {
        where: {
          id: id,
        },
      },
    );
  } catch (error) {
    console.error(error);
  }
};

const deleteItem = async (id) => {
  try {
    const deleteRowCount = await Todo.destroy({
      where: {
        id: id,
      },
    });
    console.log(`Deleted ${deleteRowCount} rows`);
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  await createTodo();
  await countTimes();
  await getAllTodos();
  await getSingleTodo();
  await updateItem(2); //give id
  await deleteItem(3);
  await getAllTodos();
})();
