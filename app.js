const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render('list');
})

app.listen(3000, () => console.log("Sever running on Port 3000"));