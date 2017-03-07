function getStateFlow(template, type){
    var template = stateFlow[template];
    if(!template) {
        console.log('WARN: No template "' + type + '" found');
        return null;
    }

    var states = template[type];
    if(!states) {
        console.log('WARN: No type "' + type + '" found for template "' + template + '"');
        return null;
    }

    return states;
}

function getNextState(template, type, state){
    var states = getStateFlow(template, type);

    var index = states.indexOf(state);
    return (index >= 0 && index + 1 < states.length ) 
        ? states[index + 1]
        : null;
}

function getPrevState(template, type, state){
    var states = getStateFlow(template, type);

    var index = states.indexOf(state);
    return (index - 1 >= 0 ) 
        ? states[index - 1]
        : null;
}

function getReasonForStateForType(template, type, fromState, toState){
    return  stateToReason[template]&&
            stateToReason[template][type] && 
            stateToReason[template][type][toState]&&
            stateToReason[template][type][toState][fromState];
}

function getCommonStatuses(template, itemTypes){
    var templateStates = stateToReason[template];
    var statesForType = templateStates[itemTypes[0]];
    var states = [];

    // init statuses array using first item type
    for(var state in statesForType)
    {
        states.push(state);
    }

    // remove uncommon statuses
    for(var i=1; i<itemTypes.length; ++i){
        statesForType = templateStates[itemTypes[i]];

        for(var j=0; j<states.length; ++j){
            if(!statesForType[states[j]]){
                states.splice(j--,1);
            }
        }
    }

    return states;
}

function getProjectTemplate(actionContext, action){
    if( !actionContext.tfsContext || 
        !actionContext.tfsContext.contextData ||
        !actionContext.tfsContext.contextData.project) return;

    VSS.require(["VSS/Service", "TFS/Core/RestClient"], function(VSS_Service, TFS_Wit_WebApi){
        var client = TFS_Wit_WebApi.getClient();
        client.getProject(actionContext.tfsContext.contextData.project.id, true).then(
            function(project){
                var templateName = project.capabilities.processTemplate.templateName;
                console.log(templateName);
                
                action(templateName);
            });
    });
}

function changeStatus(selectedItems, forward, toState){
    var template = "Agile";
    VSS.require(["VSS/Service", "TFS/WorkItemTracking/RestClient"], function (VSS_Service, TFS_Wit_WebApi) {
        var witClient = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkItemTrackingHttpClient);

        witClient.getWorkItems(selectedItems, ["System.State", "System.Reason", "System.WorkItemType"]).then(
            function(workItems) {
                console.log("GET: " + JSON.stringify(workItems));

                for(var i=0; i<workItems.length; ++i){
                    var item = workItems[i];

                    var id = item.id;
                    var revision = item.rev;
                    var type = item.fields["System.WorkItemType"];
                    var state = item.fields["System.State"];
                    var reason = item.fields["System.Reason"];
                    console.log( "ID: " + id + ", Type: " + type + ", State: " + state + ", Revision: " + revision);
                    
                    var newState = toState || (forward ? getNextState(template, type, state) : getPrevState(template, type, state));
                    if(!newState) {
                        console.log("Cannot change status for this item.");
                        continue;
                    }

                    var newReason = getReasonForStateForType(template, type, state, newState);
                    if(!newReason) {
                        console.log("Cannot change reason for this item.");
                        continue;
                    }
                    
                    console.log( "New state: " + newState + ", New reason: " + newReason);

                    var update = [
                        {
                            "op": "test",
                            "path": "/rev",
                            "value": revision
                        },
                        {
                            "op": "add",
                            "path": "/fields/System.State",
                            "value": newState
                        },
                        {
                            "op": "add",
                            "path": "/fields/System.Reason",
                            "value": newReason
                        }
                        ];

                    witClient.updateWorkItem(update, id).then(
                        function(workItem) {
                            console.log('UPDATED: ' + workItem.id);
                        });
                }

                // VSS.getService(VSS.ServiceIds.Navigation).then(function(navigationService) {
                //     navigationService.reload();
                // });
            });                
    });
}