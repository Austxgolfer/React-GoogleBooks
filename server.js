const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");

const axios = require("axios");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/GBooks";

const db = require("./models");

const PORT = process.env.PORT || 3000;
const app = express();

// Define middleware here
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
app.use(express.static("public"));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/api/books", function(req, res) {
  db.Book.find({})
    .then(function(dbBook) {
      res.json(dbBook);
    })
    .catch(function(err) {
      res.json(err);
    });
});
app.post("/api/books", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      console.log("updatenote", dbNote);
      return db.Book.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbBook) {
      res.json(dbBook);
    })
    .catch(function(err) {
      res.json(err);
    });
});
app.post("/api/books/:id", function(req, res) {
  db.Note.deleteOne({ _id: req.body.id })
    .then(function() {
      db.Note.findOne({ artid: req.body.artid }).then(function(dbNote) {
        console.log("updatenote", dbNote);
        return db.Book.findOneAndUpdate(
          { _id: req.body.artid },
          { note: dbNote._id },
          { new: true }
        );
      });
    })
    .then(function(dbBook) {
      res.json(dbBook);
    })
    .catch(function(err) {
      res.json(err);
    });
});
// Define API routes here

// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
