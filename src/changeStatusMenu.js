VSS.init({ usePlatformScripts: true, usePlatformStyles: true, explicitNotifyLoaded: true });

var projectTemplate;

VSS.getService(VSS.ServiceIds.ExtensionData).then(function(dataService) {
    var context = VSS.getWebContext();
    var projectId = context.project.id;
    var valueKey = "pt_"+projectId;

    dataService.getValue(valueKey, {scopeType: "Default"}).then(function(value) {
        console.log("User preference value is " + value);
        projectTemplate = value;

        if(!projectTemplate){
            getProjectTemplate(projectId, function(templateName){
                projectTemplate = templateName;
                VSS.notifyLoadSucceeded();
                dataService.setValue(valueKey, templateName, {scopeType: "Default"});
            });
        }
        else{
            VSS.notifyLoadSucceeded();
        }
    });
});

function selectProjectTemplate(templateName){
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function(dataService) {
        var context = VSS.getWebContext();
        var projectId = context.project.id;
        var valueKey = "pt_"+projectId;

        dataService.setValue(valueKey, templateName, {scopeType: "Default"});
        projectTemplate = templateName;
    });
}

function buildSelectProjectTemplateMenu(){
    return [{
                text: "What is your project template?",
                childItems: [
                    {
                        text: "Agile",
                        action: function(actionContext){
                            selectProjectTemplate("Agile");
                        }
                    },
                    {
                        text: "Scrum",
                        action: function(actionContext){
                            selectProjectTemplate("Scrum");
                        }
                    }
                ]
            }];
}

function buldStatesMenu(actionContext, template){
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
    var commonStatuses = getCommonStatuses(template, selectedItemsTypes);
    
    for(var i = 0; i < commonStatuses.length; ++i){
        var state = commonStatuses[i];

        subMenus.push({
            text: state,
            icon: "static/images/status" + state.replace(' ', '') + ".png",
            action: function(actionContext){
                changeStatus(ids, undefined, this.text);
            }
        });
    }

    return subMenus;
}

var changeStateMenuHandler = (function () {
    "use strict";
    return {
        getMenuItems: function (actionContext) {
            var subMenus = (!projectTemplate) 
                ? buildSelectProjectTemplateMenu() 
                : buldStatesMenu(actionContext, projectTemplate);

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