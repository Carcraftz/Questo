function logout() {
	localStorage.clear()
	location.href = "/login.html"
}
var dashboardApp = new Vue({
	el: '#quiz-app',
	data: {
		gotResults: false,
		startTime: new Date(),
		questionArray: [

		]
	},
	created() {
		this.fetchData();
	},
	methods: {
		fetchData() {
			fetch("https://quizapp.carcraftz.repl.co/createquiz?email=" + localStorage.getItem("email") + "&password=" + localStorage.getItem("password"), { method: "POST", body: localStorage.getItem("quizdata") }).then(res => res.text()).then(json => {
				this.questionArray = JSON.parse(json)
				this.checkResults()
			})

		},
		checkResults() {
			let resultdata = localStorage.getItem("resultdata")
			if (resultdata != null) {
				let indie = 0
				let questions = JSON.parse(resultdata).questions

				dashboardApp.gotResults = true;
				dashboardApp.questionArray.forEach(q => {
					questions.forEach(question => {
						if (question.type == q.type && question.type == "mc") {
							if (q.answers[q.correctAns] == question.answer) {
								dashboardApp.questionArray[indie].isCorrect = true
							} else {
								dashboardApp.questionArray[indie].isCorrect = false
							}
						} else if (question.type == q.type && question.type == "fillin") {
							if (q.correctAns.trim().toLowerCase() == question.answer.trim().toLowerCase()) {
								dashboardApp.questionArray[indie].isCorrect = true
							} else {
							
								dashboardApp.questionArray[indie].isCorrect = false
							}
						} else if (question.type == q.type && question.type == "dropdown") {
							if (q.answers[q.correctAns] == question.answer) {
								dashboardApp.questionArray[indie].isCorrect = true
							} else {
								dashboardApp.questionArray[indie].isCorrect = false
							}
						} else if (question.type == q.type && question.type == "truefalse") {
							if (q.correctAns == eval(question.answer.toLowerCase())) {
								dashboardApp.questionArray[indie].isCorrect = true
							} else {
								dashboardApp.questionArray[indie].isCorrect = false
							}
						} else if (question.type == q.type && question.type == "matching") {
							let totalcorrect = 0;
							for (let i = 0; i < q.correctAns.length; i++) {
								let pair = q.correctAns[i]
								let leftItem = q.left[pair.split(",")[0]]
								let rightItem = q.right[pair.split(",")[1]]
								question.answer.forEach(answer => {
									if (answer[0] == leftItem && answer[1] == rightItem) {
										totalcorrect++;
									}
								})
							}
							if (totalcorrect == q.correctAns.length) {
								dashboardApp.questionArray[indie].isCorrect = true

							} else {
								dashboardApp.questionArray[indie].isCorrect = false

							}

						}
					})
						indie++;

				})
				localStorage.removeItem("resultdata")
						document.getElementById("submit").style.display = "none"

			}
		}
	},
	watch: {
		'$route': 'fetchData'
	}
});

function submitmc(ele) {
	let nodes = ele.parentNode.childNodes
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].innerHTML == ele.innerHTML) {
			nodes[i].style.border = "4px solid #70C86A"
			nodes[i].style.transform = "scale(1.2)"

		} else {
			nodes[i].style.border = ""
			nodes[i].style.transform = ""

		}
	}

}
function submittf(ele) {
	let nodes = ele.parentNode.childNodes
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].tagName == "BUTTON") {
			if (nodes[i].innerHTML == ele.innerHTML) {
				nodes[i].style.border = "4px solid #70C86A"
				nodes[i].style.transform = "scale(1.2)"

			} else {
				nodes[i].style.border = ""
				nodes[i].style.transform = ""

			}
		}
	}
}

function submitquiz() {
			let indie = 0;
		let earned = 0;
		let attempted = 0
	let questionseles = document.querySelectorAll(".pdiv")
	let questions = []
	for (let i = 0; i < questionseles.length; i++) {
		let questionele = questionseles[i]
		let type = questionele.childNodes[0].className
		if (type == "mc") {
			let title = questionele.childNodes[0].childNodes[0].innerHTML
			let answereles = questionele.childNodes[0].childNodes[4].childNodes
			let answer = ""
			for (let x = 0; x < answereles.length; x++) {
				let chosen = answereles[x].style.transform.includes("scale")
				if (chosen) {
					answer = answereles[x].innerHTML
				}
			}
			questions.push({ type, title, answer })
		} else if (type == "fillin") {
			let title = questionele.childNodes[0].childNodes[0].innerHTML
			let answerele = questionele.childNodes[0].childNodes[4].childNodes[0]
			let answer = answerele.value
			questions.push({ type, title, answer })
		} else if (type == "dropdown") {
			let title = questionele.childNodes[0].childNodes[0].innerHTML
			let answerele = questionele.childNodes[0].childNodes[4].childNodes[0]
			let answer = answerele.value
			questions.push({ type, title, answer })
		} else if (type == "truefalse") {
			let title = questionele.childNodes[0].childNodes[0].innerHTML
			let answereles = questionele.childNodes[0].childNodes[4].childNodes
			let answer = ""
			for (let x = 0; x < answereles.length; x++) {
				if (answereles[x].tagName == "BUTTON") {
					let chosen = answereles[x].style.transform.includes("scale")
					if (chosen) {
						answer = answereles[x].innerHTML
					}
				}
			}
			questions.push({ type, title, answer })
		} else if (type == "matching") {
			let title = questionele.childNodes[0].childNodes[0].innerHTML
			let eles = questionele.childNodes[0].childNodes
			let pairs = []
			for (let i = 0; i < eles.length; i++) {
				if (eles[i].tagName == "DIV") {
					pairs.push([eles[i].childNodes[0].value, eles[i].childNodes[2].value])
				}
			}
			questions.push({ type, title, answer: pairs })
		}
	}
	localStorage.setItem("resultdata", JSON.stringify({ questions }))
	console.log("SAVED RESULTDATA")
	console.log(questions)
	dashboardApp.gotResults = true;
	dashboardApp.questionArray.forEach(q => {

		 attempted = questions.length;
		questions.forEach(question => {
			if (question.type == q.type && question.type == "mc" &&  question.title.includes(q.question)) {
				console.log("FOUND MC")
				if (q.answers[q.correctAns] == question.answer) {
					dashboardApp.questionArray[indie].isCorrect = true
					earned++
				} else {
					dashboardApp.questionArray[indie].isCorrect = false
				}
			} else if (question.type == q.type && question.type == "fillin" && question.title.includes(q.slug)) {
				if (q.correctAns.trim().toLowerCase() == question.answer.trim().toLowerCase()) {
					dashboardApp.questionArray[indie].isCorrect = true
					earned++
				} else {
					dashboardApp.questionArray[indie].isCorrect = false
					
				}
			} else if (question.type == q.type && question.type == "dropdown" && question.title.includes(q.slug)) {
				if (q.answers[q.correctAns] == question.answer) {
					dashboardApp.questionArray[indie].isCorrect = true
					earned++
				} else {
					dashboardApp.questionArray[indie].isCorrect = false
				}
			} else if (question.type == q.type && question.type == "truefalse" && question.title.includes(q.slug)) {
				if (q.correctAns == eval(question.answer.toLowerCase())) {
					dashboardApp.questionArray[indie].isCorrect = true
					earned++
				} else {
					dashboardApp.questionArray[indie].isCorrect = false
				}
			} else if (question.type == q.type && question.type == "matching" && question.title.includes(q.question)) {
				let totalcorrect = 0;
				for (let i = 0; i < q.correctAns.length; i++) {
					let pair = q.correctAns[i]
					let leftItem = q.left[pair.split(",")[0]]
					let rightItem = q.right[pair.split(",")[1]]
					question.answer.forEach(answer => {
						if (answer[0] == leftItem && answer[1] == rightItem) {
							totalcorrect++;
						}
					})
				}
				if (totalcorrect == q.correctAns.length) {
					dashboardApp.questionArray[indie].isCorrect = true
					earned++;
				} else {
					dashboardApp.questionArray[indie].isCorrect = false

				}

			}
		})
					indie++;

	})
	let startTime = dashboardApp.startTime
	let now = new Date();
	let diff = getDiff(startTime,now)
	console.log(formatDiff(diff))
	fetch("https://quizapp.carcraftz.repl.co/results", {
		method: "POST", body: JSON.stringify({
			email: localStorage.getItem("email"),
			password: localStorage.getItem("password"),
			config: JSON.parse(localStorage.getItem("quizdata")),
			questions: JSON.parse(localStorage.getItem("resultdata")),
			stats:{earned,attempted,time:formatDiff(diff)}
		})
	}
	).then(res => res.json()).then(json => {
		console.log("POSTED RESULT DATA")
		document.getElementById("submit").style.display = "none"
		localStorage.removeItem("resultdata")
	})
}

function getDiff(date1, date2) {
  return Math.abs(date1 - date2);
}

function formatDiff(ms) {
  let seconds = ms / 1000;
  let minutes = seconds / 60;

  const humanized = `${Math.floor(minutes % 60)}m ${Math.floor(seconds % 60)}s`;

  return humanized;
}
function printstate(){
	window.print()
}