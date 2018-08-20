import {Template, ITemplate} from "./core"

let scrumTemplate : ITemplate =
    {
        "Epic": 
            {
                "New": [
                    "In Progress" ,
                    "Done",
                    "Removed"
                ], 
                "In Progress": [
                    "New",
                    "Done",
                    "Removed"
                ], 
                "Done": [
                    "New",
                    "In Progress"
                ],
                "Removed": [
                    "New",
                ]
            },
        "Feature": 
            {
                "New": [
                    "In Progress",
                    "Done",
                    "Removed"
                ], 
                "In Progress": [
                    "New",
                    "Done",
                    "In Progress",
                ], 
                "Done": [
                    "New",
                    "In Progress"
                ],
                "Removed": [
                    "New",
                ]
            },
        "Product Backlog Item": 
            {
                "New": [
                    "Approved" ,
                    "Committed",
                    "Done",
                    "Removed"
                ], 
                "Approved": [
                    "New",
                    "Committed",
                    "Done",
                    "Removed",
                ],  
                "Committed": [
                    "New",
                    "Approved",
                    "Done",
                    "Removed",
                ],
                "Done": [
                    "New",
                    "Approved" ,
                    "Committed" ,
                ],
                "Removed": [
                    "New",
                ]
            },
        "Task": 
            {
                "To Do": [
                    "In Progress",
                    "Done",
                    "Removed"
                ], 
                "In Progress": [
                    "To Do",
                    "Done",
                    "Removed",
                ], 
                "Done": [
                    "To Do",
                    "In Progress"
                ],
                "Removed": [
                    "To Do",
                ]
            },
        "Bug": 
            {
                "New": [
                    "Approved" ,
                    "Committed",
                    "Done",
                    "Removed"
                ], 
                "Approved": [
                    "New",
                    "Committed",
                    "Done",
                    "Removed",
                ],  
                "Committed": [
                    "New",
                    "Approved",
                    "Done",
                    "Removed",
                ],
                "Done": [
                    "New",
                    "Approved" ,
                    "Committed" ,
                ],
                "Removed": [
                    "New",
                ]
            },
        "Impediment": 
            {
                "Open": [
                    "Closed"
                ],
                "Closed": [
                    "Open"
                ]
            },
        "Test Case": 
            {
                "Design": [
                    "Ready",
                    "Closed"
                ], 
                "Ready": [
                    "Design",
                    "Closed"
                ],
                "Closed": [
                    "Design",
                    "Ready"
                ]
            }
    };
    

export class ScrumTemplate extends Template {
    constructor(){
        super("Scrum", scrumTemplate);
    } 
}