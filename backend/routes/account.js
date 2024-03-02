const express = require('express')
const authMiddleware = require('./auth')
const { Account, User } = require('../schema')
const { default: mongoose } = require('mongoose')
const { ObjectId } = require('mongodb')
const { number } = require('zod')
//define router
const router = express.Router()

//This will get the balance of user
router.get("/balance", authMiddleware, async (req, res) => {
    const useraccount = await Account.findOne({
        userId: req.userId,
    })


    if (!useraccount) {
        res.status(404).json({
            message: "there is no account with this id"
        })
        return
    }

    res.status(202).json({
        balance: useraccount.balance,
        message: "successfully fetched balance of user"
    })
})

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    var { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }
    console.log(account)
    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }
    console.log(toAccount)
    try {
        // Perform the transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // Commit the transaction
        await session.commitTransaction();
    } catch (e) {
        await session.abortTransaction()
    }

    res.json({
        message: "Transfer successful"
    });
});
module.exports = router