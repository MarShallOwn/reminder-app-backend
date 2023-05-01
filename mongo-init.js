console.log("Starting MongoDB Initializing")

db.auth(
  process.env.MONGO_INITDB_ROOT_USERNAME,
  process.env.MONGO_INITDB_ROOT_PASSWORD,
);

db.getSiblingDB(process.env.MONGO_INITDB_DATABASE).createUser({
  user: process.env.MONGO_INITDB_USERNAME,
  pwd: process.env.MONGO_INITDB_PASSWORD,
  roles: [{ role: 'readWrite', db: "reminder-app-db" }],
});

console.log("Finished MongoDB Initializing")