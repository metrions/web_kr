db = db.getSiblingDB('web');
db.createCollection('items');
db.items.insertOne({ name: "test item" });
db.createUser({
    user: "user",
    pwd: "password",
    roles: [{ role: "readWrite", db: "web" }]
})