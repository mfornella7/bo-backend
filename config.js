const dotenv = require('dotenv');

try {
    dotenv.config();
} catch (e) {
    console.log(e);
}

module.exports = {
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/binaryOptions',
    JWT_SECRET: process.env.JWT_SECRET || 'ABCDEFG123456!@#$%',
    JWT_EXPIRES: process.env.JWT_EXPIRES || '50d'
}