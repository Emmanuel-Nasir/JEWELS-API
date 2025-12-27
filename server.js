const express=require('express');
const bodyParser = require('body-parser');
const mongoDb = require('./db/connect');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy =require('passport-github2').Strategy;
const cors = require ('cors');
const password = require('password');

const port = process.env.PORT || 3001;
const app =express();


app.use((req, res, next) => {
  if (req.url.length > 1) {
    req.url = req.url.replace(/\/+$/, '');
  }
  next();
});


app
    .use(bodyParser.json())
    .use(session
        ({
            secret:"secret",
            resave:false,
            saveUninitialized: true,
        })
    )
    .use(passport.initialize())
    .use(passport.session())
    
    .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Headers',
         'Origin, X-Requested-With, Content-Type, Accept, Z-key');
    res.setHeader('Access-Control-Allow-Methods',
         'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();

})
.use(cors({methods:['GET','POST','DELETE','UPDATE','PUT','PATCH']}))
.use(cors({origin:'*'}))
.use("/", require("./routes/index.js"));

passport.use (new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: ""
},
function(accessToken, refreshToken, profile, done){
    return done (null, profile);
}
));

passport.serializeUser((user, done)=>{
    done (null, user);
});

passport.deserializeUser((user, done)=>{
    done (null, user);
});

app.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as, ${req.session.user.displayName}` : 'Logged Out.')
}
);
app.get('/github/callback',
passport.authenticate('github', {
    failureRedirect: '/api-docs', session:false}),
(req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

//connect to database before starting the server
mongoDb.initDb((err) => {
    if (err) {
        console.error(err);
    } else {
                   app.listen(port, () => {console.log(`Database is listening and node Running on port ${port}`)})

    }
});

    
