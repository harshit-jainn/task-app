const express = require('express');
const Task = require('../models/Task');
const router = new express.Router();
const auth = require('../middleware/auth');
const Utils = require('../library/common');

router.post('/task', auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        user: req.user._id
    })
    try{
        await task.save();
        res.send(task);
    } catch {
        res.status(404).send();
    }
});

router.get('/tasks', auth, async (req, res) => {
    try{
        // const tasks = await Task.find({});
        // console.log(Utils);
        console.log(req.query);
        const keysAllowed = [];
        const match = Utils.getMatch(req);
        const options = Utils.getOptions(req, 'updatedAt', 'desc');
        console.log(match, options);
        await req.user.populate({
            path: 'tasks',
            match,
            options,
        }).execPopulate();
        // console.log(req.user.tasks);
        res.send(req.user.tasks);
    } catch {
        res.status(404).send();
    }
});
router.get('/task/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        await task.populate('user').execPopulate();
        res.send(task);
    } catch {
        req.status(500).send()
    }
});

router.patch('/task/:id', auth, async (req, res) => {
    const valuesAllowed = ['title', 'completed'];
    const valuesReceived = Object.keys(req.body);
    const isUpdationValid = valuesReceived.every(val => valuesAllowed.includes(val));

    if (!isUpdationValid) {
        return res.status(400).send('Bad Request');
    }
    try {
        const task = await Task.findById(req.params.id);
        valuesReceived.forEach(val => {
            task[val] = req.body[val];
        });
        console.log(task);
        await task.save();
        if (!task) {
            return res.status(400).send('Could not find id');
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete('/task/:id', auth, async (req,res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send({error: 'Task not found'});
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;