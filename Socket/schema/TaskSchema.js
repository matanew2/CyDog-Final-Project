const mongoose = require('mongoose');
/**
 * Task schema
 * @type {mongoose.Schema}
 * @property {string} title - Task's title
 * @property {string} description - Task's description
 * @property {mongoose.Schema.Types.ObjectId} dog - Task's dog
 * @property {mongoose.Schema.Types.ObjectId} handler - Task's handler
 * @property {Date} dueDate - Task's due date
 * @property {Date} createdAt - Task's creation date
 * @property {string} videoName - Task's video name
 * @property {string[]} commands - Task's commands
 * @returns {mongoose.Schema} - Task schema
 */
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dog',
        required: true
    },
    handler: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Handler',
        required: true
    },
    dueDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    videoName: {
        type: String,
        default: '<no video>'
    },
    commands: {
        type: [String],
        default: []
    },
});

/**
 * Task model
 * @type {mongoose.Model}
 */
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;