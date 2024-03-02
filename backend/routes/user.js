const express = require("express")
const { User, Account } = require("../schema")
const zod = require("zod")
const jwt = require("jsonwebtoken")
const authMiddleware = require("./auth")

const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstname: zod.string(),
    lastname: zod.string()
})

const userRouter = express.Router()
userRouter.post("/sign-up", async (req, res) => {
    //it will return true if all things are ok
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect input"
        })
    }
    //we will find any user is available of this name 
    const dbuser = await User.findOne({
        username: req.body.username
    })

    if (dbuser) {
        return res.status(411).json({
            message: "user already exists"
        })
    }
    //if not then 
    const createdUser = await User.create(req.body)

    const user_id = createdUser._id

    const token = jwt.sign({
        user_id,
    }, "Hanuman@2201")

    res.status(200).json({
        token: token,
        message: "user is created"
    })

    Account.create({
        userId: user_id,
        balance: Math.random() * (9999) + 1
    })
    return;

})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),

})
userRouter.post("/sign-in", async (req, res) => {
    //firstly we will get the username and password from body 
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect Input"
        })

    }

    const dbuser = await User.findOne({ username: req.body.username, password: req.body.password })
    if (!dbuser) {
        return res.status(411).json({
            message: "wrong credentials!"
        })

    }

    if (!dbuser) {
        return res.status(411).json({
            message: "wrong credentials"
        })
    }

    const user_id = dbuser._id
    const token = jwt.sign({
        user_id
    }, "Hanuman@2201")
    return res.status(200).json({
        message: "successfully logged in",
        token: token,
        firstname:dbuser.firstname,
        lastname:dbuser.lastname
    })

})
//we are making the zod validation for the firstname and lastname as told
const userbulkbody = zod.object({
    firstname: zod.string(),
    lastname: zod.string()
})

//we have to search the user based on the filter parameter
userRouter.get("/bulk", authMiddleware, async (req, res) => {
    const query_params = req.query.filter || ""
    //validating based on the firstname and lastname 
    try {
        userbulkbody.safeParse(query_params)
        const searchedUser = User.find({
            $or: [{
                username: query_params
            }, {
                lastname: query_params
            }]

        })
        res.status(200).json(searchedUser)

    } catch (e) {
        res.status(411).json({
            message: "Error from the search user field"
        })
    }
})

//all users 
userRouter.get("/all",async (req,res)=>{
    try{
        const searchAll = await User.find()
        res.status(200).json(searchAll)

    }catch(e){

    }
})

module.exports = userRouter