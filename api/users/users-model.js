const db = require('../../data/dbConfig');

const findBy = (filter) => {
    return db('users').where(filter);
}

const addUser = async (user) => {
    await db('users').insert(user);
    return db('users').where('username', user.username);
}

module.exports = {
    addUser,
    findBy,
}