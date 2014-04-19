define("FBPost", ["common/utils"], function (utils) {
    "use strict";

    var isNewsLink = function (urlInfo) {
            return !!(urlInfo && urlInfo.hostname.indexOf("news") >= 0);
        },
        isFunnyLink = function (urlInfo) {
            return !!(urlInfo &&
                        (
                            urlInfo.hostname.indexOf("fun") >= 0 ||
                            urlInfo.hostname.indexOf("youtube") >= 0
                        ));
        };

    var getUrlInfo = function (url) {
        if (url) {
            var urlInfo = utils.parseUrl(url);
            urlInfo.isFacebookUrl = urlInfo.hostname.indexOf("facebook.com") > -1;
            urlInfo.isNewsLink = isNewsLink(urlInfo);
            urlInfo.isFunnyLink = isFunnyLink(urlInfo);
            return urlInfo;
        }
    };

    var FBPost = function (fbNativePost) {
        this.nativeData = fbNativePost;
        this.message = fbNativePost.message || fbNativePost.story;
        this.from = fbNativePost.from || { name: "(no name)" };
        this.isFromPage = !!(fbNativePost.from && fbNativePost.from.category);
        this.to = fbNativePost.to || { name: "(no to name)" };
        this.createdOn = fbNativePost.created_time;
        this.updatedOn = fbNativePost.updated_time;
        this.displayDate = utils.parseDate(fbNativePost.created_time).fromNow();
        this.link = {
            caption: fbNativePost.caption,
            description: fbNativePost.caption,
            url: fbNativePost.link,
            name: fbNativePost.name,
            preview: fbNativePost.picture,
            urlInfo: getUrlInfo(fbNativePost.link)
        };
        this.icon = fbNativePost.icon;
        this.attachment = {
            objectId: fbNativePost.object_id,
            properties: fbNativePost.properties,
            url: fbNativePost.source,
            urlInfo: getUrlInfo(fbNativePost.source),
            type: fbNativePost.type
        };
        this.locationPage = fbNativePost.place;
        this.shareCount = fbNativePost.shares && fbNativePost.shares.count;
        this.statusType = fbNativePost.status_type;
        this.story = fbNativePost.story;
        this.tags = {
            to: fbNativePost.to,
            alongWith: fbNativePost.with_tags,
            message: fbNativePost.message_tags
        };
        this.id = fbNativePost.id;
        if (!this.id) {
            throw new Error("post does not have id!");
        }

        this.tabCategory = this.getTabCategory();
    };

    var tabCategories = {
        important: { name: "important", display: "1stThing1st" },
        photos: { name: "photos", display: "Photos" },
        fun: { name: "fun", display: "Fun" },
        informative: { name: "informative", display: "Informative" },
        doings: { name: "doings", display: "Doings" },
        others: { name: "others", display: "Others" }
    };

    FBPost.tabCategories = tabCategories;

    var fbPostPrototype = (function () {
        return {
            getTabCategory: function () {
                if (!this.statusType) {
                    return tabCategories.doings;
                }

                var urlInfo = this.link.urlInfo;
                if (this.isFromPage) {
                    return urlInfo && urlInfo.isFunnyLink ?
                        tabCategories.fun : tabCategories.informative;
                }
                else if (urlInfo) {
                    if (urlInfo.isFacebookUrl) {
                        return tabCategories.photos;
                    }
                    else {
                        return urlInfo.isFunnyLink ? tabCategories.fun : tabCategories.informative;
                    }
                }
                else {
                    return tabCategories.important;
                }
            }
        };
    })();

    fbPostPrototype.constructor = FBPost;
    FBPost.prototype = fbPostPrototype;

    return FBPost;
});