const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const thoughtSchema = new Schema({
    thought: String,
    user: String,
    mindset: String,
    created_at: {type: Date, default: Date.now}
});

thoughtSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
thoughtSchema.set('toJSON', {
    virtuals: true
});

thoughtSchema.findById = function (cb) {
    return this.model('Thoughts').find({id: this.id}, cb);
};

const Thought = mongoose.model('Thoughts', thoughtSchema);


exports.createThought = (ThoughtData) => {
    const Thought = new Thought(ThoughtData);
    console.log('New Thought Created')
    return Thought.save();
}

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Thought.find()
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

exports.removeById = (ThoughtId) => {
    return new Promise((resolve, reject) => {
        Thought.deleteMany({_id: ThoughtId}, (err) => {
            if(err) {
                reject(err)
            } else {
                resolve(err)
            }
        })
    })
}