const spicedPg = require('spiced-pg');
const dbUrl = process.env.DATABASE_URL || `postgres:${require('./secrets').dbUser}:${require('./secrets').dbPass}@localhost:5432/petition`;
const db = spicedPg(dbUrl);
const bcrypt = require('bcryptjs');
const pm = require('./passModule.js');

function hashPassword(pass) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(pass, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

function checkPassword(passEnteredByUser, hashedPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(passEnteredByUser, hashedPassword, function(err, doesMatch) {
            if (err) {
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
}

exports.hashPassword = hashPassword;
exports.checkPassword = checkPassword;