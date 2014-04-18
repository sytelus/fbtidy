define("FBNewsData", ["facebook", "common/utils", "common/koExtentions", "knockout", "FBPost"], function (FB, utils, koExtentions, ko, FBPost) {
    "use strict";

    var expireCacheAfter = 3600;

    var FBNewsData = function () {
        this.posts = ko.observableArray();
        this.error = ko.observable();
        this.progress = ko.observable();
    };

    var FBNewsDataPrototype = (function () {
        return {
            load: function (force) {
                var self = this;

                if (utils.isDeferredPending(self.deferred)) {
                    return self.deferred.promise();
                }

                var isCacheExpired = force || (!self.fetchedOn || (utils.millisecondsSince(self.fetchedOn) / 1000 > expireCacheAfter));
                if (!isCacheExpired) {
                    return self.deferred.promise();
                }

                self.progress("Getting data from Facebook...");
                self.deferred = utils.createDeferred();
                FB.api("/me/home", function (response) {
                    self.progress(undefined);

                    if (response && !response.error) {
                        var fbPosts = utils.map(response.data, function (fbNativePost) { return new FBPost(fbNativePost); });
                        koExtentions.repopulateObservableArray(self.posts, fbPosts);

                        self.error(undefined);
                        self.fetchedOn = utils.now();
                        self.deferred.resolve(response);
                    }
                    else {
                        self.error(response);
                        self.deferred.reject(response);
                    }
                });

                return self.deferred.promise();
            }
        };
    })();

    FBNewsDataPrototype.constructor = FBNewsData;
    FBNewsData.prototype = FBNewsDataPrototype;

    return FBNewsData;
});