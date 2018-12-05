const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            res.json({
                message: 'POST Created',
                authData
            })
        }
    })    
})

app.post('/api/login', (req,res) => {
    //MOCK USER
    const user = {
        id: 1,
        username: 'ADITYA',
        email: 'aditya@gmail.com'
    }
    jwt.sign({user: user}, 'secretkey', {expiresIn: '30s'}, (err, token) => {
        res.json({
            token: token
        })
    });
})

//Format of token
//  Authorization: Bearer <access_token>

//Verify TOken
function verifyToken (req, res, next) {
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    //  Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        //  Split at the space
        const bearer = bearerHeader.split(' ')
        //  Get token from array
        const bearerToken = bearer[1];
        //  Set the token
        req.token = bearerToken;
        //  Next step proceed
        next();
    } else {
        //  Forbidden
        res.sendStatus(403);
    }
}

app.listen (5000, () => console.log('Server started at 5000 port'));