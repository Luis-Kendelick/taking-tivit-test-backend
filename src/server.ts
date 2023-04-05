import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const serverPort = process.env.PORT || 3333;

app.get("/", (request, response) => {
    return response.json({ message: "Hello World!" });
});

app.listen(serverPort, () => {
  console.log("Server started on port 3333!!");
});
