// const sign = require('./moduleDataBase.js').sign;
// const getSigners = require('./moduleDataBase.js').getSigners;
// const countId = require('./moduleDataBase.js').countId;
// const sigImg = require('./moduleDataBase.js').sigImg;
// const usersDb = require('./usersModuleDB.js');
// const db = require('./usersDb.js');
// app.use(cookieSession({
//  secret: secret.sessSecret,
//  maxAge: 1000 * 60 * 60 * 24 * 14
// }))//for how much time to save cookies


// app.get('/kaliningrad', (req, res) => {
//     if (req.session.sigId) {
//         return res.redirect('/kaliningrad/signed');
//     } else {
//         res.render('home', {
//             layout: 'layout',
//             css: '../stylesheet.css'
//         })
//     }
// })
// app.post('/kaliningrad', (req, res) => {
// 	if (req.body.first && req.body.last && req.body.sig) {
// 		sign(req.body)
// 		.then((sigId) => {
// 			req.session.sigId = sigId;
// 			res.redirect('kaliningrad/signed');
// 		})
// 		.catch((err) => {
// 			console.log('/kaliningrad-post', err.stack);
// 		})
// 	}
// 	else {
// 		res.redirect('/kaliningrad');
// 	}	
// })

// app.get('/kaliningrad/signed', (req, res) => {
//     getCountId().then((countId) => {
//         getSigImg(req.session.sigId).then((sigImg) => {
//             res.render('signed', {
//                 layout: 'layout',
//                 css: '../stylesheet.css',
//                 num: countId,
//                 img: sigImg
//             })
//         })
//     })
//     .catch((err) => {
//       console.log('/kaliningrad-signed', err.stack)
//     });
// });

// app.get('/kaliningrad/signers', (req, res) => {
//     getSigners().then((signersArray) => {
//         res.render('signers', {
//             layout: 'layout',
//             css: '../stylesheet.css',
//             signers: signersArray
//         })
//     })
//     .catch((err) => {
//       console.log('/kaliningrad-signed', err.stack)
//     });
// })
