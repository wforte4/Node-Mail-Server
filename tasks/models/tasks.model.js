const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    objective: String,
    status: String,
    priority: String,
    assignee: String,
    created_at: {type: Date, default: Date.now}
});

taskSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
taskSchema.set('toJSON', {
    virtuals: true
});

taskSchema.findById = function (cb) {
    return this.model('Tasks').find({id: this.id}, cb);
};

const Task = mongoose.model('Tasks', taskSchema);

exports.findById = (id) => {
    return Task.findById(id)
        .then((result) => {
            result = result.toJSON()
            delete result._id
            delete result.__v
            return result
        });
}

exports.createTask = (taskData) => {
    const task = new Task(taskData);
    console.log('New Task Created')
    return task.save();
}

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Task.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.updateTaskStatus = (id, body) => {
    return Task.findOneAndUpdate({
        _id: id
    }, body)
}

exports.removeById = (taskId) => {
    return new Promise((resolve, reject) => {
        Task.deleteMany({_id: taskId}, (err) => {
            if(err) {
                reject(err)
            } else {
                resolve(err)
            }
        })
    })
}