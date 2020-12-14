const express = require("express");
const bodyParser = require("body-parser");
const { static } = require("express");
const dateUtility = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(static('static'));

mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
    name: "Learn Full Stack Development"
});

const item2 = new Item({
    name: "Get a job as Backend Engineer (Distributed System)"
});

const item3 = new Item({
    name: "Never stop learning"
});

const defaultItems = [item1, item2, item3];



app.get("/", (req, res) => {
    let day = dateUtility.getDay();
    Item.find({}, (err, foundItems) => {
        if (err) {
            console.log(err)
        } else {
            if (foundItems.length === 0) {
                Item.insertMany(defaultItems, err => {
                    if (err) {
                        console.log(err);
                    }
                });
                res.redirect("/");
            } else {
                res.render('list', { pageTitle: day, items: foundItems });
            }
        }
    })
});

app.post("/", (req, res) => {
    let itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

    item.save();
    res.redirect("/");

    // if (req.body.submitButton === 'Work') {
    //     work.push(item);
    //     res.redirect("/work");
    // } else {
    //     items.push(item);
    //     res.redirect("/");
    // }
});

app.post("/delete", (req, res) => {
    const ItemId = req.body.checkbox;
    Item.findByIdAndDelete(ItemId, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Succesful Delete");
        }
    })
    res.redirect("/");
})

app.get("/work", (req, res) => {
    res.render('list', { pageTitle: 'Work', items: work });
});

app.get("/about", (req, res) => {
    res.render('about');
});


app.listen(3000, () => console.log("Sever running on Port 3000"));