const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const url = "mongourl";
const client = new MongoClient(url, { useNewUrlParser: true });
class userDB {

	constructor() {

	}
	async connect() {
		this.client = await client.connect()
		console.log("Client Connected")
		this.collection = client.db("fbla").collection("users")
		return "connected to mongoDB database for users";
	}
	async createUser(email, password) {
		try {
			let hash = await this.hashIt(password)
			let created = await this.collection.insertOne({ _id: email, hash, results: [] })
			return "account created|" + hash
		} catch (e) {
			return "account already exists"
		}
	}
	async login(email, password) {
		try {
			let res = await this.collection.findOne({ _id: email })
			let authed = await this.compareIt(password, res.hash)
			if (authed) {
				return "authenticated|" + res.hash
			} else {
				return "wrong password"
			}
		} catch (e) {
			console.log(e)
			return "account not found"
		}
	}
	async check(email, hash) {
		try {
			let res = await this.collection.findOne({ _id: email })
			return res.hash == hash;
		}
		catch (e) {
			return false;
		}
	}
	async fetchResults(email, hash) {
		let authed = await this.check(email, hash);
		if (authed) {
			let res = await this.collection.findOne({ _id: email })
			return res.results;
		} else {
			console.log("error authing user")
			return []
		}
	}
	async addResult(config,questions,stats,email,hash) {
				let authed = await this.check(email, hash);
		if (authed) {
			let res = await this.collection.findOne({ _id: email })
			let results = res.results
			results.push({config,questions,stats})
			   const query = { _id: email };
    const updateDocument = {
      $push: { "results": {config,questions,stats}}
    };
    const result = await this.collection.updateOne(query, updateDocument);
			//this.collection.replaceOne({ _id: email, hash, results: results })
			console.log("replaced collection")
			return true;
		} else {
			console.log("error authing user with email "+email+" and hash "+hash)
			return []
			return false;
		}
	}
	async hashIt(password) {
		const salt = await bcrypt.genSalt(6);
		const hashed = await bcrypt.hash(password, salt);
		return hashed;
	}
	async compareIt(password, hashedPassword) {
		const validPassword = await bcrypt.compare(password, hashedPassword);
		return validPassword;
	}


}

module.exports = userDB;