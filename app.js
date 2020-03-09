const   express                 =   require('express'),
        app                     =   express(),
        bodyParser              =   require('body-parser'),
        mongoose                =   require('mongoose'),
        passport                =   require('passport'),
        localStrategy           =   require('passport-local'),
        passportLocalMongoose   =   require('passport-local-mongoose'),
        //models
        User                    =   require('./models/user');

// ==================
// DATABASE 
// ==================
mongoose.connect('mongodb://localhost:27017/auth_demo', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) throw err;
    console.log('DB connected');
});
// ==================
// CONFIG
// ==================
app.use(require('express-session')({
    secret: 'Hello my name is Jesus',  //to code and decode sessions
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());

//Responsible for reading the session, code and uncode - already defined in our user.js 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));


// ==================
// ROUTES
// ==================
app.get('/', (req, res) => {
    res.render('home');
});

// AUTH ROUTES
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) throw err;
        passport.authenticate('local')(req, res, () => {
            console.log('Registered');
            res.redirect('/?registered');
        });
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});
//middleware (code that runs after authenticate)
app.post('/login', passport.authenticate('local', {
    successRedirect: '/?loggedin',
    }), (req, res) => {
    console.log('Logged In');
});

app.get('/loggout', (req, res) => {
    console.log('Logged out');
    req.logOut();
    res.redirect('/?loggedout')
});

// ==================
// SERVER
// ==================
app.listen(3000, () => {
    console.log('Server started');
});