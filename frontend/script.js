var dashboardApp = new Vue({
  el: '#dashboard-app',
  data: {
    submissionArray: []
		
  },
	created () {
		this.fetchData()
	},
	methods:{
		fetchData(){
			fetch("https://quizapp.carcraftz.repl.co/results?email="+localStorage.getItem("email")+"&password="+localStorage.getItem("password")).then(res=>res.text()).then(json=>{
				this.submissionArray = JSON.parse(json)
				console.log(this.submissionArray)
				
			})

		},
		 visitResults(user){
	localStorage.setItem("quizdata",JSON.stringify(user.config))
	localStorage.setItem("resultdata",JSON.stringify(user.questions))
	console.log(user)
	location.href = "https://quizfrontend.carcraftz.repl.co/takequiz.html"

}
	}, watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  }
});
function createquiz(){
Swal.fire({
  html:
    `<h1 class = "swalhead">Please enter question numbers:</h1><br><br><p class = "swalheader" >Multiple Choice:</p><input class = "swalinput" id="mc"><p class = "swalheader" >Fill in the Blank:</p><input class = "swalinput" id="fillin"><p class = "swalheader" >Dropdown:</p><input id="dropdown" class = "swalinput"><p class = "swalheader" >True/False:</p><input id="truefalse" class = "swalinput"><p class = "swalheader" >Matching:</p><input class = "swalinput" id="matching">`,

  preConfirm: function () {
    return new Promise(function (resolve) {
      resolve([
        document.querySelector('#mc').value,
        document.querySelector('#fillin').value,
				document.querySelector('#dropdown').value,
				document.querySelector('#truefalse').value,
				document.querySelector('#matching').value
      ])
    })
  },
  onOpen: function () {
  }
}).then(function (result) {
	console.log(result)
	let body = {mc:result.value[0],fillin:result.value[1],dropdown:result.value[2],truefalse:result.value[3],matching:result.value[4]}
	localStorage.setItem("quizdata",JSON.stringify(body))

	console.log(body)
	setTimeout(redirect=>{location.href = "/takequiz.html"},500)
})
}
function logout() {
	localStorage.clear()
	location.href = "/login.html"
}
if(localStorage.getItem("email")== null ){
	location.href = "/login.html"
}
//clear cached results when loaded
				localStorage.removeItem("resultdata")
