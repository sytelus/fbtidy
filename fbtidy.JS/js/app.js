define("app", ["domReady", "bootstrap", "common/utils", "common/statusBox", "common/globalEvents"],
    function (domReady, $, utils, statusBox, globalEvents) {
    "use strict";


    domReady(function () {
        utils.log(["Loaded on: ", new Date()]);

        globalEvents(utils);

        //Setup app specific template helpers
        templateHelpers.registerAll(utils);

        $("#footer .statusBox").statusBox();
    });
});
