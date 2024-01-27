require("dotenv").config(); // intitializing env file
require("express-async-errors"); // catches any async error in the API, no need for any other ErrorHandling like try-catch // will work only after listening, middleware
const express = require("express");
const app = express();

//initiating SERVERR
require("./startup/index.startup")(app); // starting server