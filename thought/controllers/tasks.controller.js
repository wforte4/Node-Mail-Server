const ThoughtModel = require('../models/tasks.model')


exports.insert = (req, res) => {
    ThoughtModel.createThought(req.body)
        .then((result) => { 
            res.status(201).send({id: result._id});
        });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 30;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    ThoughtModel.list(limit, page)
        .then((result) => { 
            res.status(200).send(result);
        })
};


exports.removeById = (req, res) => {
    ThoughtModel.removeById(req.params.thoughtID)
        .then((result)=>{
            res.status(204).send({});
        });
};

exports.getByEmail = (req, res) => {
    ThoughtModel.getByUser(req.params.email)
        .then((result)=>{
            res.status(200).send(result);
        });
};