const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 7000
const { connectToMongoDB } = require("./connect"); 
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const path = require("path");

const app = express(); // Initialize the Express app
const DB_URL = process.env.DB_URL || "mongodb+srv://URL_Shortner:qwertyuiop@cluster0.0xasz.mongodb.net/"


require("dotenv").config();

// Middleware
// Add this line to handle JSON bodies
app.use(express.json());
app.use(express.urlencoded({extended:false}))

connectToMongoDB(DB_URL)
    .then(() => console.log("Database Connected"))
    .catch((error) => console.error("Database connection failed:", error));

// Use the routes
app.use('/url', urlRoute);


// We can write frontend code like this but it will not be super good because we need to add styles as well as we can make code for mutiple
// routes so we use
// app.get("/test", async (req,res) =>{
//     const allUrl = await URL.find({});
//     res.end(`
//         <html>
//         <head>
//         <body>
//             <ol>
//                 ${allUrl.map(url => `<li>${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length} </li>`).join("")}     
//             </ol>
//         </body></head></html>`)
// })

app.use(express.static(path.join(__dirname, 'public')));
// Rendering Template
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.get("/", async (req, res) => {
    const allUrl = await URL.find({});
    const { id } = req.query; // Extract `id` from the query string

    return res.render("home", {
        urls: allUrl,
        id, // Pass `id` to the template to display the generated URL
    });
});


app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(), // Corrected Date.now() usage
                },
            },
        }
    );

    if (!entry) {
        return res.status(404).send("URL not found");
    }

    res.redirect(entry.redirectURL);
});


app.listen(PORT, () => {
    console.log("Server Started on port", PORT);
});
