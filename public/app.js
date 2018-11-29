var auth = firebase.auth()
var db = firebase.firestore();
var user;

$(function() {
    console.log()
    $("#game").hide();
    $("#start").hide()
    $("#logout").hide()
    console.log()
    $("#regbtn").on("click", a => {
        $("#login").hide();
        $("#register").show()

    })
    $("#logbtn").on("click", a => {
        $("#register").hide();
        $("#login").show();
    })
    $("#authenticate").on("click", a => {
        var email = $("#aemail").val()
        var password = $("#apassword").val()
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
            }).then((user) => {

            });
    })

    $("#caccount").on("click", a => {
        var email = $("#cemail").val()
        var name = $("#cname").val()
        var password = $("#cpw").val()
        firebase.auth().createUserWithEmailAndPassword(
            email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        }).then((foo) => {
            //user = foo.user;
            console.log(auth.currentUser)

            firebase.auth().currentUser.updateProfile({
                displayName: name
            })

            $.ajax({
                url: "api/1.0/newaccount",
                type: "POST",
                data: "asaldivar18",
                contentType: "application/JSON",
                headers: {
                    kills: 0,
                    deaths: 0,
                    uid: auth.currentUser.uid,
                    token: "asaldivar18"
                },
                success: () => {
                    $("#register").hide()
                }
            })



            // db.collection("users").doc(user.uid).set({
            //         kills: 0,
            //         deaths: 0,
            //         uid: user.uid,
            //         token: adrian123fefe
            //     })
            //     .then(function(docRef) {
            //         console.log("Document written with ID: ", docRef.id);
            //     })
            //     .catch(function(error) {
            //         console.error("Error adding document: ", error);
            //     });
        });

    })


    $("#logout").on("click", a => {
        firebase.auth().signOut()
    })

    $("#account").on("click", a => {
        $("#login").hide();
        $("#start").hide()
        $("#logout").hide();
        $("#game").hide()
        $("#myAccount").show();
    })

    $("#saveKeyBtn").on("click", a => {
        var key = document.getElementById("key").value
        $.ajax({
            url: "api/1.0/updateToken",
            type: "POST",
            data: "asaldivar18",
            contentType: "application/JSON",
            headers: {
                uid: auth.currentUser.uid,
                token: key
            },
            success: (res) => {
                if (res == "success") {
                    $("#myAccount").hide()
                    $("#start").show();
                    $("#logout").show();
                }
                //$("#register").hide()
            }
        })
    })

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $("#login").hide()
            $("#start").show();
            $("#logout").show();
            //console.log(user)
            user = user;
            uid = user.uid
            console.log(user)
        } else {
            $("#login").show();
            $("#start").hide()
            $("#logout").hide();
            $("#game").hide()
        }
    });

})