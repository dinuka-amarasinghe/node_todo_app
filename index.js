const express = require('express');
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const ToDoTask = require("./models/TodoTask.js");
const TodoTask = require('./models/TodoTask.js');
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static("public"));

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true })
    .then(() => {
        console.log("Connected to the database");
        app.listen(port, () => {
            console.log("Server up and running");
        });
    })
    .catch((err) => {
        console.error(err);
    });

app.set("view engine", "ejs");

app.get('/', async (req, res) => {
    try {
        const tasksResults = await ToDoTask.find({});
        res.render("todo.ejs", { todoTasks: tasksResults });
    }
    catch (err) {
        res.send(500, error);
        res.redirect("/");
    }
});

app.post('/', async (req, res) => {
    const todoTask = new ToDoTask({
        content: req.body.content,
    });
    try {
        await todoTask.save();
        res.redirect("/");
    }
    catch (err) {
        res.send(500, error);
        res.redirect("/");
    }
});

app.route("/remove/:id").get(async (req, res) => {
    const id = req.params.id;
    await ToDoTask.findByIdAndDelete(id);
    try {
        res.redirect("/");
    }
    catch (err) {
        res.send(500, error);
        res.redirect("/");
    }
});

app
    .route("/edit/:id")
    .get(async (req, res) => {
        const id = req.params.id;
        try {
            const taskedits = await TodoTask.find({},);
            res.render("todoEdit.ejs", { todoTasks: taskedits, idTask: id });
        }
        catch (err) {
            res.send(500, err);
            res.redirect("/");
        }
    }).post(async (req, res) => {
        const id = req.params.id;
        await ToDoTask.findByIdAndUpdate(id, { content: req.body.content });
        try {
            res.redirect("/");
        } catch (err) {
            res.send(500, err);
            res.redirect("/");
        }
    });