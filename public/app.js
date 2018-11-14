auth = firebase.auth()
$(function() {
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
        console.log("foo")

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
        }).then(() => {
            $("#caccount").hide()
            firebase.auth().currentUser.updateProfile({
                displayName: name
            })
        });




        // auth.createUser({
        //     email: emailAddress,
        //     password: password
        // }, function(error, authData) {
        //     if (error) {
        //         console.log("Error creating user:", error);
        //     } else {
        //         // save the user's profile into the database so we can list users,
        //         // use them in Security and Firebase Rules, and show profiles
        //         auth.child("users").child(authData.uid).set({
        //             provider: authData.provider,
        //             name: userName
        //         });
        //     }
        // });
    })


    $("#logout").on("click", a => {
        firebase.auth().signOut()

    })

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $("#login").hide()
            $("#start").show();
            $("#logout").show();
            console.log(user)
            uid = user.uid
        } else {
            $("#login").show();
            $("#start").hide()
            $("#logout").hide();
            $("#game").hide()
        }
    });

})