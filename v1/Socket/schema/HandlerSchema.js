const mongoose = require('mongoose');

/**
 * Handler schema
 * @type {mongoose.Schema}
 * @property {string} name - Handler's name
 * @property {string} job - Handler's job
 * @property {mongoose.Schema.Types.ObjectId[]} tasks - Handler's tasks
 * @returns {mongoose.Schema} - Handler schema
 */
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

/**
 * Handler model
 * @type {mongoose.Model}
 */
const Handler = mongoose.model('Handler', handlerSchema);

module.exports = Handler;