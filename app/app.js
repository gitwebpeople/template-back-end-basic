import "dotenv/config";
import express from "express";

import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";

import privateRoutes from "./routes/private";
import publicRoutes from "./routes/public";
require("./database/mongo");

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.corsOptions = {
      origin: process.env.CORS_URL.split(";"),
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204
    };
  }

  init() {
    this.configs();
    this.app.listen(this.port, () => {
      console.log("Serving on ", this.port);
    });
  }

  initDist() {
    const pathDist = path.join(__dirname, "../dist/");
    // Creating dist folder
    fs.mkdirSync(pathDist, { recursive: true });
  }

  configs() {
    this.initDist();
    this.app.use(bodyParser.json());
    this.app.use(cors(this.corsOptions));
    this.app.use("/dist", express.static(path.join(__dirname, "../dist")));
    privateRoutes(this.app);
    publicRoutes(this.app);
    return this;
  }
}

export default App;
