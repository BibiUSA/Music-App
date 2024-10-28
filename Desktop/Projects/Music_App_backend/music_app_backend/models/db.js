import pg from "pg";

const client = new pg.Client({
  //   connectionString: process.env.DATABASE_URL,
  user: "postgres",
  host: "localhost",
  database: "music_app",
  password: "Skater28!",
  port: 5432,
});

export default client;
