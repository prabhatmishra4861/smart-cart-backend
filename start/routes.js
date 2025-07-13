const path = require("path");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const cors = require("cors");
const {errorHandler} = require("../middlewares/errorHandler");
const bodyParser = require("body-parser");
const compression = require("compression");
const express = require("express");

const productRoute = require("../routes/product.route")






module.exports = function (app,conn) {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Backend API",
        version: "1.0.0",
        description: "A simple express library API",
      },
      servers: [
        {
          url: process.env.BACKEND_URL,
        },
      ],
    },
    apis: [ "./swagger/*.js"],
  };
  const specs = swaggerJSDoc(options);

  app.set("trust proxy", true);


  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(
    cors({
      origin: "*",
    })
  );
  
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  app.use(compression());

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());



  app.use(express.static(path.join(__dirname, "../public")));

  //routes
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
  app.use("/products", productRoute);
 
 
  //errorHandler
  app.use(errorHandler);
};
