import {Template, ITemplate} from "./core"

let scrumTemplate : ITemplate =
    {
        "Epic": 
            {
                "New": {
                    "In Progress": "Moved to the backlog" ,
                    "Done": "Moved to the backlog",
                    "Removed": "Reconsidering the Epic"
                }, 
                "In Progress": {
                    "New": "Implementation started",
                    "Done": "Additional work found"
                }, 
                "Done": {
                    "New": "Work finished",
                    "In Progress": "Work finished"
                },
                "Removed": {
                    "New": "Removed from the backlog",
                    "In Progress": "Removed from the backlog" ,
                }
            },
        "Feature": 
            {
                "New": {
                    "In Progress": "Moved to the backlog" ,
                    "Done": "Moved to the backlog",
                    "Removed": "Reconsidering the feature"
                }, 
                "In Progress": {
                    "New": "Implementation started",
                    "Done": "Additional work found"
                }, 
                "Done": {
                    "New": "Work finished",
                    "In Progress": "Work finished"
                },
                "Removed": {
                    "New": "Removed from the backlog",
                    "In Progress": "Removed from the backlog" ,
                }
            },
        "Product Backlog Item": 
            {
                "New": {
                    "Approved": "Moved to the backlog" ,
                    "Committed": "Moved to the backlog",
                    "Done": "Moved to the backlog",
                    "Removed": "Reconsidering backlog item"
                }, 
                "Approved": {
                    "New": "Approved by the Product Owner",
                    "Committed": "Work stopped",
                    "Done": "Additional work found"
                },  
                "Committed": {
                    "New": "Commitment made by the team",
                    "Approved": "Commitment made by the team",
                    "Done": "Additional work found"
                },
                "Done": {
                    "New": "Work finished",
                    "Approved": "Work finished" ,
                    "Committed": "Work finished" ,
                },
                "Removed": {
                    "New": "Removed from the backlog",
                    "Approved": "Removed from the backlog" ,
                    "Committed": "Removed from the backlog" ,
                }
            },
        "Task": 
            {
                "To Do": {
                    "In Progress": "Work stopped" ,
                    "Done": "Additional work found",
                    "Removed": "Reconsidering the Task"
                }, 
                "In Progress": {
                    "To Do": "Work started",
                    "Done": "Additional work found"
                }, 
                "Done": {
                    "To Do": "Work finished",
                    "In Progress": "Work finished"
                },
                "Removed": {
                    "To Do": "Removed from the backlog",
                    "In Progress": "Removed from the backlog" ,
                }
            },
        "Bug": 
            {
                "New": {
                    "Approved": "Moved to the backlog" ,
                    "Committed": "Moved to the backlog",
                    "Done": "Moved to the backlog",
                    "Removed": "Reconsidering backlog item"
                }, 
                "Approved": {
                    "New": "Approved by the Product Owner",
                    "Committed": "Work stopped",
                    "Done": "Additional work found"
                },  
                "Committed": {
                    "New": "Commitment made by the team",
                    "Approved": "Commitment made by the team",
                    "Done": "Additional work found"
                },
                "Done": {
                    "New": "Work finished",
                    "Approved": "Work finished" ,
                    "Committed": "Work finished" ,
                },
                "Removed": {
                    "New": "Removed from the backlog",
                    "Approved": "Removed from the backlog" ,
                    "Committed": "Removed from the backlog" ,
                }
            },
        "Impediment": 
            {
                "Open": {
                    "Closed": "Impediment reopened"
                },
                "Closed": {
                    "Open": "Impediment removed"
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
    };
    

export class ScrumTemplate extends Template {
    constructor(){
        super("Scrum", scrumTemplate);
    } 
}