const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("DB connection successful!"))
    .catch((error) => {
        console.log(error);
        console.log("DB connection error");
        process.exit(1)
    })
}

module.exports = {dbConnect};