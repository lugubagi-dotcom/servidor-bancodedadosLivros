import { MongoClient, ObjectId } from "mongodb";

const url = "mongodb://localhost:27017";
const dbName = "biblioteca";

export class Database {
  #client;
  #db;

  constructor() {
    this.#client = new MongoClient(url);
  }

  async connect() {
    try {
      await this.#client.connect();
      this.#db = this.#client.db(dbName);
      console.log("Conectado ao MongoDB!");
    } catch (error) {
      console.error("Erro ao conectar ao MongoDB:", error);
      throw error;
    }
  }

  #isValidId(id) {
    return ObjectId.isValid(id);
  }
  async select(collection) {
    return await this.#db.collection(collection).find().toArray();
  }

  async selectById(collection, id) {
    if (!this.#isValidId(id)) return null;

    return await this.#db
      .collection(collection)
      .findOne({ _id: new ObjectId(id) });
  }

  async insert(collection, data) {
    await this.#db.collection(collection).insertOne(data);
    return data;
  }

  async update(collection, id, newData) {
    if (!this.#isValidId(id)) return null;

    delete newData.id;
    delete newData._id;

    const result = await this.#db
      .collection(collection)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: newData },
        { returnDocument: "after" }
      );

    return result.value;
  }

  async delete(collection, id) {
    if (!this.#isValidId(id)) return false;

    const result = await this.#db
      .collection(collection)
      .deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount > 0;
  }
}
