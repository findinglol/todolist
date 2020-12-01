const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    let today = new Date();
    let currentDay = today.getDay();
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }
    let day = today.toLocaleDateString("en-US", options);
    res.render('list', { kindOfDay: day });
})

app.listen(3000, () => console.log("Sever running on Port 3000"));