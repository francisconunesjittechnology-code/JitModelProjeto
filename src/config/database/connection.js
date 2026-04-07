import postgres from "pg";

const connection = new postgres.Pool({
  user: "postgres",
  host: "localhost",
  database: "jit-model",
  password: "12345",
  port: "5432",
});

try {
  connection.connect();
  console.log("connection - database on");
} catch (error) {
  console.log(error.message);
}

export default connection;
