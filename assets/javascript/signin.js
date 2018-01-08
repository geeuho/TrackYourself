var config = {
	apiKey: "AIzaSyCtZlEIl3iT_WHQdOvvxzu8LyFjueJUg5A",
	authDomain: "trackyourself-1e739.firebaseapp.com",
	databaseURL: "https://trackyourself-1e739.firebaseio.com",
	projectId: "trackyourself-1e739",
	storageBucket: "",
	messagingSenderId: "345964565415"
};

firebase.initializeApp(config);

var database = firebase.database();

$(document).on("click", ".form-control", loginInputClicked);

$("#btnLogin").on("click", function(){
	var userName = $("#usr").val().trim();
	var password = $("#pwd").val().trim();

	userLogin(userName, password);
});

function loginInputClicked(){
	$("#login-message").text("");
}

function userLogin(userName, password) {
  database.ref('users/' + userName).once('value')
    .then(function(snapshot) {
      if(snapshot.exists()) {
      	if(password === snapshot.child('password').val())
        {
          // Allow login
          localStorage.setItem("username", userName);
          window.location = "./oneday.html";
        } else {
          $("#login-message").text("Incorrect Username or Password");
        }
    	} else {
	     	// User does not exist, point user to create user
	      $("#login-message").text("Username does not exist");
      }
 	});
}

