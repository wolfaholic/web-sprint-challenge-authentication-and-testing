const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
 const token = req.headers.authorization;
 if (!token) {
   next({ message: 'token required' });
 } else {
    jwt.verify(token, 'secret', (err) => {
      if (err) {
        next({ message: 'token invalid' });
      } else {
          next();
      }
    })
 }
};