const Discord = require("discord.js");
const client = new Discord.Client();
const {
    getMedia,
    getUser
} = require("./utils/instagram");
const {
    corona
} = require("./utils/corona");
const {
    searchMovie,
    getRandom
} = require('./utils/film');

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(
        "Type -help || \n author @nova_alfarisi || MUKE LO JEMBUT"
    );
});

client.on("message", async msg => {

    if (msg.content.startsWith("-film")) {
        var query = msg.content.replace("-film ", '');
        console.log(query)
        msg.reply(`ok tunggu sebentar boss, gua cariin ${query} dulu sabar \n tapi kalau gua ga jawab berarti ga ada / salah keyword ye jangan bawel \n atau bisa juga lemot soalnya ni server kek kontol gratisan`);
        let rfilm = await searchMovie(query);
        console.log(rfilm);
        let url = []
        url.push({
            name:'URL',
            value:rfilm[0].downloadURL
        });
        const resultEmbed = await new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle(rfilm[0].title)
            .addFields(url)
            .setImage(rfilm[0].thumbnail)
            .setTimestamp()
            .setFooter("Nova Al Farisi - Sang Dewa");
        msg.reply(resultEmbed);
    }
    if (msg.content === "-rfilm") {
        msg.reply('ok tunggu sebentar boss, gua cariin dulu film buat lo nih');
        let rfilm = await getRandom();
        console.log(rfilm[0].title)
        console.log(rfilm[0].downloadURL)
        let url = [];
        rfilm[0].downloadURL[0].forEach(e => {
            url.push({
                name: 'URL',
                value: e
            })
        })
        const resultEmbed = await new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle(rfilm[0].title)
            .addFields(url)
            .setImage(rfilm[0].thumbnail)
            .setTimestamp()
            .setFooter("Nova Al Farisi - Sang Dewa");
        msg.reply(resultEmbed);
    }
    if (msg.content === "-zaki") {
        for (let i = 0; i < 3; i++) {
            msg.reply("Zaki zaki, yes!");
        }
    }
    if (msg.content === "-muklis") {
        for (let i = 0; i < 3; i++) {
            msg.reply("Muklis muklis, yes!");
        }
    }
    if (msg.content === "-help") {
        const embed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Daftar Perintah")
            .addFields({
                name: "-help",
                value: "Untuk melihat daftar perintah",
                inline: true
            }, {
                name: "-author",
                value: "Untuk melihat tentang developer",
                inline: true
            }, {
                name: "-ig <media_url>",
                value: "Untuk melihat media instagram",
                inline: true
            }, {
                name: "-ig <username>",
                value: "Untuk melihat user instagram",
                inline: false
            }, {
                name: "-corona",
                value: "Untuk melihat info corona terbaru",
                inline: true
            })
            .setTimestamp();
        msg.reply(embed);
    }
    if (msg.content === "-author") {
        const exampleEmbed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("@Nova_Alfarisi")
            .setURL("https://www.instagram.com/nova_alfarisi")
            .setImage(
                "https://scontent-cgk1-1.cdninstagram.com/v/t51.2885-19/s320x320/72785470_2372296936420609_2692844241465376768_n.jpg?_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_ohc=PYM0aFsldKcAX9jfyff&oh=5a6701a5f10ebc8d5f3f3b2c61663274&oe=5EB7F61A"
            )
            .setTimestamp()
            .setFooter(
                "Nova Al Farisi",
                "https://scontent-cgk1-1.cdninstagram.com/v/t51.2885-19/s320x320/72785470_2372296936420609_2692844241465376768_n.jpg?_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_ohc=PYM0aFsldKcAX9jfyff&oh=5a6701a5f10ebc8d5f3f3b2c61663274&oe=5EB7F61A"
            );
        msg.reply(exampleEmbed);
    }

    if (msg.content === "-corona") {
        await corona(response => {
            const resultEmbed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Info Terbaru Corona Di Indonesia")
                .setThumbnail(
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR1m7Nbr3oOjYUmqOTsJhIYlZ3TOnx9klptA8m7qhURfTjWKp6x&usqp=CAU"
                )
                .addFields({
                    name: "Positif",
                    value: response.positif
                }, {
                    name: "Sembuh",
                    value: response.sembuh
                }, {
                    name: "Meninggal",
                    value: response.meninggal
                })
                .setTimestamp()
                .setFooter("Nova Al Farisi - Source: kawalcorona.id");
            msg.reply(resultEmbed);
        });
    }

    if (msg.content.startsWith("-ig")) {
        var target = msg.content.split(" ")[1];
        if (target.includes("/p/")) {
            await getMedia(target, response => {
                if (response) {
                    let comment = [];
                    response.commentsData.forEach(comData => {
                        comment.push({
                            name: `@${comData.username}`,
                            value: comData.text
                        });
                    });
                    const embedResult = new Discord.MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle(response.media.owner_name)
                        .setDescription(response.media.caption)
                        .setThumbnail(response.media.thumbnail)
                        .addFields({
                            name: `Comments`,
                            value: response.count,
                            inline: true
                        }, {
                            name: `Likes`,
                            value: response.media.like_count,
                            inline: true
                        }, {
                            name: `Accessibility Caption:`,
                            value: response.media.accessibility_caption
                        })
                        .addFields(comment)
                        .setImage(response.media.thumbnail)
                        .setTimestamp();
                    msg.reply(embedResult);
                } else {
                    msg.reply("Salah penggunaan: -ig YOUR_MEDIA_URL_HERE");
                }
            });
        } else {
            await getUser(target, response => {
                if (response) {
                    const embedResult = new Discord.MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle(response.full_name)
                        .setDescription(response.biography)
                        .setThumbnail(response.profile_pic_url)
                        .addFields({
                            name: `Followers`,
                            value: response.followers,
                            inline: true
                        }, {
                            name: `Following`,
                            value: response.following,
                            inline: true
                        })
                        .addField(
                            "Latest Post",
                            `Likes: ${response.feeds[0].likes} \n Caption: [${response.feeds[0].caption}] \n \n Accessibility Caption:[${response.feeds[0].accessibility_caption}]`
                        )
                        .setImage(response.feeds[0].thumbnail_src);
                    console.log(response.feeds.length);
                    // .addFields(comment)
                    // .setImage(response.media.thumbnail)
                    // .setTimestamp()
                    msg.reply(embedResult);
                } else {
                    msg.reply("Username nya ga bener atau ga salah kali");
                }
            });
        }
    }
});

client.login("NTk2MTg2ODQ4OTY4MzEwODAx.XpUtYQ.1GVQXJYOTA5YUVGvEASN8ROnOmE");