const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        default: 'untitled task'
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

taskSchema.pre('save', async function (next) {
    const task = this;
    if (!task.title.toLowerCase().trim().startsWith('task:')) {
        task['title'] = 'Task: ' + task['title'];
    }
    next();
});

const Tasks = mongoose.model('Tasks', taskSchema);

module.exports = Tasks;

