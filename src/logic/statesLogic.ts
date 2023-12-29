import { WorkItem } from 'TFS/WorkItemTracking/Contracts';
import {Template} from './templates/core'
import TFS_Wit_Client = require("TFS/WorkItemTracking/RestClient"); 

export class StateLogic {

    public static getCommonStatuses(template: Template, workItemTypes: string[]): Array<string>{
        if(!workItemTypes || workItemTypes.length === 0) return [];

        let states = template.getStatusesForWorkItem(workItemTypes[0]);

        // remove uncommon statuses
        for(let i = 1; i < workItemTypes.length; ++i)
        {
            const statesForType = template.getStatusesForWorkItem(workItemTypes[i]);

            states = states.filter((state: string) => statesForType.includes(state));
        };

        return states;
    }

    public static async changeStatus(selectedItems: Array<number>, template: Template, toState: string): Promise<void>{
        let witClient = TFS_Wit_Client.getClient();
        const workItems = await witClient.getWorkItems(selectedItems, ["System.State", "System.WorkItemType"])
        console.log("GET: " + JSON.stringify(workItems));

        for(let i=0; i<workItems.length; ++i){
            await this.updateWorkItem(workItems[i], witClient, toState);
        }
    }

    private static async updateWorkItem(item: WorkItem, witClient: TFS_Wit_Client.WorkItemTrackingHttpClient4_1, newState: string): Promise<void> {
        let id = item.id;
        let revision = item.rev;
        let type = item.fields["System.WorkItemType"];
        let state = item.fields["System.State"];
        console.log( `ID: ${id}, Type: ${type}, State: ${state}, Revision: ${revision}`);
        
        if(!newState) {
            console.log(`Cannot change status for this item.`);
            return;
        }
        
        console.log( `New state: ${newState}`);

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
        
        try {
            await witClient.updateWorkItem(update, id);
            console.log('Work item UPDATED: ' + id);
        } catch(e) {
            console.error(`Work item (${id}) update error: ${e}`);
        }
    }
}