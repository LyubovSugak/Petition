const spicedPg = require('spiced-pg');
const dbUrl = process.env.DATABASE_URL || `postgres:${require('./secrets').dbUser}:${require('./secrets').dbPass}@localhost:5432/petition`;
const db = spicedPg(dbUrl);
const bcrypt = require('bcryptjs');



function postNewRegister(first, last, email, hashedpassword) {
	return db.query(`INSERT INTO users (first, last, email, hashedpassword)
					VALUES ($1, $2, $3, $4)
					RETURNING id`, [first, last, email, hashedpassword])
	.then((result) => {
		return result.rows[0].id;
	})
}

function getPass(userEmail) {
	return db.query(`SELECT hashedpassword FROM users WHERE email = $1`, [userEmail])
	.then((result) => {
		return result.rows[0].hashedpassword;
	})
	.catch((err) => {
            console.log('getPass function', err.stack);
    })

}

function postNewProfile(age, city, homepage, userId) {
	return db.query(`INSERT INTO profiles (age, city, homepage, user_id)
					VALUES ($1, $2, $3, $4) RETURNING id`, [age, city, homepage, userId])
	.then((result) => {
		return result.rows[0];
	})
}

function getUserId(email) {
	return db.query(`SELECT id FROM users WHERE email = $1`, [email])
	.then((result) => {
		return result.rows[0].id;
	})

}

function getUserSigId(userId) {
	return db.query(`SELECT id FROM signature WHERE user_id = $1`, [userId])
	.then((result) => {
		return  result.rows[0] && result.rows[0].id;
	})
}

function setSig(sig, userId) { 
	 return db.query(`INSERT INTO signature (signature, user_id) 
					VALUES ($1, $2)
					RETURNING id`, [sig, userId])
	 .then((result) => {
	 	return result.rows[0].id;
	 });
}

function getSigImg(sigId) {
	return db.query(`SELECT signature FROM signature WHERE user_id = $1`, [sigId])
	.then((result) => {
		console.log(result)
		return result.rows[0].signature;
	})
}
//WHERE id = $1`, [sigId]
function getAllSigners() {
	return db.query(`SELECT COUNT(*) FROM signature`) 
	.then((result) => {
		return result.rows[0].count;
	})
}

function getSignersInfo() {
	return db.query(`SELECT users.first AS user_first, users.last AS user_last, 
					profiles.age AS profile_age, profiles.city AS profile_city, profiles.homepage AS profile_homepage
					FROM signature
					LEFT JOIN users
					ON users.id = signature.user_id 
					LEFT JOIN profiles
					ON users.id = profiles.user_id`)
	.then((result) => {
		return result.rows;
	})
	.catch((err) => {
            console.log('/signers', err.stack);
    })
}

function getUsersByCity(userCity) {
	return db.query(`SELECT users.first AS user_first, users.last AS user_last, 
				profiles.age AS profile_age, profiles.city AS profile_city,
				profiles.homepage AS profile_homepage
				FROM signature
				LEFT JOIN users 
				ON users.id = signature.user_id 
				LEFT JOIN profiles
				ON users.id = profiles.user_id
				WHERE  profiles.city = $1`, [userCity])
	.then((result) => {
		return result.rows;
	})
}

function getProfileInfo(userId) {
	return db.query(`SELECT users.first AS user_first, users.last AS user_last, 
				users.email AS user_email, 
				profiles.age AS profile_age, profiles.city AS profile_city, 
				profiles.homepage AS profile_homepage
				FROM signature
				LEFT JOIN users
				ON users.id = signature.user_id 
				LEFT JOIN profiles
				ON users.id = profiles.user_id WHERE users.id = $1`, [userId])
	.then((result) => {
		return result.rows[0];
	})
}

function updateUsersTableWithPass(first, last, email, hashedpassword, userId) {
	return db.query(`UPDATE users 
					SET first = $1, last = $2, email = $3, hashedpassword = $4 
					WHERE id = $5`, [first, last, email, hashedpassword, userId])
}

function updateUsersTableWithoutPass(first, last, email, userId) {
	return db.query(`UPDATE users SET first = $1, last = $2, email = $3 
					WHERE id = $4`, [first, last, email, userId])
}
function updateProfilesTable(age, city, homepage, userId) {
	return db.query(`UPDATE profiles SET age = $1, city= $2, homepage = $3 
					WHERE user_id = $4`, [age, city, homepage, userId])
}
//(`INSERT INTO profiles (age, city, homepage, user_id) 
				// VALUES ($1, $2, $3) ON CONFLICT (user_id)
				// DO UPDATE SET age = $1, city = $2, homepage = $3`, [age, city, homepage, user_id])

function deleteSignature(sigId) {
	return db.query(`DELETE FROM signature WHERE id = $1`, [sigId])
}

function logOut(userId) {
	userId = null;
}

function checkSigId(req, res, next) {
	if (!req.session.sigId) {
		return res.redirect('/petition');
	} 
	next();
}

// function toLowerCase(arg) {
// 	arg.toLowerCase();
// }

// function toUpperCase(arg) {
// 	arg.toUpperCase();
// }


exports.postNewRegister  = postNewRegister;
exports.getPass = getPass;
exports.postNewProfile = postNewProfile;
exports.getUserId = getUserId;
exports.setSig = setSig;
exports.getUserSigId = getUserSigId;
exports.getSigImg = getSigImg;
exports.getAllSigners = getAllSigners;
exports.getSignersInfo = getSignersInfo;
exports.getUsersByCity = getUsersByCity;
exports.getProfileInfo = getProfileInfo;
exports.updateUsersTableWithPass = updateUsersTableWithPass;
exports.updateUsersTableWithoutPass = updateUsersTableWithoutPass;
exports.updateProfilesTable = updateProfilesTable;
exports.deleteSignature = deleteSignature;
exports.logOut = logOut;
exports.checkSigId = checkSigId;
// exports.toLowerCase = toLowerCase;
// exports.toUpperCase = toUpperCase;

<!-- //W w -->