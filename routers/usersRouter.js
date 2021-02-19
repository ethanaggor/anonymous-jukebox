const express = require('express');
const { User } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.userId) {
        res.redirect('/login/')
    }
    else {
        User.getById(req.session.userId).then(
            (matchingUsers) => {
                if (!matchingUsers[0].is_admin) {
                    res.redirect('/login/')
                }
                else {
                    res.redirect('/dashboard/')
                }
            }
        )
    }
})

router.get('/view/', (req, res) => {
    User.getAll().then(
        (allUsers) => {
            res.send(JSON.stringify(allUsers));
        }
    )
})

router.get('/login/', (req, res) => {
    res.render("users/login");
});

router.post('/login/', (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    User.authenticate(email, password).then(
        // See, so this is a coding "design flaw" where I have returned a "list" of users, since it's from a SELECT statement, but, in reality, since our DB constraint is that emails are unique, and emails are what we're using to log in, that this is unnecessary.  Regardless, I'll do it so you can see the mistake and we can fix it later.
        (matchingUsers) => {
            console.log(matchingUsers);
            if (!matchingUsers.length) {
                res.redirect('/login/');
            }
            else {
                console.log("going to DB");
                req.session.userId = matchingUsers[0].id;
                res.redirect('/dashboard/');
            }
        }
    )
})

router.get('/register/', (req, res) => {
    res.render("users/register");
})

router.post('/register/', (req, res) => {
    const { email, password, first_name, last_name, is_admin } = req.body;
    User.create(email, password, first_name, last_name, is_admin ? true : false).then(
        (newUser) => {
            res.redirect('/view/');
        });
})

router.get('/logout/', (req, res) => {
    // I think due to modern browser pre-GET-fetching, logouts are supposed to be done with POST requests; however, we'll use a GET request for simplicity right now.
    req.session.destroy();
    res.redirect('/login/')
})

module.exports = router;
