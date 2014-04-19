define("FBNewsData", ["facebook", "common/utils", "common/koExtentions", "knockout", "FBPost"], function (FB, utils, koExtentions, ko, FBPost) {
    "use strict";

    var FBNewsData = function () {
        this.all = {};
        this.tabs = {
            important: ko.observableArray(),
            photos: ko.observableArray(),
            fun: ko.observableArray(),
            informative: ko.observableArray(),
            doings: ko.observableArray()
        };
    };

    var FBNewsDataPrototype = (function () {
        return {
            mergePosts: function (response) {
                var self = this;

                var fbPosts = utils.map(response.data, function (fbNativePost) { return new FBPost(fbNativePost); });
                var existingPostCount = 0, newPostCount = 0;
                utils.forEach(fbPosts, function (fbPost) {
                    if (!self.all[fbPost.id]) {
                        self.all[fbPost.id] = fbPost;
                        newPostCount++;

                        self.tabs[fbPost.tabCategory.name]().push(fbPost);
                    }
                    else {
                        existingPostCount++;
                    }
                });

                if (newPostCount > 0) {
                    utils.forEach(self.tabs, function (koArray) { koArray.valueHasMutated(); });
                    utils.log(["New posts", newPostCount], 10, "info");
                }
            }
        };
    })();

    FBNewsDataPrototype.constructor = FBNewsData;
    FBNewsData.prototype = FBNewsDataPrototype;

    return FBNewsData;
});