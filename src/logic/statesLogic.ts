import {Template} from './templates/core'
import TFS_Wit_Client = require("TFS/WorkItemTracking/RestClient"); 

export class StateLogic {

    public static getCommonStatuses(template: Template, workItemTypes: string[]): Array<string>{
        if(!workItemTypes || workItemTypes.length == 0) return null;

        let states = template.getStatusesForWorkItem(workItemTypes[0]);

        // remove uncommon statuses
        for(let i = 1; i < workItemTypes.length; ++i)
        {
            let statesForType = template.getStatusesForWorkItem(workItemTypes[i]);

            for(let j=0; j<states.length; ++j){
                if(statesForType.indexOf(states[j]) < 0){
                    states.splice(j--,1);
                }
            }
        };

        return states;
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
                    
                    console.log( `Template: ${template.name}, New state: ${newState}`);

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