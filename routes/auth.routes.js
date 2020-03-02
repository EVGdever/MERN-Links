const {Router} = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const config = require('../config/default');
const router = Router();

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Не коректный email').isEmail(),
        check('password', 'Пороль должен быть больше 6 символов')
            .isLength({min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Неккоректные данные для регистрации'
            });
        }

        const {email, password} = req.body;

        const person = await User.findOne({ email });
        if (rerson) {
            return res.status(400).json({ message: 'Такой пользователь уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({email, hashedPassword});

        await user.save();

        res.status(201).json({ message: 'пользователь создан' });

    } catch (e) {
        res.status(500).json({ message: 'не удалось зарегестрировать пользователя' });
    }
});

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Неккоректные данные при входе в систему'
                });
            }

            const {email, password} = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                res.status(400).json({ message: 'Пользователь не найден' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!user) {
                res.status(400).json({ message: 'Пароль не верный' });
            }

            const token = jwt.sign(
                {userId: user.id},
                    config.get('jwtSecret'),
                {expiresIn: '1h'}
                );

            res.status(201).json({token, userId: user.id});

        } catch (e) {
            res.status(500).json({ message: 'не удалось зарегестрировать пользователя' });
        }
});

module.exports = router;
