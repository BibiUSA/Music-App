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
  console.log("test", req.query);
  try {
    const addData = `SELECT *
    FROM user_info
    WHERE firebase_uid = '${req.query.uid}';`;
    const response = await client.query(addData);
    res.send(response);
  } catch (error) {
    console.log(error);
  }
};

export const usernameExists = async (req, res) => {
  console.log("test", req.query);
  try {
    const addData = `SELECT COUNT(1)
    FROM user_info
    WHERE UPPER(username) = UPPER('${req.query.username}');`;
    const response = await client.query(addData);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

export const updateUsername = async (req, res) => {
  console.log("final", req.body);
  try {
    const addData = `UPDATE user_info
    SET username_change_d = '${req.body.date}',
    username = '${req.body.username}'
    WHERE firebase_uid = '${req.body.uid}';`;
    const response = await client.query(addData);
    await client.query("COMMIT");
    res.send(response);
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).send(error);
  }
};

export const updateImg = async (req, res) => {
  try {
    const addData = `UPDATE user_info
    SET img_url = '${req.body.img}'
    WHERE username = '${req.body.username}';`;
    const response = await client.query(addData);
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const userCheck = async (req, res) => {
  console.log(req.body);
  try {
    const addData = `SELECT COUNT(1)
    FROM user_info
    WHERE firebase_uid = '${req.body.uid}';`;
    const response = await client.query(addData);
    if (response.rows[0].count == 0) {
      console.log("got here");
      const date = new Date();
      try {
        const newData = `INSERT INTO user_info
        (email, firebase_UID, username, date_created, last_login)
        VALUES ($1, $3, $2, $4, $4);`;
        const newValue = [
          req.body.email,
          "user" + req.body.firebaseUID.slice(0, 6),
          req.body.firebaseUID,
          date,
        ];
        const response = await client.query(newData, newValue);
        res.send(response);
      } catch (error) {
        res.status(500).send(error);
      }
    } else {
      res.send(response.rows);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateName = async (req, res) => {
  try {
    const addData = `UPDATE user_info
    SET fname ='${req.body.fname}',
    lname = '${req.body.lname}'
    WHERE firebase_uid = '${req.body.uid}';
    `;
    const response = await client.query(addData);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const searchUser = async (req, res) => {
  try {
    const getData = `SELECT username, img_url FROM user_info
    WHERE username ILIKE '%${req.query.search}%' ;`;
    const response = await client.query(getData);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
