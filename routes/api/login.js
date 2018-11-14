const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')


const User = require('../../public/schemas/User')


/**
 * Get leaderboard
 */
router.get('/', (req, res) => {
    var a = User.find().limit(10).sort({ score: -1 }).then(items => {
        var leaderboard = [];

        items.forEach(a => {
            let user = {
                username: a.username,
                score: a.score
            }

            leaderboard.push(user)
        })
        res.send(leaderboard)

    })
})


/**
 * {/auth}
 * Match user credentials 
 */
router.post('/auth', bodyParser.json(), (req, res) => {
    var email = req.body.loginuser
    var password = req.body.loginpass

    User.authenticate(email, password, function(error, user) {
        if (error || !user) {
            var err = new Error('Wrong email or password.');
            err.status = 401;
            req.session.error = err
            return res.redirect('/invalidpassword')
        } else {
            req.session.userId = user._id;
            return res.redirect('/');
        }
    });


})

/**
 * {/user}
 * Check if User is connected
 */
router.get('/user', function(req, res) {
    if (req.session && req.session.userId) {
        res.send(req.session.userId);
    } else {
        res.send('noUser');
    }
})



/**
 * Update score if possible
 */
router.get('/update/:uid/:score', function(req, res) {

    var uid = req.params.uid
    var score = req.params.score

    User.findById(uid, (err, user) => {
        if (score > user.score) {
            user.score = score;
        }
        user.save();
        res.send(user)
    })
})






router.post('/', bodyParser.json(), (req, res) => {
    //console.log(req.body)
    console.log(req.body);
    var userData = {
        email: req.body.user,
        username: req.body.name,
        password: req.body.pass,
        score: 0
    }
    console.log(userData)
        // use schema.create to insert data into the db
    User.create(userData, function(err, user) {
        if (err) {
            throw err
        } else {
            req.session.userId = user._id;
            return res.redirect('/');
        }
    });
})

// GET route after registering
router.get('/login', function(req, res, next) {

    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    throw err;
                    //return next(err);
                } else {
                    req.session.userId = user._id;
                    return res.redirect('/');
                }
            }
        });
});


router.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

module.exports = router;