function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}
var notyf = new Notyf({position:{x:"right",y:"top"}});

function submitlogin() {
	console.log("logging in")
	let email = document.getElementById("email").value
	let password = document.getElementById("password").value
	if (validateEmail(email)) {

		fetch("https://quizapp.carcraftz.repl.co/login", {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify({
				email,
				password
			})
		}).then(res => {
			return res.text()
		}).then(text => {
			if(text.includes("user authenticated")){
				let password = text.split("|")[1]
				localStorage.setItem("password",password)
				localStorage.setItem("email",email)
				location.href = "/index.html"
			}else{
				notyf.error('Invalid credentials');
			}
		})
	} else {
						notyf.error('Email not valid... please enter a valid email');

		//toast .. not valid etc
	}
}
//clear cached results when loaded
				localStorage.removeItem("resultdata")