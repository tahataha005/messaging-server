"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const register_helper_1 = require("./core/tools/register.helper");
const connection_1 = require("./core/config/db/connection");
require("./core/config/socket/connection");
const connection_2 = require("./core/config/socket/connection");
const routes_1 = __importDefault(require("./domain/users/routes"));
const routes_2 = __importDefault(require("./domain/chats/routes"));
const app = (0, express_1.default)();
dotenv_1.default.config();
(0, register_helper_1.registerHelper)(app, express_1.default.json);
(0, register_helper_1.registerHelper)(app, cors_1.default);
app.use("/users", routes_1.default);
app.use("/chats", routes_2.default);
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    (0, connection_1.dbConnection)();
    (0, connection_2.socketConnection)();
    console.log(`Server is running on port ${PORT}`);
});
