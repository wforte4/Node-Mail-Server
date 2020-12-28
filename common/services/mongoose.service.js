const mongoose = require('mongoose');
let count = 0;

const options = {
    autoIndex: false, 
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    // all other approaches are now deprecated by MongoDB:
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    
};
const connectWithRetry = () => {
    console.log('MongoDB Connecting...')
    mongoose.connect("mongodb://localhost:27017/rest-tutorial", options).then(()=>{
        console.log('Connected.')
    }).catch(err=>{
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', ++count);
        setTimeout(connectWithRetry, 5000)
    })
};

connectWithRetry();

exports.mongoose = mongoose;
