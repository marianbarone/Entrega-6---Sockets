import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import userModel from './users-controller.js';
import __dirname from "../utils.js";

//INDEX
const getRoot = (req, res) => {
    res.render("index.ejs", { name: req.user.username, email: req.user.email })
}

//LOGIN

const getLogin = (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    res.sendFile(__dirname + "/public/views/login.html");
}

const isValidPassword = (password, encPassword) => {
    const isValid = bcrypt.compareSync(password, encPassword);
    return isValid;
}


passport.use('login', new LocalStrategy(
    async (username, password, done) => {

        const user = await userModel.getByUsername(username);

        console.log(user)

        if (!user || !isValidPassword(password, user.password)) return done(null, false);

        return done(null, user);
    }
))

passport.serializeUser((user, done) => {
    done(null, user.username);
});
passport.deserializeUser(async (username, done) => {
    const user = await userModel.getByUsername(username);
    done(null, user);
});

// SIGNUP
const getSignup = (req, res) => {
    res.sendFile(__dirname + "/public/views/signup.html");
}

function createHash(password) {
    return bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10),
        null);
}

// PROCESS LOGIN
const postLogin = (req, res) => {
    res.redirect("/");

}

// PROCESS SIGNUP
const postSignup = async (req, res) => {
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: createHash(req.body.password)
    }

    console.log(req.body.password)

    const userDB = await userModel.createUser(newUser);

    if (!userDB) return res.render("error.ejs", { error: "El usuario o el mail ya están registrados" });

    res.redirect("/login");
}


// LOGOUT
const getLogout = (req, res) => {
    if (req.isAuthenticated()) {
        const name = req.user.username;
        req.logout({}, err => err && console.log(err));
        return res.render("logout.ejs", { name })
    };

    res.redirect("/login");
}

const failRoute = (req, res) => {
    logger.warn(`Ruta: ${req.url} | Método: ${req.method}`);
    res.status(404).render('error', {});
}

export default {
    getRoot,
    getLogin,
    getSignup,
    postLogin,
    postSignup,
    getLogout,
    failRoute
}
