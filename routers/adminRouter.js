const express = require('express');
const { User } = require('../models');

const router = express.Router();


// Since our dashboard will have only authorized auths, I've just decided to extract this out to a middleware, as to not clutter up our routes.  Middleware is just a fancy term for code that runs on every request prior to routing (https://expressjs.com/en/guide/using-middleware.html).
router.use(async (req, res, next) => {
    // Checks if the user is logged in, OR if the user is not an admin.;
    if (!req.session.userId) {
        console.log("redirecting back to login")
        res.redirect('/login/')
    }
    else {
        // This is also a result of my poor decision about getById returning a list.
        User.getById(req.session.userId).then(
            (matchingUsers) => {
                if (!matchingUsers[0].is_admin) {
                    console.log("FAILED ADMIN CHECK")
                    res.redirect('/login/')
                }
                else {
                    next()
                }
            }
        )
    }




})

router.get('/', (req, res) => {
    res.send("Hooray, dashboard.");
})


module.exports = router;