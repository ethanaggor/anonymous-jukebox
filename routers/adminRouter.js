const express = require('express');
const { User } = require('../models');

const router = express.Router();
const fileUploadRouter = require('./fileUploaderRouter')

// In memory "state."  A "session" here is a listening-music-session (business logic).
let isSessionInProgress = false;


// Since our dashboard will have only authorized auths, I've just decided to extract this out to a middleware, as to not clutter up our routes.  Middleware is just a fancy term for code that runs on every request prior to routing (https://expressjs.com/en/guide/using-middleware.html).
router.use(async (req, res, next) => {
    // Checks if the user is logged in, OR if the user is not an admin.;
    if (!req.session.userId) {
        res.redirect('/login/')
    }
    else {
        // This is also a result of my poor decision about getById returning a list.
        User.getById(req.session.userId).then(
            (matchingUsers) => {
                if (!matchingUsers[0].is_admin) {
                    res.redirect('/login/')
                }
                else {
                    next()
                }
            }
        )
    }
})

//Child-router for our file-upload routes.
router.use('/uploader', fileUploadRouter);

router.get('/', (req, res) => {
    res.render('admin/dashboard', {
        'isSessionInProgress' : isSessionInProgress,
    });
})

// This should be a POST request, but I'll leave it as a GET for now.
router.get('/startSession', (req, res) => {
    isSessionInProgress = true,
    res.redirect('/dashboard/')
});
router.get('/stopSession', (req, res) => {
    isSessionInProgress = false,
    res.redirect('/dashboard/')
});




module.exports = router;