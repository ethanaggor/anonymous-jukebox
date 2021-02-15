const express = require('express');
const session = require('express-session')
const path = require('path');
const app = express();

// Using EJS as our templating engine.
app.set('view engine', 'ejs');
// Set the default directory to look for ejs files to "templates"
app.set('views', path.join(__dirname, '/templates'));

// Session middleware.  I want to be clear here, all forms of actual stored session data are stored server-side, while the bound-session-id is stored in a transient cookie with the client which is then sent back to the server on every request (and then looked up against our stored session data).  Ideally, if you're going to do this, we'd store the data in a memory cache like Redis/Memcached, but I'll leave it default-configured as in-memory session (not production-grade).
app.use(session({
    'secret' : 'superdupersecret',
}));
// Body-parsing middleware so we can extract the application/x-www-form-urlencoded data from the body of POST requests.  I have no intention of having nested query-strings, so a flat query string can use extended:false as an option.
app.use(express.urlencoded({ extended: false }));

// Routers.
const usersRouter = require('./routers/usersRouter');
const adminRouter = require('./routers/adminRouter');

app.use('/', usersRouter);
app.use('/dashboard', adminRouter);


app.listen(3000, () => console.log("Listening on 3000."));
