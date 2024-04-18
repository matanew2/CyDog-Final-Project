const mongoose = require('mongoose');

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

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;