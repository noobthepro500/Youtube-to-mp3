const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})