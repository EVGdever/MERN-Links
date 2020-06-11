const {Router} = require('express');
const auth = require('../middleware/auth.middleware');
const Link = require('../models/Link');
const config = require('config');
const shortId = require('shortid');
const router = Router();

router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl');
        const {from} = req.body;
        if (!(from.indexOf('http://') > 0) || !(from.indexOf('https://') > 0) || !(from.indexOf('.com') > 0)) {
            res.status(500).json({ message: 'не корректная ссылка', error: true });
        }
        const code = shortId.generate();
        const existing = await Link.findOne({ from });

        if (existing) {
            return res.json({ link: existing });
        }

        const to = baseUrl + '/t/' + code;

        const link = new Link({
            code, from, to, owner: req.user.userId
        });

        await link.save();

        res.status(201).json(link);

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({ owner: req.user.userId });
        res.json(links);
    } catch (e) {
        res.status(500).json({ message: 'ошибка при попытке получения всех ссылок' });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id); // ???
        res.json(link);
    } catch (e) {
        res.status(500).json({ message: 'ошибка при попытке получении ссылки по id' });
    }
});

module.exports = router;
