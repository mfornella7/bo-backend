const express           = require('express');
const cors              = require('cors');
const mongoose          = require('mongoose');
const logger            = require('morgan');
const path              = require('path');
const config            = require('./config');

// Routes
const authRoute         = require('./routes/auth.route');
const userRoute         = require("./routes/user.route");
const authMiddleware    = require("./utils/auth");

// db connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE_URL, {
    useNewUrlParser: true
})
.then(() => console.log("Connected to the database..."))
.catch(err => console.log("Could not connect to the database..."));

var app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/auth", authRoute);
app.use("/api/users", authMiddleware, userRoute);
const port = process.env.PORT || 8000;
app.listen(port, (err) => {
    if(err) return console.log(err.message);
    console.log("Listening on port 8000");
})

module.exports = app;