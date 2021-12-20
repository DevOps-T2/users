const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const fetch = require("node-fetch");
var apiRequest = require('./apiRequest.js');
const userModel = require('../models/userModel');
require('dotenv').config();
//var config = require('../config.json');

var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    return token;
};

var headerExtractor = function (req) {
    var token = null;
    if (req.headers['authorization']) {
        token = req.headers['authorization'].split(' ')[1];
    }
    return token;
};

passport.use(
    new JWTstrategy({
            secretOrKey: process.env.API_KEY,
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor, headerExtractor])
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);


passport.use(
    'register',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        async (req, username, password, done) => {
            try {
                const user = await createNewUser(req.body.email, req.body.password, req.body.displayName, req.body.userRole);
                if (!user) {
                    return done(user.errors)
                }
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    'login',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        async (req, email, password, done) => {
            try {
                const user = await userModel.findOne({email});

                if (!user) {
                    return done(null, false, {
                        message: 'User not found'
                    });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, {
                        message: 'Wrong Password'
                    });
                }

                return done(null, user, {
                    message: 'Logged in Successfully'
                });
            } catch (error) {
                return done(error);
            }
        }
    )
);

async function createNewUser(email, password, displayName, userRole) {

    var user = new userModel();
    user.email = email;
    user.password = password;
    user.displayName = displayName;
    user.userRole = userRole;

    user.save(function (err) {
        if (err){
            return(null);
        }
        return user;
    });  
}

module.exports = {
    checkId: function(req, res, next, param) {
        console.log("err")
        res.status(403).json({
            message: 'Authentication failed',
            data: ""
        });

        return;
        /* let village = await(await(await tools.doApiRequest("villages/" + req.params.idVillage, "GET", "", false)).json()).data; 
        if (req.user._id == village.owner || req.user.email == "admin@test.com"){
            return next();
        } else{
            res.status(403).json({
                message: 'Authentication failed',
                data: ""
            });
            return;
        } */
    }
}