import {Template, ITemplate} from "./core"

let agileTemplate : ITemplate = {
    // work item
    "Epic": [ // states
            "New",
            "Active",
            "Resolved",
            "Closed",
            "Removed"
        ],
    "Feature": [
            "New",
            "Active", 
            "Resolved", 
            "Closed",
            "Removed"
        ],
    "User Story": [
            "New", 
            "Active", 
            "Resolved",
            "Closed",
            "Removed"
        ],
    "Task": [
            "New",
            "Active",
            "Closed",
            "Removed"
        ],
    "Bug": [
            "New",
            "Active", 
            "Resolved",
            "Closed"
        ],
    "Issue": [
            "Active",
            "Closed"
        ],
    "Test Case": [
            "Design",
            "Ready",
            "Closed"
        ]
}

export class AgileTemplate extends Template {
    constructor(){
        super("Agile", agileTemplate);
    } 
}