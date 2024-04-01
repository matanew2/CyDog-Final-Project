const mongoose = require('mongoose');

const handlerSchema = new mongoose.Schema({
    // Define your schema fields here
    name: {
        type: String,
        required: true
    },
    job: {
        type: String,
        required: true
    },
    tasks : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],

});

const Handler = mongoose.model('Handler', handlerSchema);

module.exports = Handler;