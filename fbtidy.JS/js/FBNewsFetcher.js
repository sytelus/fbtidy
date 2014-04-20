define("FBNewsFetcher", ["facebook", "common/utils", "jquery", "FBNewsData", "knockout"], function (FB, utils, $, FBNewsData, ko) {
    "use strict";

    var FBNewsFetcher = function (fbNewsData) {
        this.reset();
        this.fbNewsData = fbNewsData;
    };

    var FBNewsFetcherPrototype = (function () {
        var fetchDataFBSdk = function () {
                var deferred = utils.createDeferred();

                FB.api("/me/home", function (response) {
                    if (response && !response.error) {
                        deferred.resolve(response);
                    }
                    else {
                        deferred.reject(response);
                    }
                });

                return deferred.promise();
            },
            fetchDataAjax = function (pageDataUrl) {
                var deferred = utils.createDeferred();
                $.getJSON(pageDataUrl)
                .done(function (response) {
                    if (response && !response.error) {
                        deferred.resolve(response);
                    }
                    else {
                        deferred.reject(response);
                    }
                })
                .fail(function (response) {
                    deferred.reject(response);
                });

                return deferred.promise();
            };

        return {
            reset: function() {
                this.error = ko.observable();
                this.isInProgress = ko.observable(false);
                this.hasMoreResults = ko.observable(true);
                this.nextPageCursor = undefined;
                this.deferredPromise = undefined;
            },
            fetchNext: function (thisArg) { //ko passes parameter for button click
                var self = this || thisArg;

                if (utils.isDeferredPending(self.deferredPromise)) {
                    return self.deferredPromise;
                }

                self.isInProgress(true);
                utils.log("Getting data from Facebook...", 5, "info");

                self.deferredPromise = self.nextPageCursor ? 
                    fetchDataAjax(self.nextPageCursor) :
                    fetchDataFBSdk();

                self.deferredPromise
                .done(function (response) {
                    self.error(undefined);

                    var newPostCount = self.fbNewsData.mergePosts(response);

                    utils.log(["Recieved posts", response.data.length, "new posts", newPostCount], 5, "success");

                    self.nextPageCursor = (response.paging && response.paging.next) || null;
                    self.hasMoreResults(self.nextPageCursor !== null);
                })
                .fail(function (response) {
                    utils.log(["Failed to get posts", response.error.message], 0, "error");
                    self.error(response);
                })
                .always(function () {
                    self.isInProgress(false);
                });

                return self.deferredPromise;
            }
        };
    })();

    FBNewsFetcherPrototype.constructor = FBNewsFetcher;
    FBNewsFetcher.prototype = FBNewsFetcherPrototype;

    return FBNewsFetcher;
});