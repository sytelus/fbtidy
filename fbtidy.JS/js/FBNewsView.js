define("FBNewsView", ["common/utils", "knockout", "FBNewsData", "FBNewsFetcher", "text!templates/fbNewsView.html"], function (utils, ko, FBNewsData, FBNewsFetcher, fbNewsTemplate) {
    "use strict";

    var compiledTemplate;   //cache template

    var FBNewsView = function (element) {
        var self = this;

        self.hostElement = element;
        self.isLoaded = false;
    };

    var FBNewsViewPrototype = (function () {
        return {
            load: function(forceLoad) {
                var self = this;

                if (self.isBeingLoaded || (self.isLoaded && !forceLoad))
                    return;

                self.isBeingLoaded = true;

                var fbNewsData = new FBNewsData();
                var fbNewsFetcher = new FBNewsFetcher(fbNewsData);
                var viewModel = { fbNewsData: fbNewsData, fbNewsFetcher: fbNewsFetcher };

                compiledTemplate = compiledTemplate || utils.compileTemplate(fbNewsTemplate);
                var templateHtml = utils.runTemplate(compiledTemplate, self.templateData);

                self.hostElement.html(templateHtml);
                var fbNewsViewMainElement = self.hostElement.find(".fbNewsViewMain").first()[0];
                ko.applyBindings(viewModel, fbNewsViewMainElement);

                self.viewModel = viewModel;
                self.refresh();

                self.isLoaded = true;
                self.isBeingLoaded = undefined;
            },
            unload: function(forceUnload) {
                var self = this;

                if (!self.isLoaded && !forceUnload)
                    return;

                self.hostElement.html("");
                self.viewModel = undefined;
                self.isLoaded = false;
            },
            refresh: function () {
                var self = this;
                self.viewModel.fbNewsFetcher.fetchNext();
            }
        };
    })();


    FBNewsViewPrototype.constructor = FBNewsView;
    FBNewsView.prototype = FBNewsViewPrototype;

    return FBNewsView;
});