const request = require('request');

const corona = () => {
    request.get('https://api.kawalcorona.com/indonesia/', (error, response, body)=>{
        let coronaData = JSON.parse(body)[0];
        console.log(coronaData)
    })
}
module.exports = {
    corona
}