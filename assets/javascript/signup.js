var config = {
    apiKey: "AIzaSyDpzzV93BHYk3TuMUzBB4EH4H-q7weShzg",
    authDomain: "userinfo-fef20.firebaseapp.com",
    databaseURL: "https://userinfo-fef20.firebaseio.com",
    projectId: "userinfo-fef20",
    storageBucket: "userinfo-fef20.appspot.com",
    messagingSenderId: "329141712344"
};
firebase.initializeApp(config);

	$(document).ready(function(){
	
	const firstnameTxt = $("#firstname");
	const lastnameTxt = $("#lastname");
	const genderTxt = $("#gender option:selected");
	const ageTxt = $("#age");
	const weightTxt = $("#weight");
	const heightTxt = $("#height");
	const emailTxt = $("#email");
	const passwordTxt = $("#password");
	const usernameTxt = $("#username");
	const submitBtn = $("#submit");
	
	$("#submit").on("click", submitForm)

	function submitForm(e){
		e.preventDefault();
		console.log("----------" + firstnameTxt);
		const auth = firebase.auth();
        const username = usernameTxt.val().trim();
        const age = ageTxt.val().trim();
        const weight = weightTxt.val().trim();
        const height = heightTxt.val().trim();
        const gender = genderTxt.val().trim();
        const firstname = firstnameTxt.val();
        const lastname = lastnameTxt.val().trim();
        const email = emailTxt.val().trim();
        const password = passwordTxt.val().trim();
		const promise = auth.createUserWithEmailAndPassword(email,password)
		
		console.log("----------" + firstnameTxt.val());
        //promise.catch(function(error){
			
            //var errorCode = error.code;
            //var errorMessage = error.message;
			//console.log('signIn error', error); 
		//}); 

	        var user = {
	            firstname: firstname,
	            lastname: lastname,
	            email: email,
	            age: age,
	            gender: gender,
	            weight: weight,
	            height: height,
				username: username
			}

		const rootRef = firebase.database().ref();
		const usersRef = rootRef.child('users');
		const currentuser = auth.currentUser;
		const uid = currentuser.uid;
		const userRef = usersRef.child(uid);

		var user = {
			firstname: firstname,
			lastname: lastname,
			email: email,
			age: age,
			gender: gender,
			weight: weight,
			height: height,
			username: username
		}

		console.log(uid);
       
        userRef.push(user);

		}


	});




	firebase.auth().onAuthStateChanged(function(user){
	    if(user){
	        var uid = user.uid;
	        console.log(uid);
	    }else{
	        console.log('not logged in');
	    }
	});
