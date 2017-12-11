namespace MyExtension.ChangeState {
    class Template {
        name: string;
        stateFlow: IDictionaryStringTo<Array<string>>;
        stateToReason: IDictionaryStringTo<IDictionaryStringTo<IDictionaryStringTo<string>>>;
    }

    export class TemplatesDesctiptor {
static stateFlow = {
    "Agile": {
        "Epic": ["New", "Active", "Resolved", "Closed"],
        "Feature": ["New", "Active", "Resolved", "Closed"],
        "User Story": ["New", "Active", "Resolved", "Closed"],
        "Task": ["New", "Active", "Closed"],
        "Bug": ["New", "Active", "Resolved", "Closed"],
        "Issue": ["Active", "Closed"],
        "Test Case": ["Design", "Ready", "Closed"]
    },
    "Scrum": {
        "Epic": ["New", "In Progress", "Done"],
        "Feature": ["New", "In Progress", "Done"],
        "Product Backlog Item": ["New", "Approved", "Committed", "Done"],
        "Task": ["To Do", "In Progress", "Done"],
        "Bug": ["New", "Approved", "Committed", "Done"],
        "Impediment": ["Open", "Closed"],
        "Test Case": ["Design", "Ready", "Closed"]
    }
};

static stateToReason = {
    // template
    "Agile":{
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
    },
    "Scrum": {
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
    }
}
    }
}