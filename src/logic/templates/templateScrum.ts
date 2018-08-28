import {Template, ITemplate} from "./core"

let scrumTemplate : ITemplate = {
    "Epic": [
            "New",
            "In Progress",
            "Done",
            "Removed"
        ],
    "Feature": [
            "New",
            "In Progress", 
            "Done",
            "Removed"
        ],
    "Product Backlog Item": [
            "New",
            "Approved",
            "Committed",
            "Done",
            "Removed"
        ],
    "Task": [
            "To Do",
            "In Progress",
            "Done",
            "Removed"
        ],
    "Bug": [
            "New",
            "Approved", 
            "Committed",
            "Done",
            "Removed"
        ],
    "Impediment": [
            "Open",
            "Closed"
        ],
    "Test Case": [
            "Design", 
            "Ready",
            "Closed"
        ]
};
    

export class ScrumTemplate extends Template {
    constructor(){
        super(scrumTemplate, "Scrum");
    } 
}