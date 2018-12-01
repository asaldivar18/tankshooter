$(function() {
    console.log(window.location.href.split('/')[4])
    $("#authenticate").on("click", a => {
        var email = $("#aemail").val()
        var password = $("#apassword").val()
        var key = window.location.href.split('/')[4];
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
                console.log(key)
                console.log(user.user.uid)
                $.ajax({
                    url: "/api/1.0/updateToken",
                    type: "POST",
                    contentType: "application/JSON",
                    headers: {
                        uid: user.user.uid,
                        token: key
                    },
                    success: () => {
                        $("#loginsection").html("")
                        $("#titlesection").html("Successfully connected BadgeBook account!")
                    }
                })
                console.log(user)
            });
    });




})

window.onbeforeunload = function() {
    return "Are you sure?";
};