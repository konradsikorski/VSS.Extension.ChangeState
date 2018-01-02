import {Template} from './templates/core'
import TFS_Wit_Client = require("TFS/WorkItemTracking/RestClient"); 

export class WorkItem {
    type: string;
    status: string;
}

export class StateLogic {
    public static getStatusWitType(workItemsId: number[]) : IPromise<WorkItem[]>{

        let witClient = TFS_Wit_Client.getClient();
        
        return witClient.getWorkItems(workItemsId, ["System.State", "System.WorkItemType"])
            .then( (workItems) => {
                let statuses = new Array<WorkItem>();

                for(let i=0; i<workItems.length; ++i) {
                    let item = workItems[i];
                    statuses.push({
                        status: item.fields["System.State"],
                        type: item.fields["System.WorkItemType"]
                    });
                }

                return statuses;
            });
    }

    public static getCommonStatuses(states: Array<string[]>): string[]{
        if(!states || states.length == 0) return new Array<string>();

        let commonStates = states[0];

        // remove uncommon statuses
        for(let i = 1; i < states.length; ++i)
        {
            for(let j=0; j<commonStates.length; ++j){
                if(states[i].indexOf(commonStates[j]) < 0){
                    commonStates.splice(j--,1);
                }
            }
        };

        return commonStates;
    }

    public static changeStatus(selectedItems: Array<number>, template: Template, toState: string): void{
        let witClient = TFS_Wit_Client.getClient();
        witClient.getWorkItems(selectedItems, ["System.State", "System.Reason", "System.WorkItemType"])
            .then( (workItems) => {
                console.log("GET: " + JSON.stringify(workItems));

                for(let i=0; i<workItems.length; ++i){
                    let item = workItems[i];

                    let id = item.id;
                    let revision = item.rev;
                    let type = item.fields["System.WorkItemType"];
                    let state = item.fields["System.State"];
                    let reason = item.fields["System.Reason"];
                    console.log( `ID: ${id}, Type: ${type}, State: ${state}, Revision: ${revision}`);
                    
                    let newState = toState;
                    if(!newState) {
                        console.log(`Cannot change status for this item. Template: ${template}`);
                        continue;
                    }

                    let newReason = template.getReasonForStateForType(type, state, newState);
                    if(!newReason) {
                        console.log(`Cannot change reason for this item. Template: ${template}`);
                        continue;
                    }
                    
                    console.log( `Template: ${template.name}, New state: ${newState}, New reason: ${newReason}`);

                    let update = [
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
                        
                    witClient.updateWorkItem(update, id).then( (workItem) => {
                        console.log('Work item UPDATED: ' + workItem.id);
                    });
                }

                // VSS.getService(VSS.ServiceIds.Navigation).then(function(navigationService) {
                //     navigationService.reload();
                // });
            });                
    }
}