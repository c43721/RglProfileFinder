import express from "express"
import config from "./config.mjs"
import cors from "cors";
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.get("/", (req, res) => {
    res.render('index');
})

app.listen(config.port, console.log(`Listening on port ${config.port}`));