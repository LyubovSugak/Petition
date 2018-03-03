const usersModule = require('./usersModuleDB.js');
const passModule = require('./passModule.js');
// const secret = require('./secrets.json');

// const redis = require('./myRedis.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const csrfProtection = csrf({cookie: true})
const cookieSession = require('cookie-session');
const hb = require('express-handlebars');
app.engine('handlebars', hb({
    defaultLayout: 'main_layout'
}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(require('cookie-parser')());
app.use(cookieSession({
 secret: process.env.SESSION_SECRET || require('./secrets.json').sessSecret, 
 maxAge: 1000 * 60 * 60 * 24 * 14
}));
app.use(express.static('public'));

app.use((req, res, next) => {
    if (!req.session.userId && req.url != '/register' && req.url != '/login') {
        res.redirect('/register')
    } else {
        next();
    }   
})

app.get('/', (req, res) => {
    res.redirect('/register');
})

app.get('/register', (req, res) => {
    res.render('register', {
        layout: 'reg_layout'
    });
})

app.post('/register', (req, res) => {
    const {first, last, email, password} = req.body;
    passModule.hashPassword(password)
    .then((hashedpassword) => {
        usersModule.postNewRegister(first, last, email, hashedpassword)
        .then((userId) => {
            req.session.userId = userId;
            res.redirect('/profile')
        })
    })
    .catch((err) => {
        console.log('/register-post', err.stack);
    })   
})

app.get('/login', (req, res) => {
    res.render('login', {
        layout: 'reg_layout'
    });
})

app.post('/login', (req, res) => {
    const {email, password} = req.body
    usersModule.getPass(email)
    .then((hashPassword) => {
        passModule.checkPassword(password, hashPassword)
        .then((doesMatch) => {
            if (doesMatch) {
                usersModule.getUserId(email)
                .then((userId) => {
                    req.session.userId = userId;
                    usersModule.getUserSigId(userId)
                    .then((userSigId) => {
                        if (userSigId) {
                            req.session.sigId = userSigId;
                            res.redirect('/signed');
                        }else {
                            res.redirect('/petition')
                        }                                  
                    })
                    .catch((err) => {
                        console.log('/get-user-sigId', err.stack);
                    })     
                })
            } else {
               res.redirect('/register'); 
            }
            
        })
        .catch((err) => {
            console.log('/login-post', err.stack);
        })
    })
    .catch((err) => {
            console.log('/login-post', err.stack);
    })
})

app.get('/profile', (req, res) => {
    res.render('profile')   
})

app.post('/profile', (req, res) => {
    const {age, city, homepage} = req.body;
    usersModule.postNewProfile(age, city, homepage, req.session.userId)
    .then((resultProfile) => {
        res.redirect('/petition')
    })
    .catch((err) => {
            console.log('/profile-post', err.stack);
    })
})

app.get('/petition', (req, res) => {
    if (req.session.sigId) {
        return res.redirect('/signed');    
    } 
    res.render('petition');         
})

app.post('/petition', (req, res) => {
    usersModule.setSig(req.body.sig, req.session.userId)
   .then((sigId) => {
        req.session.sigId = sigId;
        res.redirect('/signed');
    })  
})


app.get('/signed', usersModule.checkSigId, (req, res) => {
    usersModule.getAllSigners()
    .then((allSigners) => {
        usersModule.getSigImg(req.session.sigId)
        .then((sigImg) => {
            res.render('signed', {
                num: allSigners,
                img: sigImg
            })
        })   
    })
})

app.get('/signers', usersModule.checkSigId, (req, res) => {
    usersModule.getSignersInfo()
    .then((signersArray) => {
        res.render('signers', {
            signersInfo: signersArray
        })
    })
    .catch((err) => {
            console.log('/signers', err.stack);
    })
})

app.get('/user_city/:city', usersModule.checkSigId, (req, res) => {
    usersModule.getUsersByCity(req.params.city)
    .then((cityDataArray) => {
        res.render('user_city', {
            usersCity: cityDataArray,
            city: cityDataArray[0].profile_city
        })
    })
})

app.get('/edit_profile', usersModule.checkSigId, (req, res) => {
    usersModule.getProfileInfo(req.session.userId)
    .then((profileDataArray) => {
        console.log(profileDataArray)
        res.render('edit_profile', {
            profileInfo: profileDataArray
        })  
    })   
})

app.post('/edit_profile', (req,res) => {
    const {first, last, email, password, age, city, homepage} = req.body;
    if (req.body.password != '') {
        return Promise.all([
            usersModule.updateUsersTableWithPass(first, last, email, password, req.session.userId),
            usersModule.updateProfilesTable(age, city, homepage)
            ])
        .then(() => {
            res.redirect('/signed');
        })
        .catch((err) => {
            console.log('/update_profile_with_pass', err.stack);
        })
    } else {
        return Promise.all([
            usersModule.updateUsersTableWithoutPass(first, last, email, req.session.userId),
            usersModule.updateProfilesTable(age, city, homepage, req.session.userId)
            ])
        .then(() => {
            res.redirect('/signed');
        })
        .catch((err) => {
            console.log('/update_profile_without_pass', err.stack);
        })
    }
})

app.get('/logout', (req, res) => {
    usersModule.logOut(req.session.userId);
    res.redirect('/login');   
})

app.get('/delete-sig', (req, res) => {
    usersModule.deleteSignature(req.session.sigId)
    .then(() => {
        res.redirect('/petition');
    })
})


app.listen(process.env.PORT || 8080, () => console.log('i`m listening'))










// W w




