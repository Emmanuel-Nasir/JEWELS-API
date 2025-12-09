const passport = require('passport');

const router = require('express').Router();
router.use('/', require('./swagger'));

// router.get('/', (req, res) => {
//     // #swagger.tags = ['Hello world'];
//   res.send('Hello World!');
// });
router.use('/jewels',require('./jewels.js'));

router.get('/login', passport.authenticate('github', (req, res) => {}));
router.get('/logout', function(req, res,next) {
     req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}); 


module.exports = router;