const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');


// @route    GET api/auth
// @desc     AUTH route
// @access   Public

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error ');
    }


});


// @route    post api/users
// @desc     login user
// @access   Public
router.post('/',
    [

        // email must be an email
        check('email', 'please include your email address').isEmail(),
        // password must be at least 5 chars long
        check('password', 'password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            //see if user is regestered with same email
            let user = await User.findOne({ email });

            if (!user) {
                res.status(400).json({ errors: [{ msg: 'invalid email' }] });


            }
            //check if the password existe 
            const paswwordMatches = await bcrypt.compare(password, user.password);

            if (!paswwordMatches) {
                res.status(400).json({ errors: [{ msg: 'invalid password' }] });


            }
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(payload, config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {

                    if (err) throw err;
                    res.json({ token });
                });
            //  res.send('user regestered')

        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error');
        }

    });
module.exports = router;