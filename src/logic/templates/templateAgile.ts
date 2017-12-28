import {Template, ITemplate} from "./core"

let agileTemplate : ITemplate = 
{
    // work item
    "Epic": 
        {
            // to state
            "New": {
                // from state | reason
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

export class AgileTemplate extends Template {
    constructor(){
        super("Agile", agileTemplate);
    } 
}