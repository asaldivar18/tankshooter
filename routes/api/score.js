const express = require('express');
const router = express.Router();
//var bodyParser = require('body-parser')


//const User = require('../../public/schemas/User')


/**
 * Get leaderboard
 */
router.get('/1.0', (req, res) => {
    res.send("foo")
})

router.post('/1.0', (req, res) => {
    console.log(req.headers.userid)
    var userid = req.headers.userid;
    var apptoken = req.headers.apptoken;
    var score = req.headers.score;
    var user = {
        uid: userid,
        apptoken: apptoken,
        score: score
    }
    res.send(user)
})



module.exports = router;