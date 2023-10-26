import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

import express from "express";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import crypto from "node:crypto";
const PORT = 3030;
const app = express();
app.use(morgan("tiny"));
app.listen(PORT, err => {
  console.log(
    err ? `Server not running. ${err}` : `Server up at http://localhost:${PORT}`
  );
});

app.get("/", (req, res) => {
  res.json({ message: "JSON WEB TOKEN" });
});

app.get("/api/login", (req, res) => {
  /* Aquí simulamos que en la request nos enviaron nombre y contraseña, la API fue 
  a buscar esos datos a la base de datos y, como los encontró, nos devolvió un objeto 
  user. Es decir, simulamos un login exitoso*/
  const client = {
    id: crypto.randomUUID(),
    name: "Marcelo Bettini",
    email: "marcelobettini@utn.edu.ar",
  };

  /*
Como el usuario se ha logueado correctamente (autenticación), vamos a crear un token para identificarlo y darle sus permisos (autorización).
Para crear el token vamos a usar el paquete jwt con el método sign(). Le pasaremos el
usuario que está autenticado.
*/

  //refactor with security measures
  jwt.sign({ user: client }, JWT_SECRET, { expiresIn: "30s" }, (err, token) => {
    if (err) return res.json({ message: err });
    res.json({ token });
  });
});

app.post("/api/posts", verifyToken, (req, res) => {
  res.json({ message: "Post created!", author: req.auth });
});

// middleware: es una pieza de código que corre entre la petición y el controlador

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader === "undefined")
    res.status(403).json({ message: "No token, No money" }); //early return
  const token = bearerHeader.split(" ").pop();
  console.log(token);
  jwt.verify(token, JWT_SECRET, (err, auth) => {
    if (err) {
      res.status(400).json({ message: "Token invalid or expired" });
    } else {
      req.auth = auth;
      next();
    }
  });
}
