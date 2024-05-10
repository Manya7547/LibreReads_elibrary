import express from 'express'

const app = express();


//Routes or URLs

app.get('/',(req, res, next) => {
    res.json({message: "Welcome to ELibrary"})
})

export default app