var User = require('../model/user');
//var Post = require('../model/post');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const controllerUser = {

    login: async (req, res) => {
        if (!req.session.username) {
            res.render('user/login');
        }
        else {
            res.redirect(`/user/${req.session.username}`)
        }
    },


    checkLogin: async (req, res) => {
        message = '';
        var check;
        var data = req.query;
        var user = await User.findOne({ username: req.body.username })
            .then(async (check) => {
                var user = await User.findOne({ username: req.body.username });
                if (user.username === req.body.username) {

                    bcrypt.compare(req.body.password, user.password, async function (err, isMatch) {
                        if (!isMatch) {
                            message = 'Passwords do not match.';
                            res.redirect('/user/login');
                        }
                        else {
                            req.session.username = req.body.username;
                            var currentUser = await User.findOne({ 'username': req.session.username });
                            res.render('user/userPage', { currentUser });
                        }
                    })
                }
            })
            .catch(() => {
                message = 'No user found.';
                console.log('No user found');
                res.redirect('/user/login');
            });
    },

    userPage: async (req, res) => {
        if (req.session.username) {
            var { username } = req.params;
            var currentUser = await User.findOne({ 'username': username });
            if (currentUser) {
                res.render('user/userPage', { currentUser });
            }
            else {
                res.redirect('/user/signup');
            }
        }
        else {
            message = 'Login to proceed.';
            console.log('Login to proceed.');
            res.redirect('/user/signup');
        }
    },

    signup: async (req, res) => {
        res.render('user/signup');
    },



    addUser: async (req, res) => {
        var users = await User.find()
            .then(async () => {
                var data = req.body;
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(req.body.password, salt);
                var newUser = new User({
                    username: req.body.username,
                    password: hash,
                    email: req.body.email
                });
                return newUser;
            })
            .then(async (newUser) => {
                var users = await User.find();
                var newUsername = newUser.username.toLowerCase()
                for (let user of users) {
                    var lowercaseUser = user.username.toLowerCase();
                    if (lowercaseUser === newUsername) {
                        return null;
                    }
                }
                return newUser;
            })
            .then(async (newUser) => {
                if (newUser) {
                    await newUser.save();
                    console.log("saving")
                    return newUser;
                }
                else {
                    return null;
                }
            })
            .then(async (newUser) => {
                if (newUser) {
                    res.redirect('/user/login');
                }
                else {
                    console.log("wrong");
                    res.redirect('/user/signup');
                }
            })
            .catch((err) => {
                console.log(err);

                res.redirect('/user/signup');
            })
    }

}

module.exports = controllerUser;