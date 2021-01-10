const UserModel = require('../models/users.model');
const crypto = require('crypto');
const jwtSecret = require('../../common/config/env.config.js').jwt_secret,
jwt = require('jsonwebtoken');
const sendMail = require('../../common/middlewares/sendMail');

exports.insert = async (req, res) => {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
    req.body.permissionLevel = 1;
    let alreadyExists = false
    try {
        const hasAccount = await UserModel.findByEmail(req.body.email)
        console.log(hasAccount)
        if(hasAccount.length > 0) throw "User has account"
    } catch (e) {
        console.log(e)
        alreadyExists = true;
        res.status(500).send({error: e})
    }
    
    if(!alreadyExists) {
        UserModel.createUser(req.body)
        .then((result) => { 
            res.status(201).send({id: result._id});
        });
    }
    
    
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    UserModel.list(limit, page)
        .then((result) => { 
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    UserModel.findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};
exports.patchById = async (req, res) => {
    console.log(req.params.userId)
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }
    console.log('hit')

    await UserModel.patchUser(req.params.userId, req.body.userData)
        .then((result) => {
            console.log(result)
            return res.status(200).send(result);
        });

};

exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId)
        .then((result)=>{
            res.status(204).send({});
        });
};

exports.forgotPassword = async (req, res) => {
    let token = jwt.sign({email: req.params.email}, jwtSecret, {expiresIn: '10h'});
    console.log(req.params.email)
    const url = 'https://synapseflash.com/changepassword?auth=' + token;
    try {
        const mail = await sendMail.sendNewEmail(req.params.email, 'Forgot Password', 
        `
        <div style="float: left; margin-left: 5%; width: 70%; height: 300px; padding: 100px 10%; background: rgba(10,10,10,1); position: relative; border-radius: 8px;">
            <div style="display: flex; justify-content: center; align-items: center; align-content: center; width: 100%;"><img src="https://synapseflash.com/think.png" style="float: left; width: 50px; height: 50px; margin: 25px 0;"></img></div>
            <h1 style="float: left; width: 100%; font: 26px arial; color: white;">Synapse Flash Password Reset</h1>
            <h2 style="float: left; width: 100%; font: 14px arial: color: white; margin: 8px 0;">This link is only good for 10 hours, make sure you change your password before that time</h2>
            <a style="float: left; margin: 10px 0; font: 14px arial; padding: 10px; border-radius: 3px; cursor: pointer; text-decoration: none; background: white; color: black;" href='${url}'>Click here to reset password</a>
        </div>
        `)
        if(mail) {
            console.log(mail)
        }
        res.status(200).send({Confirmed: "Success"})
    } catch (e) {
        console.log(e)
        res.status(400).send({confirmed: "Failed"})
    }

    
}

exports.changePassword = (req, res) => {
    console.log(req.jwt)
    console.log(req.params.newpass)

    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.params.newpass).digest("base64");
    req.params.newpass = salt + "$" + hash;

    UserModel.resetPass(req.jwt.email, req.params.newpass).then((result) => {
        console.log(result)
        res.status(200).send({Confirmation: 'Password Changed'})
    })

}