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
                this.progress = ko.observable();
                this.nextPageCursor = undefined;
                this.deferredPromise = undefined;
            },
            fetchNext: function () {
                var self = this;

                if (utils.isDeferredPending(self.deferredPromise)) {
                    return self.deferredPromise;
                }

                self.progress("Getting data from Facebook...");
                utils.log("Getting data from Facebook...", 5, "info");

                self.deferredPromise = self.nextPageCursor ? 
                    fetchDataAjax(self.nextPageCursor) :
                    fetchDataFBSdk();

                self.deferredPromise
                .done(function (response) {
                    utils.log(["Recieved posts", response.length], 5, "success");
                    self.error(undefined);

                    self.fbNewsData.mergePosts(response);

                    self.nextPageCursor = response.paging && response.paging.next;
                })
                .fail(function (response) {
                    utils.log(["Failed to get posts", response.error.message], 0, "error");
                    self.error(response);
                })
                .always(function () {
                    self.progress(undefined);
                });

                return self.deferredPromise;
            }
        };
    })();

    FBNewsFetcherPrototype.constructor = FBNewsFetcher;
    FBNewsFetcher.prototype = FBNewsFetcherPrototype;

    return FBNewsFetcher;
});