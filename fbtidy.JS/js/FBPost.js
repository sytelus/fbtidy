define("FBPost", ["common/utils"], function (utils) {
    "use strict";

    var FBPost = function (fbNativePost) {
        utils.extend(this, fbNativePost);   //Set prototype
    };

    var fbPostPrototype = (function () {
        return {
            displayMessage: function () {
                return this.message || this.type;
            }
        };
    })();
    fbPostPrototype.constructor = FBPost;
    FBPost.prototype = fbPostPrototype;

    return FBPost;
});