const express = require('express');
const router = express.Router();

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');


// @route    GET api/users
// @desc     register user
// @access   Public
router.post('/',
    [
        check('name', 'please include your name ').not().isEmpty(),
        // email must be an email
        check('email', 'please include your email address').isEmail(),
        // password must be at least 5 chars long
        check('password', 'please include your password with 5 or more character').isLength({ min: 5 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        try {
            //see if user is regestered with same email
            let user = await User.findOne({ email });

            if (user) {
                res.status(400).json({ errors: [{ msg: 'user already existes' }] });


            }
            //get users gravatar
            const avatar = gravatar.url(email, {
                s: '200',//size
                r: 'pg',//rating
                d: 'mm'//default
            });
            user = new User({
                name,
                email,
                avatar,
                password

            });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

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
// router.post('/', (req, res) => {
//     console.log(req.body);
//     res.send('user route');

// });

module.exports = router;