const express = require("express");
const mongoose = require("mongoose")
const rootRouter = require("./routes/index");
const app = express()
const cors = require("cors")

//middlewares 
//we will add cors 
//it will only listen the request from this link 
app.use(cors({
    origin:"http://localhost:3000",
}
))
//allow json format to use 
app.use(express.json())
   

app.listen(8000,()=>{
    console.log("app is listening on the server port 8000")
})

mongoose.connect("mongodb+srv://yashpatel21102002:KpZCS21w4dgcbvWj@cluster0.zxj9x6b.mongodb.net/?retryWrites=true&w=majority").then(
    console.log("connectd to db")
).catch((err)=>{
    console.log(err)
})


app.use("/api/v1", rootRouter);
