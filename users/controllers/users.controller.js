const UserModel = require('../models/users.model');
const crypto = require('crypto');
const jwtSecret = require('../../common/config/env.config.js').jwt_secret,
jwt = require('jsonwebtoken');
const sendMail = require('../../common/middlewares/sendMail');

exports.insert = (req, res) => {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
    req.body.permissionLevel = 1;
    UserModel.createUser(req.body)
        .then((result) => { 
            res.status(201).send({id: result._id});
        });
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
exports.patchById = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }

    UserModel.patchUser(req.params.userId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId)
        .then((result)=>{
            res.status(204).send({});
        });
};

exports.forgotPassword = (req, res) => {
    let token = jwt.sign(req.params.email, jwtSecret);
    console.log(req.params.email)
    const url = 'http://localhost:3000/changepassword/' + token;
    const mail = sendMail.sendNewEmail(req.params.email, `Confirmation: <a href='${url}'>${url}</a>`, 'Forgot Password')
    if(mail) {
        res.status(200).send({confirmed: mail.accepted})
    }
    
}

exports.changePassword = (req, res) => {
    console.log(req.jwt)


}