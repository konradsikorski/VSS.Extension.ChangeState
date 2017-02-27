var statesForType = {
    "Epic": ["New", "Active", "Resolved", "Closed"],
    "Feature": ["New", "Active", "Resolved", "Closed"],
    "User Story": ["New", "Active", "Resolved", "Closed"],
    "Task": ["New", "Active", "Closed"],
    "Bug": ["New", "Active", "Resolved", "Closed"],
    "Issue": ["Active", "Closed"],
    "Test Case": ["Design", "Ready", "Closed"]
};

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

function getReasonForState(type, fromState, toState){
    switch(type){
        case "Epic": return getReasonForStateForEpic(fromState, toState);
        case "Feature": return getReasonForStateForFeature(fromState, toState);
        case "User Story": return getReasonForStateForUserStory(fromState, toState);
        case "Task": return getReasonForStateForTask(fromState, toState);
        case "Bug": return getReasonForStateForBug(fromState, toState);
        case "Issue": return getReasonForStateForIssue(fromState, toState);
        case "Test Case": return getReasonForStateForTestCase(fromState, toState);
    }
}

function getReasonForStateForUserStory(fromState, toState){
    switch (toState){
        case "New": 
            switch(fromState){
                case "Removed": return "Reconsidering the User Story";
                default: return "Moved to the backlog";
            }
        case "Active": 
            switch(fromState){
                case "Resolved": return "Acceptance tests fail";
                case "Closed": return "Reintroduced in Scope"
                default: return "Implementation started";
            }
        case "Resolved": 
            switch(fromState){
                case "Closed": return "Closed in error";
                default: return "Code complete and unit tests pass";
            }
        case "Removed": return "Removed from the backlog";
        case "Closed": return "Acceptance tests pass";
    }
}

function getReasonForStateForEpic(fromState, toState){
    switch (toState){
        case "New": 
            switch(fromState){
                case "Removed": return "Reconsidering the Epic";
                default: return "Moved to the backlog";
            }
        case "Active": 
            switch(fromState){
                case "Resolved": return "Acceptance tests fail";
                case "Closed": return "Reintroduced in Scope"
                default: return "Implementation started";
            }
        case "Resolved": 
            switch(fromState){
                case "Closed": return "Closed in error";
                default: return "Features complete";
            }
        case "Removed": return "Removed from the backlog";
        case "Closed": return "Acceptance tests pass";
    }
}

function getReasonForStateForFeature(fromState, toState){
    switch (toState){
        case "New": 
            switch(fromState){
                case "Removed": return "Reconsidering the Feature";
                default: return "Moved to the backlog";
            }
        case "Active": 
            switch(fromState){
                case "Resolved": return "Acceptance tests fail";
                case "Closed": return "Reintroduced in Scope"
                default: return "Implementation started";
            }
        case "Resolved": 
            switch(fromState){
                case "Closed": return "Closed in error";
                default: return "Stories complete";
            }
        case "Removed": return "Removed from the backlog";
        case "Closed": return "Acceptance tests pass";
    }
}

function getReasonForStateForTask(fromState, toState){
    switch (toState){
        case "New": 
            switch(fromState){
                case "Active": return "Work halted";
                case "Closed": return "Reactivated";
                case "Removed": return "Reconsidering the Task";
            }
        case "Active": 
            switch(fromState){
                case "Closed": return "Reactivated"
                default: return "Work started";
            }
        case "Removed": return "Removed from the backlog";
        case "Closed": return "Completed";
    }
}

function getReasonForStateForBug(fromState, toState){
    switch (toState){
        case "New": 
            switch(fromState){
                case "Active": return "Investigation Complete";
                case "Resolved": 
                case "Closed": return "Not fixed";
            }
        case "Active": 
            switch(fromState){
                case "Resolved": return "Not fixed";
                case "Closed": return "Regression"
                default: return "Approved";
            }
        case "Resolved": 
            switch(fromState){
                case "Closed": return "Resolved in error";
                default: return "Fixed";
            }
        case "Removed": return "Removed from the backlog";
        case "Closed":  
            switch(fromState){
                case "Resolved": return "Verified";
                default: return "Fixed and verified";
            }
    }
}

function getReasonForStateForIssue(fromState, toState){
    switch (toState){
        case "Active": return "Reactivated";
        case "Closed": return "Issue Resolved";
    }
}

function getReasonForStateForTestCase(fromState, toState){
    switch (toState){
        case "Design": switch(fromState){
                case "Closed": return "Reactivated";
                case "Ready": return "Update Test Case";
            }
        case "Ready": switch(fromState){
                case "Closed": return "Reactivated";
                default: return "Completed";
            }
        case "Closed": return "Obsolete";
    }
}

function changeStatus(selectedItems, forward){
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
                    
                    var newState = forward ? getNextState(type, state) : getPrevState(type, state);
                    if(!newState) {
                        console.log("Cannot change status for this item.");
                        continue;
                    }
                    var newReason = getReasonForState(type, state, newState);
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
            });                
    });
}