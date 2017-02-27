VSS.init({ usePlatformScripts: true, usePlatformStyles: true });

var changeStatusBackwardHandler = (function () {
    "use strict";
    return {
        execute: function (actionContext) {
            var ids = actionContext.ids || actionContext.workItemIds
            changeStatus(ids, false);
        }
    };
}());

VSS.register("ChangeStatusBackward", changeStatusBackwardHandler);