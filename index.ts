import express from "express";
import http from "http";
import cors from "cors";
import dotEnv from "dotenv";
import { registerHelper } from "./core/tools/register.helper";
import { dbConnection } from "./core/config/db/connection";
import { socketConnection } from "./core/config/socket/connection";
import userRoutes from "./domain/users/routes";
import chatRoutes from "./domain/chats/routes";
import { Server, Socket } from "socket.io";

const app = express();

dotEnv.config();
registerHelper(app, express.json);
registerHelper(app, cors);

app.use("/users", userRoutes);
app.use("/chats", chatRoutes);

const server = http.createServer(app);
const PORT = process.env.SERVER_PORT || 3000;

server.listen(PORT, () => {
  dbConnection();
  socketConnection(server);

  console.log(`Server is running on port ${PORT}`);
});
