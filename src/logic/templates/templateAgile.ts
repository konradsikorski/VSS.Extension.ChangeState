import {Template, ITemplate} from "./core"

let agileTemplate : ITemplate = 
{
    // work item
    "Epic": 
        {
            // from state
            "New": {
                // to state | reason
                "Active": "Implementation started" ,
                "Resolved": "Features complete",
                "Closed": "Acceptance tests pass",
                "Removed": "Removed from the backlog"
            }, 
            "Active": {
                "New": "Moved to the backlog",
                "Resolved": "Features complete",
                "Closed": "Acceptance tests pass",
                "Removed": "Removed from the backlog",
            },  
            "Resolved": {
                "New": "Moved to the backlog",
                "Active": "Acceptance tests fail" ,
                "Closed": "Acceptance tests pass",
                "Removed": "Removed from the backlog",
            }, 
            "Closed": {
                "New": "Moved to the backlog",
                "Active": "Reintroduced in Scope",
                "Resolved": "Closed in error",
            },
            "Removed": {
                "New": "Reconsidering the Epic",
            }
        },
    "Feature": 
        {
            "New": {
                "Active": "Implementation started" ,
                "Resolved": "Stories complete",
                "Closed": "Acceptance tests pass",
                "Removed": "Removed from the backlog"
            }, 
            "Active": {
                "New": "Moved to the backlog",
                "Resolved": "Stories complete",
                "Closed": "Acceptance tests pass",
                "Removed": "Removed from the backlog",
            },  
            "Resolved": {
                "New": "Moved to the backlog",
                "Active": "Acceptance tests fail",
                "Closed": "Acceptance tests pass",
                "Removed": "Removed from the backlog",
            }, 
            "Closed": {
                "New": "Moved to the backlog",
                "Active": "Reintroduced in Scope" ,
                "Resolved": "Closed in error",
            },
            "Removed": {
                "New": "Reconsidering the Feature",
            }
        },
    "User Story": 
        {
            "New": {
                "Active": "Implementation started",
                "Resolved": "Code complete and unit tests pass",
                "Closed": "Acceptance tests pass",
                "Removed": "Removed from the backlog"
            }, 
            "Active": {
                "New": "Moved to the backlog",
                "Resolved": "Code complete and unit tests pass",
                "Closed": "Acceptance tests pass",
                "Removed": "Removed from the backlog",
            },  
            "Resolved": {
                "New": "Moved to the backlog",
                "Active": "Acceptance tests fail" ,
                "Closed": "Acceptance tests pass",
                "Removed": "Removed from the backlog",
            }, 
            "Closed": {
                "New": "Moved to the backlog",
                "Active": "Reintroduced in Scope" ,
                "Resolved": "Closed in error",
            },
            "Removed": {
                "New": "Reconsidering the User Story",
            }
        },
    "Task": 
        {
            "New": {
                "Active": "Work started",
                "Closed": "Completed",
                "Removed": "Removed from the backlog"
            }, 
            "Active": {
                "New": "Work halted",
                "Closed": "Completed",
                "Removed": "Removed from the backlog",
            }, 
            "Closed": {
                "New": "Reactivated",
                "Active": "Reactivated",
                "Removed": "Removed from the backlog"
            },
            "Removed": {
                "New": "Reconsidering the Task",
            }
        },
    "Bug": 
        {
            "New": {
                "Active": "Approved" ,
                "Resolved": "Fixed",
                "Closed": "Fixed and verified"
            }, 
            "Active": {
                "New": "Investigation Complete",
                "Resolved": "Fixed",
                "Closed": "Fixed and verified"
            },  
            "Resolved": {
                "New": "Not fixed",
                "Active": "Not fixed",
                "Closed": "Verified"
            }, 
            "Closed": {
                "New": "Not fixed",
                "Active": "Regression",
                "Resolved": "Resolved in error",
            }
        },
    "Issue": 
        {
            "Active": {
                "Closed": "Issue Resolved"
            },
            "Closed": {
                "Active": "Reactivated"
            }
        },
    "Test Case": 
        {
            "Design": {
                "Ready": "Completed",
                "Closed": "Obsolete"
            }, 
            "Ready": {
                "Design": "Update Test Case",
                "Closed": "Obsolete"
            },
            "Closed": {
                "Design": "Reactivated",
                "Ready": "Reactivated"
            }
        }
}

export class AgileTemplate extends Template {
    constructor(){
        super("Agile", agileTemplate);
    } 
}