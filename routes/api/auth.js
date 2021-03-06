const express = require('express');
const User = require('../../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

//Item Model
const Item = require('../../models/User');

// @route POST api/auth
// @desc Authenticate user
// @access public
router.post('/', (req, res) => {
    const { email, password } = req.body;

    //Validation

    if (!email || !password) {
        return res.status(400).json({
            msg: 'please enter all fields'
        })
    }

    //check exixting user
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    msg: 'User does not exists'
                })
            }


            // Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) {
                        return res.status(400).json({
                            msg: "invalid credientials"
                        });
                    }
                    jwt.sign(
                        { id: user.id },
                        config.get('jwtsecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                        }
                    );
                })
        });
});

// @route GET api/auth/user
// @desc get user
// @access private

router.get('/user', auth, (req, res) =>{
    User.findById(req.user.id)
    .select('-password')
    .then(user =>res.json(user))
})



module.exports = router;