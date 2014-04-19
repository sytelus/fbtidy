define("FBNewsView", ["common/utils", "knockout", "FBNewsData", "FBNewsFetcher"], function (utils, ko, FBNewsData, FBNewsFetcher) {
    "use strict";

    var FBNewsView = function (element) {
        var self = this;

        self.hostElement = element;
        self.newsData = new FBNewsData();
        self.fbNewsFetcher = new FBNewsFetcher(self.newsData);

        ko.applyBindings(self.newsData, self.hostElement);
    };

    var FBNewsViewPrototype = (function () {
        return {
            refresh: function () {
                var self = this;
                self.fbNewsFetcher.fetchNext();
            }
        };
    })();


    FBNewsViewPrototype.constructor = FBNewsView;
    FBNewsView.prototype = FBNewsViewPrototype;

    return FBNewsView;
});