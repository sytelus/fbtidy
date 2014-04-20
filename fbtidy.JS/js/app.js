define("app", ["domReady", "bootstrap", "common/utils", "common/statusBox", "common/globalEvents",
    "FBInit", "FBNewsView"],

    function (domReady, $, utils, statusBox, globalEvents, FBInit, FBNewsView) {
    "use strict";

    var fbNewsView;

    domReady(function () {
        utils.log(["Loaded on: ", new Date()]);

        fbNewsView = new FBNewsView($("#main .fbNewsView").first());

        var authorizeModal = $("#authorizeModal");
        var fbInit = new FBInit("241567999362524", function () {
            fbNewsView.load();
            authorizeModal.modal("hide");
        }, function () {
            fbNewsView.unload();
            authorizeModal.modal({ backdrop: "static" }).modal("show");
        });

        globalEvents(utils);

        $("#footer .statusBox").statusBox();

        if (location.hash) {
            $(window).hashchange();
        }
    });
});
