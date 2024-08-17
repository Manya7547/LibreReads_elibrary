import express, { NextFunction, Request, Response } from "express";
import cors from "cors"; 
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import { config } from "./config/config";

// create an instance of express application 
const app = express();

app.use(
    cors({
        origin: config.frontendDomain, // Replace with your frontend domain
    })
);

app.use(express.json());

// Routes
// HTTP methods: GET, POST, PUT, PATCH, DELETE

// write the url segment and callback function inside parameter
// res object - for sending a response to client. types: text response, json response, xml response.
app.get("/", (req, res, next) => {
    res.json({ message: "Welcome to elib apis" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
