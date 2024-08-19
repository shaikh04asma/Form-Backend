const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors=require('cors')
dotenv.config(); //configure .env file
const app = express();
app.use(cors())//permission for frontend
app.use(express.json());
connectDB();
app.use("/api/user", require("./routes/user.router"));
const PORT = process.env.PORT; //read port value from env file
app.listen(PORT, () => {
  console.log("Application is running on " + PORT);
});
