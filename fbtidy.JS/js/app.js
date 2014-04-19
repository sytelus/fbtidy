define("app", ["domReady", "bootstrap", "common/utils", "common/statusBox", "common/globalEvents",
    "FBInit", "FBNewsView"],

    function (domReady, $, utils, statusBox, globalEvents, FBInit, FBNewsView) {
    "use strict";

    var fbNewsView;

    domReady(function () {
        utils.log(["Loaded on: ", new Date()]);

        var fbInit = new FBInit("241567999362524");
        
        fbInit.done(function () {
            fbNewsView = new FBNewsView($("#news").first()[0]);
            fbNewsView.refresh();
        });

        globalEvents(utils);

        $("#footer .statusBox").statusBox();
    });
});
