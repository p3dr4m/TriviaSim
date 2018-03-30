const request = require('request');

var getQuestionByCategory = (categoryID, page = 0, limit = 10) => {

    if (page <= 0) {
        var page = String(Math.floor((Math.random()*50) + 1));
    }
    
    return new Promise((resolve, reject) => {
        request({
            url: 'https://qriusity.com/v1/categories/' + encodeURIComponent(categoryID.toString()) + '/questions?page=' + encodeURIComponent(page.toString()) + '&limit=' + encodeURIComponent(limit.toString()),
            json: true
        }, (error, response, body) => {
            if(error) {
                reject('Cannot connect to TMDB.');
            }
            else if(body.code == 400) {
                reject('Invalid query.');
            }
            else {
                resolve(body);   
            }
        });
    });
};

module.exports = {
    getQuestionByCategory
};