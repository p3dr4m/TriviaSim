const qriusity = require('./controllers/qriusity');
const usersjs = require('./models/users');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const request = require('request');
const _ = require('lodash');
<<<<<<< HEAD

=======
const tmdb = require('./controllers/tmdb');
const qriusity = require('./controllers/qriusity');
const bodyParser = require('body-parser');
const user = require('./controllers/user')
>>>>>>> refs/remotes/origin/master
let app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

hbs.registerHelper('dummy', () => {
    return undefined;
});

app.get('/', (request, response) => {
    response.render('index.hbs');
});

app.post('/username', (request, response) => {
    var user_name = request.body.user_name;

    if (user_name !== '') {
        response.send(user_name)
    }
    else {
        response.send('gfdgf')
    }
});

<<<<<<< HEAD
app.post('/storeuser', (request, response) => {
    let o = request.body;



});
=======
>>>>>>> refs/remotes/origin/master

app.get('/leaderboard', (request, response) => {
    // for (var i =0; i<userScoreInfo)

    response.render('leaderboard.hbs', {
        list_of_user_data: user.getUsers(user.sortScores("scoreData"))
    })
    //     name : user_name,
    //     score : user_score,
    //     streak : user_streak

    // })
});

app.post('/getquestions', (request, response) => {
    qriusity.getQuestionByCategory(17, 0).then((result) => {
        response.send(result);
    });
});

app.get('/about', (request, response) => {
    response.render('about.hbs');
});

app.listen(8080, () => {
    console.log(`Server is up on port 8080`);
});