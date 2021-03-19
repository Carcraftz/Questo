const MongoClient = require('mongodb').MongoClient;
const url = "mongourl";
const client = new MongoClient(url, { useNewUrlParser: true });
class questionDB {

	constructor() {

	}
	async connect() {
		this.client = await client.connect()
		console.log("Client Connected")
		this.collection = client.db("fbla").collection("questions")
		return "connected to mongoDB database";
	}
	async getSet(setname) {
		try {
			let res = await this.collection.findOne({ _id: setname })
			return res;
		} catch (e) {
			{
				console.log(e)
				throw new Error("Question Set not found")

			}
		}

	}
	async createSet(setname, questions) {
		this.collection.insertOne({ _id: setname, questions })
	}

}

module.exports = questionDB