VSS.init({ usePlatformScripts: true, usePlatformStyles: true });

var changeStateMenuHandler = (function () {
    "use strict";
    return {
        getMenuItems: function (actionContext) {
            //getProjectTemplate(actionContext);

            var ids = actionContext.ids || actionContext.workItemIds;
            var subMenus = 
                    [
                        {
                            text: "Step",
                            childItems: [
                                {
                                    text: "Forward",
                                    "icon": "static/images/changeStatusForward.png",
                                    action: function(actionContext){
                                        changeStatus(ids, true);
                                    }
                                },
                                {
                                    text: "Backward",
                                    "icon": "static/images/changeStatusBackward.png",
                                    action: function(actionContext){
                                        changeStatus(ids, false);
                                    }
                                }
                            ]
                            
                        }
                    ];
            
            var selectedItemsTypes = actionContext.workItemTypeNames;
            var commonStatuses = getCommonStatuses(selectedItemsTypes);
            
            for(var i = 0; i < commonStatuses.length; ++i){
                var state = commonStatuses[i];

                subMenus.push({
                    text: state,
                    icon: "static/images/status" + state + ".png",
                    action: function(actionContext){
                        changeStatus(ids, undefined, this.text);
                    }
                });
            }

            return [
                {
                    text: "Change state",
                    "groupId": "modify",
                    "icon": "static/images/changeStatusAction.png",
                    childItems: subMenus
                }
            ];
        }
    };
}());

VSS.register("changeStateMenu", changeStateMenuHandler);