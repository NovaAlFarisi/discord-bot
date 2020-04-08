const request = require('request');

const getMedia = (url, cb) => {
    let safeUrl = url.replace(/\/$/i, '');
    let splitUrl = safeUrl.split('/');
    var mediaCode = splitUrl[4];

    request.get(`https://www.instagram.com/p/${mediaCode}/?__a=1`, (error, response, body)=>{
        try {
            let data = JSON.parse(response.body);
            let mediaData = data.graphql.shortcode_media;
            let mediaComment = mediaData.edge_media_to_parent_comment;
            let mediaLike = mediaData.edge_media_preview_like.count;
            let caption = mediaData.edge_media_to_caption.edges[0].node.text;
            let commentsData = []
            mediaComment.edges.forEach(element => {
                commentsData.push({
                    username:element.node.owner.username,
                    user_img:element.node.owner.profile_pic_url,
                    text:element.node.text
                })
            });
            console.log(mediaData);
            var mediaResult = {
                'media': {
                    url: `https://www.instagram.com/p/${mediaData.shortcode}`,
                    owner:mediaData.owner.username,
                    owner_name: mediaData.owner.full_name,
                    owner_img: mediaData.owner.profile_pic_url,
                    thumbnail: mediaData.display_url,
                    caption:caption,
                    like_count: mediaLike,
                    accessibility_caption: mediaData.accessibility_caption
                },
                'count': commentsData.length,
                commentsData
            };
            return cb(mediaResult);
        } catch (error) {
            return cb();
        }
    })
}

const getUser = (target, cb) => {
    var user = target.replace('@','');
    request.get(`https://www.instagram.com/${user}/?__a=1`, (error, response, body)=>{
        try {
            let data = JSON.parse(response.body);
            let userData = data.graphql.user;
            let userFeed = data.graphql.user.edge_owner_to_timeline_media.edges;
            let feeds = [];
            userFeed.forEach(feedData=>{
                var feed = feedData.node;
                feeds.push({
                    thumbnail_src: feed.thumbnail_src,
                    caption: feed.edge_media_to_caption.edges[0].node.text,
                    likes: feed.edge_liked_by.count,
                    accessibility_caption: feed.accessibility_caption
                })
            })
            var uData = {
                full_name: userData.full_name,
                followers: userData.edge_followed_by.count,
                following: userData.edge_follow.count,
                biography: userData.biography,
                is_private: userData.is_private,
                profile_pic_url: userData.profile_pic_url,
                feeds
            }
            console.log(uData)
            return cb(uData);
        } catch (error) {
            return cb();
        }
    })
}

module.exports = {
    getMedia, getUser
}