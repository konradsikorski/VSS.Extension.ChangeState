VSS.init({ usePlatformScripts: true, usePlatformStyles: true });

var changeStatusForwardHandler = (function () {
    "use strict";
    return {
        execute: function (actionContext) {
            var ids = actionContext.ids || actionContext.workItemIds
            changeStatus(ids, true);
        }
    };
}());

VSS.register("ChangeStatusForward", changeStatusForwardHandler);