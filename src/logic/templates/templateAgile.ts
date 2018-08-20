import {Template, ITemplate} from "./core"

let agileTemplate : ITemplate = 
{
    // work item
    "Epic": 
        {
            // from state
            "New": [
                // to state
                "Active",
                "Resolved",
                "Closed",
                "Removed"
            ], 
            "Active": [
                "New",
                "Resolved",
                "Closed",
                "Removed"
            ],  
            "Resolved": [
                "New",
                "Active",
                "Closed",
                "Removed"
            ], 
            "Closed": [
                "New",
                "Active",
                "Resolved",
            ],
            "Removed": [
                "New"
            ]
        },
    "Feature": 
        {
            "New": [
                "Active",
                "Resolved",
                "Closed",
                "Removed"
            ], 
            "Active": [
                "New",
                "Resolved",
                "Closed",
                "Removed",
            ],  
            "Resolved": [
                "New",
                "Active",
                "Closed",
                "Removed",
            ], 
            "Closed": [
                "New",
                "Active" ,
                "Resolved",
            ],
            "Removed": [
                "New",
            ]
        },
    "User Story": 
        {
            "New": [
                "Active",
                "Resolved",
                "Closed",
                "Removed"
            ], 
            "Active": [
                "New",
                "Resolved",
                "Closed",
                "Removed",
            ],  
            "Resolved": [
                "New",
                "Active" ,
                "Closed",
                "Removed",
            ], 
            "Closed": [
                "New",
                "Active" ,
                "Resolved",
            ],
            "Removed": [
                "New",
            ]
        },
    "Task": 
        {
            "New": [
                "Active",
                "Closed",
                "Removed"
            ], 
            "Active": [
                "New",
                "Closed",
                "Removed",
            ], 
            "Closed": [
                "New",
                "Active",
                "Removed"
            ],
            "Removed": [
                "New",
            ]
        },
    "Bug": 
        {
            "New": [
                "Active",
                "Resolved",
                "Closed"
            ], 
            "Active": [
                "New",
                "Resolved",
                "Closed"
            ],  
            "Resolved": [
                "New",
                "Active",
                "Closed"
            ], 
            "Closed": [
                "New",
                "Active",
                "Resolved",
            ]
        },
    "Issue": 
        {
            "Active": [
                "Closed"
            ],
            "Closed": [
                "Active"
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
}

export class AgileTemplate extends Template {
    constructor(){
        super("Agile", agileTemplate);
    } 
}