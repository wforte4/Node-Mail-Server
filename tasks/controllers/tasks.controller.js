const TaskModel = require('../models/tasks.model')


exports.insert = (req, res) => {
    TaskModel.createTask(req.body)
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
    TaskModel.list(limit, page)
        .then((result) => { 
            res.status(200).send(result);
        })
};

exports.updateStatus = (req, res) => {
    TaskModel.updateTaskStatus(req.params.taskId, req.body)
        .then((result) => {
            res.status(200).send(result);
        })
}


exports.removeById = (req, res) => {
    TaskModel.removeById(req.params.taskId)
        .then((result)=>{
            res.status(204).send({});
        });
};