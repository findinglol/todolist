const express = require("express");
const bodyParser = require("body-parser");
const { static } = require("express");
const dateUtility = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const app = express();
const _ = require('lodash');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(static('static'));

mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

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

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", (req, res) => {
    let day = 'Today';
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
    const listName = req.body.submitButton;
    const item = new Item({
        name: itemName
    });
    let day = 'Today';
    if (listName === day) {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            if (err) {
                console.log("Error in finding the custom list from Mongo Query");
            } else {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            }
        });
    }
});

app.post("/delete", (req, res) => {
    const ItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === 'Today') {
        Item.findByIdAndDelete(ItemId, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Succesful Delete");
            }
        });
        res.redirect("/");
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: ItemId } } }, (err, foundList) => {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }

})

app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);


    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                res.render('list', { pageTitle: foundList.name, items: foundList.items });
            }
        }
    })

});

app.get("/about", (req, res) => {
    res.render('about');
});


app.listen(3000, () => console.log("Sever running on Port 3000"));