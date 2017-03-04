var statesForType = {
    "Epic": ["New", "Active", "Resolved", "Closed"],
    "Feature": ["New", "Active", "Resolved", "Closed"],
    "User Story": ["New", "Active", "Resolved", "Closed"],
    "Task": ["New", "Active", "Closed"],
    "Bug": ["New", "Active", "Resolved", "Closed"],
    "Issue": ["Active", "Closed"],
    "Test Case": ["Design", "Ready", "Closed"]
};

var stateToReason = {
    "Epic": 
        {
            "New": {
                "Active": "Moved to the backlog" ,
                "Resolved": "Moved to the backlog",
                "Closed": "Moved to the backlog",
                "Removed": "Reconsidering the Epic"
            }, 
            "Active": {
                "New": "Implementation started",
                "Resolved": "Acceptance tests fail",
                "Closed": "Reintroduced in Scope"
            },  
            "Resolved": {
                "New": "Features complete",
                "Active": "Features complete" ,
                "Closed": "Closed in error"
            }, 
            "Closed": {
                "New": "Acceptance tests pass",
                "Active": "Acceptance tests pass" ,
                "Resolved": "Acceptance tests pass"
            },
            "Removed": {
                "New": "Removed from the backlog",
                "Active": "Removed from the backlog" ,
                "Resolved": "Removed from the backlog",
                "Closed": "Removed from the backlog"
            }
        },
    "Feature": 
        {
            "New": {
                "Active": "Moved to the backlog" ,
                "Resolved": "Moved to the backlog",
                "Closed": "Moved to the backlog",
                "Removed": "Reconsidering the Feature"
            }, 
            "Active": {
                "New": "Implementation started",
                "Resolved": "Acceptance tests fail",
                "Closed": "Reintroduced in Scope"
            },  
            "Resolved": {
                "New": "Stories complete",
                "Active": "Stories complete" ,
                "Closed": "Closed in error"
            }, 
            "Closed": {
                "New": "Acceptance tests pass",
                "Active": "Acceptance tests pass" ,
                "Resolved": "Acceptance tests pass",
            },
            "Removed": {
                "New": "Removed from the backlog",
                "Active": "Removed from the backlog" ,
                "Resolved": "Removed from the backlog",
                "Closed": "Removed from the backlog"
            }
        },
    "User Story": 
        {
            "New": {
                "Active": "Moved to the backlog" ,
                "Resolved": "Moved to the backlog",
                "Closed": "Moved to the backlog",
                "Removed": "Reconsidering the User Story"
            }, 
            "Active": {
                "New": "Implementation started",
                "Resolved": "Acceptance tests fail",
                "Closed": "Reintroduced in Scope"
            },  
            "Resolved": {
                "New": "Code complete and unit tests pass",
                "Active": "Code complete and unit tests pass" ,
                "Closed": "Closed in error"
            }, 
            "Closed": {
                "New": "Acceptance tests pass",
                "Active": "Acceptance tests pass" ,
                "Resolved": "Acceptance tests pass",
            },
            "Removed": {
                "New": "Removed from the backlog",
                "Active": "Removed from the backlog" ,
                "Resolved": "Removed from the backlog",
                "Closed": "Removed from the backlog"
            }
        },
    "Task": 
        {
            "New": {
                "Active": "Work halted" ,
                "Closed": "Reactivated",
                "Removed": "Reconsidering the Task"
            }, 
            "Active": {
                "New": "Work started",
                "Closed": "Reactivated"
            }, 
            "Closed": {
                "New": "Completed",
                "Active": "Completed"
            },
            "Removed": {
                "New": "Removed from the backlog",
                "Active": "Removed from the backlog" ,
                "Closed": "Removed from the backlog"
            }
        },
    "Bug": 
        {
            "New": {
                "Active": "Investigation Complete" ,
                "Resolved": "Not fixed",
                "Closed": "Not fixed"
            }, 
            "Active": {
                "New": "Approved",
                "Resolved": "Not fixed",
                "Closed": "Regression"
            },  
            "Resolved": {
                "New": "Fixed",
                "Active": "Fixed" ,
                "Closed": "Resolved in error"
            }, 
            "Closed": {
                "New": "Fixed and verified",
                "Active": "Fixed and verified" ,
                "Resolved": "Verified",
            }
        },
    "Issue": 
        {
            "Active": {
                "Closed": "Reactivated"
            },
            "Closed": {
                "Active": "Issue Resolved"
            }
        },
    "Test Case": 
        {
            "Design": {
                "Ready": "Update Test Case",
                "Closed": "Reactivated"
            }, 
            "Ready": {
                "Design": "Completed",
                "Closed": "Reactivated"
            },
            "Closed": {
                "Design": "Obsolete",
                "Ready": "Obsolete"
            }
        }
}

function getNextState(type, state){
    var states = statesForType[type];

    var index = states.indexOf(state);
    return (index >= 0 && index + 1 < states.length ) 
        ? states[index + 1]
        : null;
}

function getPrevState(type, state){
    var states = statesForType[type];

    var index = states.indexOf(state);
    return (index - 1 >= 0 ) 
        ? states[index - 1]
        : null;
}

function getReasonForStateForType(type, fromState, toState){
    return  stateToReason[type] && 
            stateToReason[type][toState]&&
            stateToReason[type][toState][fromState];
}

function getCommonStatuses(itemTypes){
    var statesForType = stateToReason[itemTypes[0]];
    var states = [];

    // init statuses array using first item type
    for(var state in statesForType)
    {
        states.push(state);
    }

    // remove uncommon statuses
    for(var i=1; i<itemTypes.length; ++i){
        statesForType = stateToReason[itemTypes[i]];

        for(var j=0; j<states.length; ++j){
            if(!statesForType[states[j]]){
                states.splice(j--,1);
            }
        }
    }

    return states;
}

function getProjectTemplate(actionContext){
    if( !actionContext.tfsContext || 
        !actionContext.tfsContext.contextData ||
        !actionContext.tfsContext.contextData.project) return;

    VSS.require(["VSS/Service", "TFS/Core/RestClient"], function(VSS_Service, TFS_Wit_WebApi){
        var client = TFS_Wit_WebApi.getClient();
        client.getProject(actionContext.tfsContext.contextData.project.id, true).then(
            function(project){
                console.log(project.capabilities.processTemplate.templateName);
            });

        projectTemplate = "asd";
    });
}

function changeStatus(selectedItems, forward, toState){
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
                    
                    var newState = toState || (forward ? getNextState(type, state) : getPrevState(type, state));
                    if(!newState) {
                        console.log("Cannot change status for this item.");
                        continue;
                    }
                    var newReason = getReasonForStateForType(type, state, newState);
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