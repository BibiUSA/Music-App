import pg from "pg";
import process from "process";

console.log(process.env.HOST, "Database CRed");

const client = new pg.Client({
  //   connectionString: process.env.DATABASE_URL,
  user: "music_app_database_y1bv_user",
  host: "dpg-cubueot6l47c73cqun9g-a.oregon-postgres.render.com",
  database: "music_app",
  password: "LwZHwbY2gxgKb9JZmXhE34jiX0Gjx2Op",
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Use `true` if you have a valid certificate
  },
});
////
export default client;
