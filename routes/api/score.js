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

const db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});

//var bodyParser = require('body-parser')


//const User = require('../../public/schemas/User')


/**
 * Get leaderboard
 */
router.get('/1.0', (req, res) => {
    var users = []
    var ref = db.collection("users").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
                users.push(doc.data())
                    //console.log(doc.id, " => ", doc.data());

            })
            //console.log(users)
            //res.send("foo")
        res.send(users)
    }).catch(e => {
        res.send(e)
    })
})
router.post('/1.0/newaccount', (req, res) => {
    console.log(req.headers);
    var user = {
        uid: req.headers.uid,
        apptoken: req.headers.token,
        kills: req.headers.kills,
        deaths: req.headers.deaths
    }
    var ref = db.collection("users").doc(user.uid).set(user).catch(error => console.log(error))
        .then(() => {
            res.send(user);
        })
})

router.post('/1.0/users', (req, res) => {
    console.log("yo")
    var userid = req.headers.uid;
    var apptoken = req.header.token;
    //if apptoken is valid
    var users = []
    var ref = db.collection("users").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
                if (doc.data().uid == userid)
                    users.push(doc.data())
            })
            //console.log(users)
            //res.send("foo")
        if (users.length > 0)
            res.send(users)
        else {
            res.send("unable to find user")
                //throw "Unable to find user"
        }


    }).catch(e => {
        res.send(e)
    })

})

router.post('/1.0', (req, res) => {
    //console.log(req.headers, req.headers.kills)

    var userid = req.headers.uid;
    var apptoken = req.header.token;
    var kills = req.headers.kills;
    var deaths = req.headers.deaths
    var userDoc = db.collection("users").doc(req.headers.uid)
    var t = db.runTransaction(transaction => {
        return transaction.get(userDoc)
            .then(res => {
                if (!res.exists) {
                    throw "DOCUMENT NOT EXISTS"
                }
                kills = parseInt(res.data().kills) + parseInt(kills)
                deaths = parseInt(res.data().deaths) + parseInt(deaths)
                transaction.update(userDoc, {
                    kills: kills,
                    deaths: deaths
                });
            })
    }).catch(error => console.log(error))


    // var user = {
    //     uid: userid,
    //     "apptoken": apptoken,
    //     "kills": kills,
    //     "deaths": deaths
    // }


    // db.collection("users").doc(user.uid).set(ser)
    //     .then(function(docRef) {
    //         console.log("Document written with ID: ", docRef.id);
    //     })
    //     .catch(function(error) {
    //         console.error("Error adding document: ", error);
    //     });
    res.send("updated")
})



module.exports = router;