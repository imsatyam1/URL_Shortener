const express = require('express')
const urlRoute = require('./routes/url')
const path = require('path')
const URL = require('./models/url')
const {connectToMongoDB} = require('./connection')
const staticRoute = require("./routes/staticroute")

const app = express();
const port = 8080;

connectToMongoDB("mongodb://localhost:27017/shortUrl")
.then(() => console.log(`connnected with MongoDB`))
.catch(() => console.log(`Error Occured!`))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.json())
app.use(express.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, "public")));
app.use("/url",  urlRoute)
app.use("/", staticRoute)

// app.get("/", (req, res) => {
//     res.render("index.ejs");
// })

app.get('/:shortId', async(req, res) => {
    const shortId = req.params.shortId;
    try{
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timeStamp: new Date()
                    },
                },
            },
            // { new: true }
        );
        if(!entry){
            return res.status(404).send('Short URL not found');
        }
        res.redirect(entry.redirectURL);
    }
    catch(error){
        console.error(`Error handling shortId:`, error);
        res.status(500).send(`Internal server error`)
    }
});

app.listen(port, () => {
    console.log(`Server started at port: ${port}`)
})
