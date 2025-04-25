const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean,
        default: false,
    },
});

const TodoModel = mongoose.model('Todo', todoSchema);
module.exports = TodoModel;