
import express from "express";
import checkConnection from "./DB/connectionDB.js";
import userRouter from "./modules/userModule/user.controller.js";
import cors from "cors"
import checkConnection_redis, { redis_client } from "./DB/connectionRedis.js";
import messageRouter from "./modules/messages/message.controller.js";
import { PORT, WHITE_LIST } from "../config/config.service.js";
const app = express();
import helmet from "helmet"
import rateLimit from "express-rate-limit";
const port = PORT

const bootstrap = async () => {
  const limiter = rateLimit({
    windowMs: 60 * 5 * 1000,
    limit: 3
})
  const corsOptions = {
    origin: function (origin, callback) {
      if ([...WHITE_LIST , undefined].includes(origin)) {
        callback(null , true)
      } else {
        callback( new Error("not allow by cros"))
      }
    },
  };
  app.use(express.json(), cors(corsOptions), limiter, helmet());
  await checkConnection();
  await checkConnection_redis()


  app.use("/users", userRouter);
  app.use("/message", messageRouter);
  app.get("/", (req, res) => res.send("Hello World!"));
  app.use("{/*demo}", (req, res, next) => {
    throw new Error(
      ` URL ${req.originalUrl} with Method ${req.method} not Found`,
      { cause: 404 },
    );
  });

  app.use((err, rq, res, next) => {
    res.status(err.cause || 500).json({
      message: err.message,
      statusCode: err.cause,
      stack: err.stack,
    });
  });
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};
export default bootstrap;
