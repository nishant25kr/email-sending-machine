import express, { json } from "express"
import dotenv from "dotenv"
import emailRoutes from "./routes/email.routes.js"

dotenv.config();

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000


app.use("/api/emails", emailRoutes);


app.get("/health",(req,res)=>{
    res.json(
        {message: "Welcome to email scheduler"}
    )
})

app.listen(PORT,()=>{
    console.log("Server is running ar ",PORT);
})