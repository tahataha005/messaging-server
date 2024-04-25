type ExpressApp = import("express").Express;

export const registerHelper = (app: ExpressApp, helper: Function) => {
  app.use(helper());
};
