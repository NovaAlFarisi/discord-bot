const request = require('request');

const corona = (cb) => {
    try {
        request.get('https://api.kawalcorona.com/indonesia/', (error, response, body)=>{
            let coronaData = JSON.parse(body)[0];
            return cb(coronaData);
        })
    } catch (error) {
        return cb();
    }
}
module.exports = {
    corona
}