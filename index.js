const express = require('express')
const app = express()
const uuid = require('uuid/v4')
const session = require('express-session')
const bodyParser = require('body-parser');
var path = require('path');

var parseForm = bodyParser.urlencoded({ extended: false })
const PORT = process.env.PORT || 3000;

app.use(session({
    sessId: (req) => {
        return uuid
    },
    name: 'SESS_ID',
    secret: '^#$5sX(Hf6KUo!#65^',
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
    if (req.session.csrfToken === undefined) {
        req.session.csrfToken = uuid()
    }
    console.log("req.session.csrfToken :" + req.session.csrfToken);
    next();

})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/validate', parseForm, function (req, res) {
    console.log(req)
    var token = req.session.csrfToken;
    console.log('validate().token : ' + token);
    res.json({ csrfToken: token });

})

app.post('/login', parseForm, function (req, res, next) {

    if (req.session.csrfToken !== req.body._csrf) {
        console.log('Invalid CSRF Token!');
        let err = new Error('Invalid CSRF Token!')
        err.status = 403

        return next(err)
    }
    console.log(req)
    res.sendFile(path.join(__dirname, 'home.html'));
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})