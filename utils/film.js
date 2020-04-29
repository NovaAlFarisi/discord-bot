const request = require('request');
const cheerio = require('cheerio');

let target = 'http://206.189.151.55/';
const getRecent = (target) =>{
    return new Promise((resolve, reject)=>{
        request.get(target, async (error, reseponse, body)=>{
           const $ = cheerio.load(body);
           const movieList = [];
           for (let i = 0; i < $('div[class=ml-item] > a').length; i++) {
                let title = $('div[class=ml-item] > a')[i].attribs.oldtitle;
                let downloadURL = await getDownloadURL($('div[class=ml-item] > a')[i].attribs.href)
                movieList.push({
                    title,
                    downloadURL
                });
           }
           console.log(movieList);
        })
    })
}
const getRandom = (target) =>{
    return new Promise((resolve, reject)=>{
        request.get(target, async (error, reseponse, body)=>{
           const $ = cheerio.load(body);
           let randomInt = Math.floor(Math.random() * $('div[class=ml-item] > a').length);
           const movieList = [];
                let downloadURL = await getDownloadURL($('div[class=ml-item] > a')[randomInt].attribs.href)
                movieList.push({
                    title:$('div[class=ml-item] > a')[randomInt].attribs.oldtitle,
                    thumbnail:$('div[class=ml-item] > a > .mli-thumb')[randomInt].attribs['data-original'],
                    downloadURL
                });
           resolve(movieList);
        })
    })
}
const searchMovie = (query) => {
    return new Promise((resolve, reject)=>{
        let searchQuery = `http://206.189.151.55/?s=${query}`;
        request.get(searchQuery, async (error, reseponse, body)=>{
            const $ = cheerio.load(body);
            const movieList = [];
                 let title = $('div[class=ml-item] > a')[0].attribs.oldtitle;
                 let thumbnail = $('div[class=ml-item] > a > .mli-thumb')[0].attribs['data-original'];
                 let downloadURL = await getDownloadURL($('div[class=ml-item] > a')[0].attribs.href)
                 movieList.push({
                     title,
                     thumbnail,
                     downloadURL:(Array.isArray(downloadURL)? downloadURL[0]:downloadURL)
                 });
            resolve(movieList);
         })
    })
}

const getDownloadURL = async (target) => {
    return new Promise(async (resolve, reject)=>{
        let bypassURL = target+'?watching';
        let downloadURL = 'http://206.189.151.55/embed/download21.php?id=';
        await request.get(bypassURL, async (error, response, body)=>{
            const $ = cheerio.load(body);
            if($('.movieplay > iframe').attr('src').includes('gdriveplayer')){
                console.log($('.movieplay > iframe').attr('src'))
                resolve($('.movieplay > iframe').attr('src'))
            }

            let movieId = $('.movieplay > iframe').attr('src').replace('/movie/?id=','')
            console.log(bypassURL)
            console.log(movieId)
            const getDownloadURL = downloadURL+movieId;
            let bypassedURL = []
            await parseURL(getDownloadURL).then(res=>{
                bypassedURL.push(res);
            })
            resolve(bypassedURL);
        });
    })
}

const parseURL = async (target) => {
    return new Promise(async (resolve, reject)=>{
        await request.get(target, (error, response, body)=>{
            const $ = cheerio.load(body);
            let url = [];
            for (let i = 0; i < $('a[id=btn-download]').length; i++) {
                let unparsedURL = $('a[id=btn-download]')[i].attribs.href;
                let parsedURL = unparsedURL.split('?s=')[1];
                url.push(parsedURL);
            }
            resolve(url);
        })
    })
}

// getDownloadURL('http://206.189.151.55/my-spy-2020/');

// const test = async () =>{
//     const search = await searchMovie('Ratu ilmu hitam');
//     console.log(search)
// }
// test()
// const test = async()=>{
//     console.log('ok')
//     const random = await getRandom(target);
//     console.log(random)
// }

// test();
module.exports = {
    getRecent, getRandom, searchMovie
}