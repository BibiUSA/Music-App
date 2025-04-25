import client from "../models/db.js";

// export const check = async (req, res) => {
//   try {
//     const addData = `INSERT INTO messages (sender, receiver,message, tile_id, time)
//     VALUES($1, $2, $3, $4, NOW());`;
//     const values = [
//       req.body.sender,
//       req.body.receiver,
//       req.body.message,
//       req.body.tile_id,
//     ];
//     const response = await client.query(addData, values);
//     console.log(req.body);
//     res.send(response);
//   } catch (error) {
//     console.log(error);
//     res.send(error);
//   }
// };

export const getConversations = async (req, res) => {
  console.log(req.query.user);
  try {
    const getData = `SELECT * 
    FROM messages
    WHERE sender = '${req.query.user}'
    OR receiver = '${req.query.user}';`;
    const response = await client.query(getData);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
