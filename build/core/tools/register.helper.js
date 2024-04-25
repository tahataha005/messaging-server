"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHelper = void 0;
const registerHelper = (app, helper) => {
    app.use(helper());
};
exports.registerHelper = registerHelper;
