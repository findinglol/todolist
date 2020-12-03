const express = require("express");
const bodyParser = require("body-parser");
const { static } = require("express");
const dateUtility = require(__dirname + '/date.js');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(static('static'));
let items = ["Learn EJS", "Learn git"];
let work = [];

app.get("/", (req, res) => {

    let day = dateUtility.getDay();
    res.render('list', { pageTitle: day, items: items });
});

app.post("/", (req, res) => {
    let item = req.body.newItem;
    if (req.body.submitButton === 'Work') {
        work.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
})

app.get("/work", (req, res) => {
    res.render('list', { pageTitle: 'Work', items: work });
});

app.get("/about", (req, res) => {
    res.render('about');
});


app.listen(3000, () => console.log("Sever running on Port 3000"));