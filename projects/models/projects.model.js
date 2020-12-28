const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {type: String, trim: true, default: ''},
    body: {type: String, trim: true, default: ''},
    tags: [String],
    images: [String],
    date: Date,
    created_at: {type: Date, default: Date.now}
});

projectSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
projectSchema.set('toJSON', {
    virtuals: true
});

projectSchema.findById = function (cb) {
    return this.model('Project').find({id: this.id}, cb);
};

projectSchema.statics.findByName = function(name) {
    return this.find({ title: new RegExp(name, 'i') });
};

const Project = mongoose.model('Project', projectSchema);

exports.findById = (id) => {
    return Project.findById(id)
        .then((result) => {
            result = result.toJSON()
            delete result._id
            delete result.__v
            return result
        });
}

exports.searchProjects = (search) => {
    console.log(search);
    return Project.findByName(search).then(results => {
        console.log(results)
        return results
    })
    console.log(result);
    
    
};

exports.createProject = (ProjectData) => {
    const project = new Project(ProjectData);
    console.log('New Project Created')
    return project.save();
}

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Project.find()
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

exports.updateProjectStatus = (id, body) => {
    return Project.findOneAndUpdate({
        _id: id
    }, body)
}

exports.removeById = (ProjectId) => {
    return new Promise((resolve, reject) => {
        Project.deleteMany({_id: ProjectId}, (err) => {
            if(err) {
                reject(err)
            } else {
                resolve(err)
            }
        })
    })
}