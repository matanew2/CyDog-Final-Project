const mongoose = require('mongoose');

/**
 * Dog schema
 * @type {mongoose.Schema}
 * @property {string} name - Dog's name
 * @property {string} breed - Dog's breed
 * @property {number} age - Dog's age
 * @property {string} job - Dog's job
 * @property {mongoose.Schema.Types.ObjectId[]} tasks - Dog's tasks
 * @returns {mongoose.Schema} - Dog schema
 */
const dogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    job: {
        type: String,
        required: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
});

/**
 * Dog model
 * @type {mongoose.Model}
 */
const DogSchema = mongoose.model('Dog', dogSchema);

module.exports = DogSchema;