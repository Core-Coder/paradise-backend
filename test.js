// const express = require("express");
// const app = express();
// const mysql = require("mysql2");
// const bcrypt = require("bcrypt");

// app.use(express.text());
// app.use(express.json());

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "projectBackend",
// });

// app.get("/", (req, res) => {
//   res.send("welcome to the vault");
// });

// app.post("/register", (req, res) => {
//   const user = req.body;

//   if (
//     !user.username ||
//     !user.password ||
//     !user.tglLahir ||
//     !user.jenisKelamin
//   ) {
//     res
//       .status(400)
//       .send(
//         "wajib menyertakan username, password, tanggal lahir, jenis kelamin"
//       );
//     return;
//   }

//   bcrypt.hash(user.password, 10, (err, result) => {
//     if (err) {
//       res.status(500).send("masalah dengan server");
//       return;
//     }

//     const q = `INSERT INTO user (username, password, tglLahir, jenisKelamin) VALUES ('${user.username}', '${result}','${user.tglLahir}','${user.jenisKelamin}')`;
//     connection.query(q, (err, result) => {
//       if (err) {
//         res.status(500).send("Ada masalah dengan hubungan ke server");
//         console.error(err);
//         return;
//       }

//       res.status(201).send("Registrasi User berhasil");
//     });
//   });
// });

// app.use((req, res, next) => {
//   const auth = req.headers.authorization || "";
//   const hasilSplit = auth.split(",");
//   const username = hasilSplit[0];
//   const password = hasilSplit[1];
//   const tglLahir = hasilSplit[2];
//   const jenisKelaim = hasilSplit[3];

//   const q = `SELECT * FROM user WHERE username='${username}'`;
//   connection.query(q, (err, result) => {
//     if (err) {
//       res.status(500).send("Ada masalah dengan hubungan ke server");
//       console.error(err);
//       return;
//     }

//     if (result.length === 0) {
//       res.send("oops, Anda tidak punya akses");
//     } else {
//       bcrypt.compare(password, result[0].password, (err, hasilCompare) => {
//         if (err) {
//           res.status(500).send("ada masalah pada server");
//           return;
//         }

//         if (hasilCompare) {
//           req.user = result[0];
//           next();
//         } else {
//           res.status(401).send("oops, Anda tidak punya akses");
//         }
//       });
//     }
//   });
// });

// app.post("/login", (req, res) => {

//   export const Login = async (req, res) => {
//     try {
//       const user = await User.findAll({
//         where: {
//           email: req.body.email,
//         },
//       });
//       const match = await bcrypt.compare(req.body.password, user[0].password);
//       if (!match) return res.status(400).json({ msg: "Wrong passeord" });
//       const userId = user[0].id;
//       const name = user[0].name;
//       const email = user[0].email;
//       const accessToken = jwt.sign(
//         { userId, name, email },
//         process.env.ACCESS_TOKEN_SECRET,
//         {
//           expiresIn: "20s",
//         }
//       );
//       const refreshToken = jwt.sign(
//         { userId, name, email },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//           expiresIn: "1d",
//         }
//       );
//       await User.update(
//         { refresh_token: refreshToken },
//         {
//           where: {
//             id: userId,
//           },
//         }
//       );
//       res.cookie("refreshToken", refreshToken, {
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000,
//       });
//       res.json({ accessToken });
//     } catch (error) {
//       res.status(404).json({ msg: "email tidak ditemukan" });
//     }
//   };

//   export const Logout = async (req, res) => {
//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) return res.sendStatus(204);
//     const user = await User.findAll({
//       where: {
//         refresh_token: refreshToken,
//       },
//     });
//     if (!user[0]) return res.sendStatus(204);
//     const userId = user[0].id;
//     await User.update(
//       { referesh_token: null },
//       {
//         where: {
//           id: userId,
//         },
//       }
//     );
//     res.clearCookie("refrehToken");
//     return res.sendStatus(200);
//   };
// });
