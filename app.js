const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const dataFile = path.join(__dirname, "data", "todos.json");

function getTodos() {
    return JSON.parse(fs.readFileSync(dataFile));
}

function saveTodos(todos) {
    fs.writeFileSync(dataFile, JSON.stringify(todos, null, 2));
}

app.get("/", (req, res) => {
    const todos = getTodos();
    res.render("index", { todos });
});

app.post("/add", (req, res) => {
    const todos = getTodos();
    todos.push({ text: req.body.todo, completed: false });
    saveTodos(todos);
    res.redirect("/");
});

app.post("/toggle/:index", (req, res) => {
    const todos = getTodos();
    todos[req.params.index].completed = !todos[req.params.index].completed;
    saveTodos(todos);
    res.redirect("/");
});

app.post("/delete/:index", (req, res) => {
    const todos = getTodos();
    todos.splice(req.params.index, 1);
    saveTodos(todos);
    res.redirect("/");
});

app.post("/edit/:index", (req, res) => {
    const todos = getTodos();
    todos[req.params.index].text = req.body.updatedTodo;
    saveTodos(todos);
    res.redirect("/");
});

app.post("/clear-completed", (req, res) => {
    let todos = getTodos();
    todos = todos.filter(todo => !todo.completed);
    saveTodos(todos);
    res.redirect("/");
});

/* 🔹 IMPORTANT CHANGE FOR UNIT TESTING */
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Todo app running on port ${PORT}`);
    });
}

/* 🔹 EXPORT APP FOR JEST */
module.exports = app;