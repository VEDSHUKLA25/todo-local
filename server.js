const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs-extra");

const app = express();
const port = 3000;
const dbFile = "todos.json";

app.use(cors());
app.use(bodyParser.json());

// Load todos from file if it exists
let todos = [];
if (fs.existsSync(dbFile)) {
  todos = fs.readJsonSync(dbFile);
}

// Save todos to file
function saveTodos() {
  fs.writeJsonSync(dbFile, todos, { spaces: 2 });
}

// Get all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

// Add a new todo
app.post("/todos", (req, res) => {
  const { task } = req.body;
  todos.push({ task, done: false });
  saveTodos();
  res.json({ message: "Todo added!" });
});

// Mark todo as done
app.put("/todos/:index", (req, res) => {
  const index = req.params.index;
  if (todos[index]) {
    todos[index].done = true;
    saveTodos();
    res.json({ message: "Todo marked as done!" });
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
