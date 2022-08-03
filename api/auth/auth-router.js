const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./auth-model');

router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password || req.body === null) {
        next({ message: 'username and password required' });
    } else if (username) {
        const user = await User.findBy({ username: username }).first();
        if (user) {
            next({ message: 'username taken' });
        } else {
            const passwordHash = bcrypt.hashSync(password, 8);
            User.addUser({ username, password: passwordHash })
                .then((added) => {
                    res.status(200).json(added);
                }).catch(next);
        }
    }
});

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password || req.body === null) {
        next({ message: 'username and password required' });
    } else if (username) {
        const user = await User.findBy({ username: username }).first();
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({
            message: `welcome, ${user.username}`,
            token
          })
        } else {
          next({ message: 'invalid credentials' });
        }
    }
});

const generateToken = (user) => {
  const payload = {
    subject: user.id,
    username: user.username
  };

  return jwt.sign(payload, 'secret', { expiresIn: '1d' })
};

module.exports = router;
