import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import route from "./routes/routes.js";
import authRouter from "./routes/auth.route.js";
import passport from "passport";
import session from "express-session"
import flash from "connect-flash";
// ==========
// App initialization
// ==========

dotenv.config();
const { APP_HOSTNAME, APP_PORT, NODE_ENV ,SECRET_KEY_SESSION,MONGO_URI} = process.env;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set("view engine", "pug");
app.locals.pretty = (NODE_ENV !== 'production'); // Indente correctement le HTML envoyé au client (utile en dev, mais inutile en production)
app.use(express.urlencoded({ extended: true }));
// ==========
// App middlewares
// ==========

app.use(session({
  secret: SECRET_KEY_SESSION,
  resave: false,           
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.flash ={ succes: req.flash("success")};
  res.locals.messages = req.flash(); 
  next();
});
app.use(express.static(path.join(__dirname, "public")));

// ==========
// App routers
// ==========

app.use("/", route);
app.use("/auth", authRouter);
// ==========
// App start
// ==========

app.listen(APP_PORT, () => {
  console.log(`App listening at http://${APP_HOSTNAME}:${APP_PORT}`);
});

mongoose.connect(MONGO_URI, {
})
.then(() => console.log("Connexion avec la BDD réalisé avec succès"))
.catch(err => console.log(err))