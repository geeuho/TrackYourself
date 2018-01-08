// var config = {
//     apiKey: "AIzaSyDpzzV93BHYk3TuMUzBB4EH4H-q7weShzg",
//     authDomain: "userinfo-fef20.firebaseapp.com",
//     databaseURL: "https://userinfo-fef20.firebaseio.com",
//     projectId: "userinfo-fef20",
//     storageBucket: "userinfo-fef20.appspot.com",
//     messagingSenderId: "329141712344"
// };

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

const firstnameTxt = $("#firstname");
const lastnameTxt = $("#lastname");
const genderTxt = $("#gender option:selected");
const ageTxt = $("#age");
const weightTxt = $("#weight");
const heightTxt = $("#height");
const emailTxt = $("#email");
const userNameTxt = $("#username");
const passwordTxt = $("#password");

$("#submit-btn").on("click", function(event) {
	event.preventDefault();

	if(validateInput()) {
		saveUser();
	}
});

$(document).on("click", ".form-control", inputClick);

function inputClick() {
	$(this).removeClass("red-border");
}

function validateInput() {
	if(firstnameTxt.val().trim().length === 0) {
		createNotifyMessage("Missing Value", "glyphicon glyphicon-warning-sign", "danger", "First Name must be provided.", "top");

		firstnameTxt.addClass("red-border");

		return false;
	}

	if(lastnameTxt.val().trim().length === 0) {
		createNotifyMessage("Missing Value", "glyphicon glyphicon-warning-sign", "danger", "Last Name must be provided.", "top");

		lastnameTxt.addClass("red-border");

		return false;
	}

	if(ageTxt.val().trim().length === 0) {
		createNotifyMessage("Missing Value", "glyphicon glyphicon-warning-sign", "danger", "Age must be provided.", "top");

		ageTxt.addClass("red-border");

		return false;
	}

	if(weightTxt.val().trim().length === 0) {
		createNotifyMessage("Missing Value", "glyphicon glyphicon-warning-sign", "danger", "Weight must be provided.", "top");

		weightTxt.addClass("red-border");

		return false;
	}

	if(heightTxt.val().trim().length === 0 || heightTxt.val().trim().length < 3  || heightTxt.val().trim().length > 5 || 
			heightTxt.val().trim().indexOf("'") < 1 || heightTxt.val().trim().indexOf("'") > 2) {
		
		createNotifyMessage("Missing Value", "glyphicon glyphicon-warning-sign", "danger", "Valid height must be provided.", "top");

		heightTxt.addClass("red-border");

		return false;
	}

	if(emailTxt.val().trim().length === 0 || !emailTxt.val().trim().includes("@")) {
		createNotifyMessage("Missing Value", "glyphicon glyphicon-warning-sign", "danger", "Valid email must be provided.", "top");

		emailTxt.addClass("red-border");

		return false;
	}


	if(userNameTxt.val().trim().length === 0) {
		createNotifyMessage("Missing Value", "glyphicon glyphicon-warning-sign", "danger", "Username must be provided.", "top");

		userNameTxt.addClass("red-border");

		return false;
	}

	if(passwordTxt.val().trim().length === 0) {
		createNotifyMessage("Missing Value", "glyphicon glyphicon-warning-sign", "danger", "Password must be provided.", "top");

		passwordTxt.addClass("red-border");

		return false;
	}

	return true;
}

function saveUser(userName, password) {
	database.ref('users/' + userNameTxt.val().trim()).once('value')
    .then(function(snapshot) {
        if(snapshot.exists()) {
          // User already exists
          createNotifyMessage("User Registration", "glyphicon glyphicon-warning-sign", "info", "Username is already in use.", "top");

          userNameTxt.addClass("red-border");

        } else {
          // User can be added to database
          addUserToDatabase();
        }
    });
}

function addUserToDatabase() {
  var newUserObj = {
		firstname: firstnameTxt.val().trim(),
		lastname: lastnameTxt.val().trim(),
		gender: genderTxt.text(),
		age: ageTxt.val().trim(),
		weight: weightTxt.val().trim(),
		height: heightTxt.val().trim(),
	 	email: emailTxt.val().trim(),
	 	username: userNameTxt.val().trim(),
	 	password: passwordTxt.val().trim(),
	};

  database.ref('/users/' + userNameTxt.val().trim()).set(newUserObj);

  createNotifyMessage("User Registration", "glyphicon glyphicon-warning-sign", "info", "You have been successfully registered.", "top");
  
}

// Notify messages
function createNotifyMessage(title, glyphicon, type, message, from) {
	$.notify({
		title: "<strong>" + title + "</strong> - ",
		icon: glyphicon,
		message: message,
	},{
		type: type,
		animate: {
  	enter: "animated fadeInDown",
  	exit: "animated fadeOutRight"
	},
		placement: {
  		from: from,
  		align: "left"
	},
		offset: 20,
		spacing: 10,
		z_index: 1031,
	});
}