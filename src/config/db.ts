import mongoose from "mongoose";
import { config } from "./config";
// Code for database connection
// Always keep the database connection code in try catch 

const connectDB =async () => {
    try {

        // 'connected' is an event
        mongoose.connection.on('connected',() => {
            console.log("Connected to database successfully")

        })

        // in case there is an error after connection
        // 'error' is an event. callback parameter is also error 
        mongoose.connection.on('error',(error) => {
            console.log("Error connecting to Database", error)

        })

        // type cast the database url 
        await mongoose.connect(config.databaseUrl as string)

    } catch (error) {

        console.error("Failed to connect to Database", error);
        process.exit(1);

    }
};

export default connectDB;