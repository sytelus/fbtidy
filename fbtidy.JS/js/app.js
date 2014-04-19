define("app", ["domReady", "bootstrap", "common/utils", "common/statusBox", "common/globalEvents",
    "FBInit", "FBNewsView"],

    function (domReady, $, utils, statusBox, globalEvents, FBInit, FBNewsView) {
    "use strict";

    var fbNewsView;

    domReady(function () {
        utils.log(["Loaded on: ", new Date()]);

        var authorizeModal = $("#authorizeModal");
        var fbInit = new FBInit("241567999362524", function () {
            authorizeModal.modal("hide");
            fbNewsView = new FBNewsView($("#news").first()[0]);
            fbNewsView.refresh();
        }, function () {
            authorizeModal.modal({ backdrop: "static" }).modal("show");
        });
        

        globalEvents(utils);

        $("#footer .statusBox").statusBox();
    });
});
