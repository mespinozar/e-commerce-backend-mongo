const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
    const userList = await User.find().select('-passwordHash');

    if (!userList) {
        res.status(500).json({success: false})
    }
    res.send(userList);
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
        res.status(500).json({message: 'The user with the given id '})
    }
    res.status(200).send(user);
})

router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        color: req.body.color,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if (!user)
    return res.status(404).send('The user was not create')

    res.send(user);
})

router.delete('/:id', (req, res) => {
    User.finByIdAndRemove(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({success: true, message: 'User deleted'})

        } else {
            return res.status(404).json({success: false, message: 'User not found'})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
})

router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments((count)=> count)

    if (!userCount){
        res.status(500).json({success: false})
    }
    res.send({
        userCount: userCount
    });
})

module.exports = router;