const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
firebase.initializeApp({
    apiKey: 'AIzaSyA8FCZ2hs5QXUtGgLYPnLvOxrgFbkTJ4pc',
    authDomain: 'tankshooter888.firebaseapp.com',
    projectId: 'tankshooter888'
});


//var bodyParser = require('body-parser')


//const User = require('../../public/schemas/User')


/**
 * Get leaderboard
 */
router.get('/1.0', (req, res) => {
    res.send("foo")
})

router.post('/1.0', bodyParser.json(), (req, res) => {
    console.log(req)
    var userid = req.body.uid;
    var apptoken = req.body.token;
    var kills = req.body.kills;
    var deaths = req.body.deaths
    var user = {
        "uid": userid,
        "apptoken": apptoken,
        "kills": kills,
        "deaths": deaths,
    }
    var db = firebase.firestore();
    db.settings({
        timestampsInSnapshots: true
    });

    db.collection("scores").add(user)
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    res.send(user)
})



module.exports = router;