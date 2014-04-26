define("FBNewsFetcher", ["facebook", "common/utils", "jquery", "FBNewsData", "knockout"], function (FB, utils, $, FBNewsData, ko) {
    "use strict";

    var FBNewsFetcher = function (fbNewsData) {
        this.reset();
        this.fbNewsData = fbNewsData;
    };

    var FBNewsFetcherPrototype = (function () {
        var fetchDataFBSdk = function (untilUnixTimestamp) {
            var deferred = utils.createDeferred();

            FB.api("/me/home", { limit: 100, until: untilUnixTimestamp }, function (response) {
                    if (response && !response.error) {
                        deferred.resolve(response);
                    }
                    else {
                        deferred.reject(response);
                    }
                });

                return deferred.promise();
            };
            /*
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
            },
            getUrlQueryParams = function (url) {
                var params = utils.getUrlQueryParams(url);
                var sinceUnix = utils.fromUnixTimestamp(params.since);
                params.sinceDate = utils.formateDate(sinceUnix);
                var untilUnix = utils.fromUnixTimestamp(params.until);
                params.untilDate = utils.formateDate(untilUnix);

                return params;
            };
            */

        return {
            reset: function () {
                var self = this;

                self.error = ko.observable();
                self.isInProgress = ko.observable(false);
                self.hasMoreResults = ko.observable(true);
                self.previousPageUrl = ko.observable(undefined);
                self.nextPageUrl = ko.observable(undefined);
                self.minPostDateUnix = ko.observable(undefined);
                self.maxPostDateUnix = ko.observable(undefined);
                self.deferredPromise = undefined;

                self.maxPostDate = ko.computed(function () { return utils.fromUnixTimestamp(self.maxPostDateUnix()).format(); });
                self.minPostDate = ko.computed(function () { return utils.fromUnixTimestamp(self.minPostDateUnix()).format(); });
            },
            fetchNext: function (thisArg) { //ko passes parameter for button click
                var self = this || thisArg;

                if (utils.isDeferredPending(self.deferredPromise)) {
                    return self.deferredPromise;
                }

                self.isInProgress(true);
                utils.log("Getting data from Facebook...", 5, "info");

                self.deferredPromise = fetchDataFBSdk(self.minPostDateUnix() || utils.now().unix());

                self.deferredPromise
                .done(function (response) {
                    self.error(undefined);

                    var newPostCount = self.fbNewsData.mergePosts(response);
                    utils.log(["Recieved posts", response.data.length, "new posts", newPostCount], 5, "success");

                    self.minPostDateUnix(utils.safeApply(utils.min(self.fbNewsData.all, "createdOnUnixTimestamp"),
                        "createdOnUnixTimestamp"));
                    self.maxPostDateUnix(utils.safeApply(utils.max(self.fbNewsData.all, "createdOnUnixTimestamp"),
                        "createdOnUnixTimestamp"));

                    self.previousPageUrl((response.paging && response.paging.previous) || null);
                    self.nextPageUrl((response.paging && response.paging.next) || null);
                    self.hasMoreResults(true);
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