import client from "../models/db.js";

export const saveUserInfo = async (req, res) => {
  console.log(req.body);
  try {
    const values = [
      req.body.email,
      req.body.fname,
      req.body.lname,
      "user" + req.body.firebaseUID.slice(0, 6),
      req.body.firebaseUID,
      req.body.date_created,
    ];
    const addData = `INSERT INTO user_info (email, fname, lname, username, firebase_uid, date_created, last_login)
        VALUES ($1, $2, $3, $4, $5, $6, $6);`;

    // VALUES ('mbibi28@gmail.com');`;

    const response = await client.query(addData, values);
    res.send({ data: response });
  } catch (error) {
    console.log(error);
  }
};

export const lastLogInDate = async (req, res) => {
  console.log(req.body);
  try {
    const values = [req.body.uid, req.body.date_login];
    const addData = `UPDATE user_info
    SET last_login = $2
    WHERE firebase_uid = $1;`;

    const response = await client.query(addData, values);
    res.send(response);
  } catch (error) {
    console.log(error);
  }
};

//checks to if a user and gets username
export const isSignedIn = async (req, res) => {
  console.log(req.body);
  try {
    const response = `SELECT COUNT(1)
    FROM user_info
    WHERE firebase_uid = '${req.body.uid}';`;
    res.send(response);
  } catch (error) {
    console.log(error);
  }
};

export const userInfo = async (req, res) => {
  console.log(req.params);
  try {
    const addData = `SELECT *
    FROM user_info
    WHERE firebase_uid = '${req.params.uid}'`;
    const response = await client.query(addData);
    res.send(response);
  } catch (error) {
    console.log(error);
  }
};
