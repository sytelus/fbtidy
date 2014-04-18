define("FBNewsView", ["common/utils", "knockout", "FBNewsData"], function (utils, ko, FBNewsData) {
    "use strict";

    var FBNewsView = function (element) {
        var self = this;

        self.hostElement = element;
        self.newsData = new FBNewsData();

        ko.applyBindings(self.newsData, self.hostElement);
    };

    var FBNewsViewPrototype = (function () {
        return {
            refresh: function (force) {
                var self = this;
                self.newsData.load(force);
            }
        };
    })();


    FBNewsViewPrototype.constructor = FBNewsView;
    FBNewsView.prototype = FBNewsViewPrototype;

    return FBNewsView;
});