import express from "express"
import mongoose from "mongoose"
import config from "./config.mjs"
import cors from "cors";
import ejs from "ejs"
const app = express();


// mongoose.connect('mongodb://localhost', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).catch(() => {
//     console.log("Mongoose could not connect, check your password!")
//     process.exit(24)
// })
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.get("/", (req, res) => {
    res.render('index');
})

app.listen(config.port, console.log(`Listening on port ${config.port}`));