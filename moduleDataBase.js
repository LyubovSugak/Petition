const spicedPg = require('spiced-pg');
const {dbUser, dbPass} = require('./secrets.json');
const db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/petition`);


exports.sign = ({first, last, sig}) => { 
	 return db.query(`INSERT INTO signature (first, last, signature) 
					VALUES ($1, $2, $3)
					RETURNING id`, [first, last, sig])
	 .then((result) => {
	 	return result.rows[0].id;
	 });
}

exports.getCountId = () => {
	return db.query(`SELECT COUNT(*) FROM signature`)
	.then((result) => {
		return result.rows[0].count;
	})
}

exports.getSigImg = (id) => {
	return db.query(`SELECT signature FROM signature WHERE id = $1`, [id])
	.then((result) => {
		return result.rows[0].signature;
	})
}

exports.getSigners = () => {
	return db.query(`SELECT first, last FROM signature`)
	.then((result) => {
		return result.rows;
	})
}


<!-- //W w -->