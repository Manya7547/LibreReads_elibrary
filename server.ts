// This is the entry point 
// starting the express server. 
// When we run the command: npm run dev - it will actually call "nodemon server.ts" (specified in package.json)

// imports your application's configuration settings, such as the port number.
import { config } from "./src/config/config"; 

// imports your Express application instance from the app.ts file
import app from "./src/app" 

// imports the function to connect to your database.
import connectDB from "./src/config/db";


// asynchronous function that first connects to the database using connectDB().
const startserver = async () => {
   
    //connect database
    await connectDB();
   
    const port = config.port || 3000;

    app.listen(port, () => {
        console.log(`listening on PORT: ${port}`)
    })
}

startserver();