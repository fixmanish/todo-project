//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const dateModule = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");
const _ = require("lodash");
const app = express();

// establishing the databse connection
mongoose.connect(
  "mongodb+srv://dynamicmanish902:manish902@cluster0.hd2rtgf.mongodb.net/todoDB",
  { useNewUrlParser: true }
);

// schema creation
const todoSchema = mongoose.Schema({
  itemName: String,
});

const newlistSchema = mongoose.Schema({
  listName: String,
  itemName: [],
});

// creating databse model i.e collection
const todoModel = mongoose.model("todoitem", todoSchema, "todoitems");

const newListModel = mongoose.model(
  "newlistitem",
  newlistSchema,
  "newlistitems"
);

// creating database documents

const firstItem = new todoModel({
  itemName: "Welcome to todo list 🤩",
});

const secondItem = new todoModel({
  itemName: "Press the ➕ button to add new item",
});

const thirdItem = new todoModel({
  itemName: "<-- Press checkbox to delete item",
});

// inserting to the databse

todoDefaultItems = [firstItem, secondItem, thirdItem];

// () outside the constant bound to module
// so as to get the data which is associated to a function in module
const dayToday = dateModule.getDay();
const dateToday = dateModule.getDate();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// const listData = ["Buy Food 🏪", "Cook Food 🍳", "Eat Food 🍜 "];
// const workData = [];

// get route for todo list

app.get("/", function (req, res) {
  todoModel
    .find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        todoModel
          .insertMany(todoDefaultItems)
          .then(() => {
            console.log("Successfully saved!");
          })
          .catch((err) => {
            console.log(err);
          });
        res.redirect("/");
      } else {
        res.render("list", {
          dayWeek: dayToday,
          newListItem: foundItems,
          pageHeading: "Todo",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// for adding another section of page

// app.get("/work", function (req, res) {
//   res.render("list", {
//     dayWeek: dateToday,
//     newListItem: workData,
//     pageHeading: "Work",
//   });
// });

app.get("/:newlist", function (req, res) {
  const name = _.capitalize(req.params.newlist);
  newListModel
    .findOne({ listName: name })
    .then((foundList) => {
      if (!foundList) {
        userNewList = new newListModel({
          listName: name,
          itemName: todoDefaultItems,
        });
        userNewList.save();
        res.redirect("/" + name);
      } else {
        res.render("list", {
          pageHeading: foundList.listName,
          newListItem: foundList.itemName,
          dayWeek: dayToday,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// app.get("/about", function (req, res) {
//   res.render("about");
// });

// positing data back to the front end section in accordance

// for the todo section

app.post("/", function (req, res) {
  const currentItemName = req.body.newItem;
  const currentListName = req.body.heading;

  const addNewItem = new todoModel({
    itemName: currentItemName,
  });

  if (currentListName === "Todo") {
    addNewItem
      .save()
      .then(() => {
        console.log("Inserted new item to db!");
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    newListModel
      .findOne({ listName: currentListName })
      .then((foundList) => {
        const newItemObject = {
          itemName: currentItemName,
          _id: new mongoose.Types.ObjectId(),
        };

        foundList.itemName.push(newItemObject);
        foundList.save();
        res.redirect("/" + currentListName);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //   if (req.body.heading === "Work") {
  //     workData.push(req.body.newItem);
  //     res.redirect("/work");
  //   } else {
  //     listData.push(req.body.newItem);
  //     res.redirect("/");
  //   }
});

// for deleting the items
// using the new route set
// it is the /delete route

app.post("/delete", function (req, res) {
  const deleteItemID = req.body.check;
  const currentListName = req.body.listName;

  if (currentListName === "Todo") {
    todoModel
      .findByIdAndRemove(deleteItemID)
      .then(() => {
        console.log("Deleted item successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
    res.redirect("/");
  } else {
    newListModel
      .findOneAndUpdate(
        { listName: currentListName },
        {
          $pull: {
            itemName: { _id: new mongoose.Types.ObjectId(deleteItemID) },
          },
        },
        {
          new: true,
        }
      )
      .then(() => {
        console.log("Deleted from dynamic page.");
        res.redirect("/" + currentListName);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.listen(3000, function () {
  console.log("Server has started on port 3000.");
});
