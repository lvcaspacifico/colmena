import express from "express";
import "express-async-errors";
import cors from "cors";

import { routes } from "./routes/index-routes";
import { errorHandler } from "./utils/Errors/ErrorHandler";


const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Colmena API is buzzing 🐝' });
});

app.use(express.json());
app.use(routes);
app.use(errorHandler);

export { app };