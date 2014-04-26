define("FBNewsData", ["facebook", "common/utils", "common/koExtentions", "knockout", "FBPost"], function (FB, utils, koExtentions, ko, FBPost) {
    "use strict";

    var FBNewsData = function () {
        this.all = {};
        this.filtered = ko.observableArray();
        this.filterName = ko.observable("important");
    };

    var FBNewsDataPrototype = (function () {
        return {
            mergePosts: function (response) {
                var self = this;

                var fbPosts = utils.map(response.data, function (fbNativePost) { return new FBPost(fbNativePost); });
                var existingPostCount = 0, newPostCount = 0;
                utils.forEach(fbPosts, function (fbPost) {
                    if (!self.all[fbPost.dupHash]) {
                        self.all[fbPost.dupHash] = fbPost;
                        newPostCount++;
                    }
                    else {
                        existingPostCount++;
                    }
                });

                utils.log(["New posts", newPostCount], 10, "info");

                self.setFilter(self.filterName());

                return newPostCount;
            },
            setFilter: function (filterName, ignoreIfAlreadySet) {
                var self = this;

                if (ignoreIfAlreadySet && self.filterName() === filterName) {
                    return;
                }

                self.filtered().length = 0;
                utils.forEach(self.all, function (fbPost) {
                    if (fbPost.tabCategory.name === filterName) {
                        self.filtered().push(fbPost);
                    }
                });

                self.filtered.valueHasMutated();

                self.filterName(filterName);
            }
        };
    })();

    FBNewsDataPrototype.constructor = FBNewsData;
    FBNewsData.prototype = FBNewsDataPrototype;

    return FBNewsData;
});