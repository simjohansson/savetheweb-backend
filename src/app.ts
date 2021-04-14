import express from "express";
import session from "express-session";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import  corsNode from "cors";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

const MongoStore = mongo(session);

// const options: corsNode.CorsOptions = {
//     allowedHeaders: [
//       "Origin",
//       "X-Requested-With",
//       "Content-Type",
//       "Accept",
//       "X-Access-Token",
//     ],
//     credentials: true,
//     methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
//     origin: "http://localhost:10001",
//     preflightContinue: false,
//   };


// Controllers (route handlers)
import * as highscoreController from "./controllers/highscore";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});

// Express configuration
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:10001/");

//     // Request methods you wish to allow
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

//     // Request headers you wish to allow
//     res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader("Access-Control-Allow-Credentials", "true");

//     // Pass to next layer of middleware
//     next();
// });
app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== "/login" &&
        req.path !== "/signup" &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    } else if (req.user &&
        req.path == "/account") {
        req.session.returnTo = req.path;
    }
    next();
});
app.use(corsNode());
app.use(express.json());
//app.options("*", corsNode());
app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

/**
 * Primary app routes.
 */
app.get("/api/highscore", highscoreController.getHighscore);
app.post("/api/posthighscore", highscoreController.tryUpdateHighscore);


export default app;

