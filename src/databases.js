import fs from "node:fs/promises";

const databasePath = "database.json";

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#database = {};
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2)).catch(
      (error) => {
        console.error("Erro ao salvar o banco de dados:", error);
      }
    );
  }

  select(table) {
    return this.#database[table] ?? [];
  }

  selectById(table, id) {
    const data = this.select(table);
    return data.find((item) => item.id === id) ?? null;
  }

  insert(table, data) {
    const item = { ...data, id: Date.now() };
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(item);
    } else {
      this.#database[table] = [item];
    }
    this.#persist();
    return item;
  }

  update(table, id, newData) {
    const collection = this.select(table);
    const index = collection.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const updated = {
      ...collection[index],
      ...newData,
      id: collection[index].id,
    };
    this.#database[table][index] = updated;
    this.#persist();
    return updated;
  }

  delete(table, id) {
    const collection = this.select(table);
    const index = collection.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.#database[table].splice(index, 1);
    this.#persist();
    return true;
  }
}
("");
