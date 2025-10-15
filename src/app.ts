import express from "express";
import "express-async-errors";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());
app.get("/test", (req, res)=>{
    return res.json("Server is live, baby!")
})

export { app };