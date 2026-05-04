const {pool} = require('../config/database');

const findAll = async () => {
    const res = await pool.query(
      'SELECT * FROM restaurants ORDER BY rating DESC'
    );
    return res.rows
}

module.exports = {
    findAll
}


