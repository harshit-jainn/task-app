const express = require('express');
const User = require('../models/User');
const router = new express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const Utils = require('../library/common');
const uplaod = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        // console.log(file);
        if (!file.originalname.match(/\.(png|jpg|gif|jpeg)$/)) {
            return cb(new Error('Uplaod a image'));
        }

        cb(undefined, true);
    }
});

router.post('/user', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        Utils.sendWelcomeEmail(user.email, user.name);
        const token = await user.generateToken();
        res.send({ user, token });
    } catch {
        res.status(500).send();
    }
});

router.get('/user/current', auth, async (req, res) => {
    try {
        res.send(req.user);
    } catch {
        res.status(404).send();
    }
});

router.get('/user/:id', auth, async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        user = await user.populate('tasks').execPopulate();
        console.log(user);
        res.send(user);
    } catch {
        res.status(500).send()
    }
});

router.patch('/user/:id', auth, async (req, res) => {
    const valuesAllowed = ['name', 'email', 'password', 'age'];
    const valuesReceived = Object.keys(req.body);
    const isUpdationValid = valuesReceived.every(val => valuesAllowed.includes(val));

    if (!isUpdationValid) {
        return res.status(400).send('Bad Request');
    }
    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        const user = await User.findById(req.params.id);
        valuesReceived.forEach(val => {
            user[val] = req.body[val];
        });
        await user.save();
        if (!user) {
            return res.status(400).send('Could not find id');
        }
        res.send(user);
    } catch {
        res.status(500).send();
    }
});

router.delete('/user/:id', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        Utils.sendGoodbyeEmail(user.email, user.name);
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateToken();
        if (!user) {
            return res.status(400).send({ 'error': 'Invalid Login details' });
        }
        res.send({ user, token });
    } catch {
        res.status(400).send()
    }
});

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => (token.token !== req.token));
        await req.user.save();
        res.send('logout complete');
    } catch {
        res.status(500).send()
    }
});

router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch {
        res.status(500).send();
    }
});

router.post('/user/current/avatar', auth, uplaod.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer;
    // const buffer = await getStream(req.file.stream);
    console.log(req.file);
    await req.user.save();
    res.send(req.user);
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    });
});

router.delete('/user/current/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch {
        res.status(400).send();
    }
});

router.get('/user/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            return res.status(404).send();
        }
        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch {
        res.status(404).send()
    }
});

module.exports = router;