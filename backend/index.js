const fastify = require('fastify')({ logger: false })
const questionDB = require("./questionDB")
const userDB = require("./userDB")
const nodeMailer = require('nodemailer');
const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.emailuser,
    pass: process.env.emailpass
  }
});
fastify.register(require('fastify-cors'), {
	// put your options here
})

let qdb = new questionDB()
let udb = new userDB()
qdb.connect().then(async connected => {
	udb.connect().then(async uconnected => {
		fastify.get("/", async (request, reply) => {
			reply.send("Hello World")
		})
		fastify.post("/login", async (request, reply) => {
			let data = request.body
			try {
				let email = data.email
				let password = data.password
				if (validateEmail(email)) {
					udb.createUser(email, password).then(xdata => {
						if (xdata == "account already exists") {
							udb.login(email, password).then(data => {
								if (data.includes("authenticated")) {
									reply.send("user authenticated|" + data.split("|")[1])
								} else if (data == "wrong password") {
									reply.send("Wrong Password")
								} else {
									reply.send("unknown error")
								}
							}).catch(e => {
								console.log(e)
								reply.send("unknown error")
							})
						} else {
							reply.send("account created -> user authenticated|" + xdata.split("|")[1] )
						}
					}).catch(e => {
						console.log(e)
						reply.send("unknown error")
					})
				} else {
				
					reply.send("unknown error")
				}
			}
			catch (e) {
				console.log(e)
			}
		})
		fastify.post('/createquiz', async (request, reply) => {
			let data = JSON.parse(request.body)
			try {
				let set = await qdb.getSet("quiz");
				let questions = set.questions;
				let qstosend = []; 
				questions.forEach(question => {
					Object.keys(data).forEach(key => {
						if (question.type == key) {
							if (data[key] > 0) {
								qstosend.push(question)
								data[key]--
							}
						}
					})
				})
				reply.send(qstosend)
			} catch (e) {
				console.log(e)
				reply.send("Error fetching questions (make sure the set name is correct)")
			}
		})
		fastify.get("/results", async(request,reply)=>{
			let params = request.query
			let results = await udb.fetchResults(params.email,params.password)
			reply.send(results)
		})
		fastify.post("/results", async(request,reply)=>{
		let data =  JSON.parse(request.body)
			try {
				console.log(data)
				let email = data.email
				let password = data.password
				let config = data.config
				let questions = data.questions
				let stats = data.stats
				console.log("got data")
			
				let res = await udb.addResult(config,questions,stats,email,password)
				    console.log("sending email!")
    var mailOptions = {
      from: "tacouptime@gmail.com",
      to: email,
      subject: `You just completed an FBLA quiz on Questo`,
      text: 'You completed your quiz in '+stats.time+" and received a score of "+(stats.earned)/(stats.attempted)*100+"%. Please log into questo to view more details."
    };
    transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
				console.log("SENDING REPLY")
				reply.send(res);
			}catch(e){
				console.log("GOT ERROR "+e)
				reply.send(e);

			}
		})
		// Run the API!
		const start = async () => {
			try {
				await fastify.listen(3000, "::")
				console.log("listening on a port")
			} catch (err) {
				fastify.log.error(err)
				process.exit(1)
			}
		}
		start()
	})
})

function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}