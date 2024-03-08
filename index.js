const express = require("express");
const app = express();

require("dotenv").config();
const port = process.env.PORT || 4000;

//cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

const {dbConnect} = require("./config/database");
dbConnect();

const user = require("./routes/user");
app.use("/api/v1", user);

app.listen(port, () => {
    console.log(`server is running at port ${port}`);
})

app.get("/", (req, res) => {
    res.send(`<h1>Hello World</h1>`)
})  