VSS.init({ usePlatformScripts: true, usePlatformStyles: true });

var changeStateMenuHandler = (function () {
    "use strict";
    return {
        getMenuItems: function (actionContext) {
            var selectedItemsTypes = actionContext.workItemTypeNames;
            var commonStatuses = getCommonStatuses(selectedItemsTypes);

            return [
                {
                    text: "Change state",
                    "groupId": "modify",
                    "icon": "static/images/changeStatusAction.png",
                    childItems:[
                        {
                            text: "Forward",
                            "icon": "static/images/changeStatusForward.png",
                            action: function(actionContext){
                                var ids = actionContext.ids || actionContext.workItemIds
                                changeStatus(ids, true);
                            }
                        },
                        {
                            text: "Backward",
                            "icon": "static/images/changeStatusBackward.png",
                            action: function(actionContext){
                                var ids = actionContext.ids || actionContext.workItemIds
                                changeStatus(ids, false);
                            }
                        }
                    ]
                }
            ];
        }
    };
}());

VSS.register("changeStateMenu", changeStateMenuHandler);