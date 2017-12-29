import {Template, ITemplate} from "./core"

let scrumTemplate : ITemplate =
    {
        "Epic": 
            {
                "New": {
                    "In Progress": "Implementation started" ,
                    "Done": "Work finished",
                    "Removed": "Removed from the backlog"
                }, 
                "In Progress": {
                    "New": "Moved to the backlog",
                    "Done": "Work finished",
                    "Removed": "Removed from the backlog"
                }, 
                "Done": {
                    "New": "Moved to the backlog",
                    "In Progress": "Additional work found"
                },
                "Removed": {
                    "New": "Reconsidering the epic",
                }
            },
        "Feature": 
            {
                "New": {
                    "In Progress": "Implementation started",
                    "Done": "Work finished",
                    "Removed": "Removed from the backlog"
                }, 
                "In Progress": {
                    "New": "Moved to the backlog",
                    "Done": "Work finished",
                    "In Progress": "Removed from the backlog",
                }, 
                "Done": {
                    "New": "Moved to the backlog",
                    "In Progress": "Additional work found"
                },
                "Removed": {
                    "New": "Reconsidering the feature",
                }
            },
        "Product Backlog Item": 
            {
                "New": {
                    "Approved": "Approved by the Product Owner" ,
                    "Committed": "Commitment made by the team",
                    "Done": "Work finished",
                    "Removed": "Removed from the backlog"
                }, 
                "Approved": {
                    "New": "Moved to the backlog",
                    "Committed": "Commitment made by the team",
                    "Done": "Work finished",
                    "Removed": "Removed from the backlog",
                },  
                "Committed": {
                    "New": "Moved to the backlog",
                    "Approved": "Work stopped",
                    "Done": "Work finished",
                    "Removed": "Removed from the backlog",
                },
                "Done": {
                    "New": "Moved to the backlog",
                    "Approved": "Additional work found" ,
                    "Committed": "Additional work found" ,
                },
                "Removed": {
                    "New": "Reconsidering backlog item",
                }
            },
        "Task": 
            {
                "To Do": {
                    "In Progress": "Work started" ,
                    "Done": "Work finished",
                    "Removed": "Removed from the backlog"
                }, 
                "In Progress": {
                    "To Do": "Work stopped",
                    "Done": "Work finished",
                    "Removed": "Removed from the backlog",
                }, 
                "Done": {
                    "To Do": "Additional work found",
                    "In Progress": "Additional work found"
                },
                "Removed": {
                    "To Do": "Reconsidering the Task",
                }
            },
        "Bug": 
            {
                "New": {
                    "Approved": "Approved by the Product Owner" ,
                    "Committed": "Commitment made by the team",
                    "Done": "Work finished",
                    "Removed": "Removed from the backlog"
                }, 
                "Approved": {
                    "New": "Moved to the backlog",
                    "Committed": "Commitment made by the team",
                    "Done": "Work finished",
                    "Removed": "Removed from the backlog",
                },  
                "Committed": {
                    "New": "Moved to the backlog",
                    "Approved": "Work stopped",
                    "Done": "Work finished",
                    "Removed": "Removed from the backlog",
                },
                "Done": {
                    "New": "Moved to the backlog",
                    "Approved": "Additional work found" ,
                    "Committed": "Additional work found" ,
                },
                "Removed": {
                    "New": "Reconsidering backlog item",
                }
            },
        "Impediment": 
            {
                "Open": {
                    "Closed": "Impediment removed"
                },
                "Closed": {
                    "Open": "Impediment reopened"
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
    };
    

export class ScrumTemplate extends Template {
    constructor(){
        super("Scrum", scrumTemplate);
    } 
}