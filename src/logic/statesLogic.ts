import { TemplatesDesctiptor } from './statesDetails'
import TFS_Wit_Client = require("TFS/WorkItemTracking/RestClient"); 

export class StateLogic {
    public static isProjectTemplateSupported(templateName: string): boolean {
        return TemplatesDesctiptor.stateFlow[templateName] ? true : false;
    }

    public static getStateFlow(templateName: string, type: string) : Array<string> {
        let template = TemplatesDesctiptor.stateFlow[templateName];
        if(!template) {
            console.log('WARN: No template "' + type + '" found');
            return null;
        }

        let states = <Array<string>>template[type];
        if(!states) {
            console.log('WARN: No type "' + type + '" found for template "' + template + '"');
            return null;
        }

        return states;
    }

    private static getNextState(templateName: string, type: string, state: string): string {
        let states = StateLogic.getStateFlow(templateName, type);

        let index = states.indexOf(state);
        return (index >= 0 && index + 1 < states.length ) 
            ? states[index + 1]
            : null;
    }

    private static getPrevState(templateName: string, type: string, state: string): string {
        let states = StateLogic.getStateFlow(templateName, type);

        let index = states.indexOf(state);
        return (index - 1 >= 0 ) 
            ? states[index - 1]
            : null;
    }

    private static getReasonForStateForType(template: string, type: string, fromState: string, toState: string): string{
        return  TemplatesDesctiptor.stateToReason[template]&&
                TemplatesDesctiptor.stateToReason[template][type] && 
                TemplatesDesctiptor.stateToReason[template][type][toState]&&
                TemplatesDesctiptor.stateToReason[template][type][toState][fromState];
    }

    public static getCommonStatuses(template: string, itemTypes: string): Array<string>{
        let templateStates = TemplatesDesctiptor.stateToReason[template];
        let statesForType = <Array<string>>templateStates[itemTypes[0]];
        let states = new Array<string>();

        // init statuses array using first item type
        for(let state in statesForType)
        {
            states.push(state);
        }

        // remove uncommon statuses
        for(let i=1; i<itemTypes.length; ++i){
            statesForType = templateStates[itemTypes[i]];

            for(let j=0; j<states.length; ++j){
                if(!statesForType[states[j]]){
                    states.splice(j--,1);
                }
            }
        }

        return states;
    }

    public static getProjectTemplate(projectId: string, action: (templateName: string) => void){
        VSS.require(["TFS/Core/RestClient"], (TFS_Wit_WebApi: any) => {
            let client = TFS_Wit_WebApi.getClient();
            client.getProject(projectId, true).then(
                (project: any) => {
                    let templateName = project.capabilities.processTemplate && project.capabilities.processTemplate.templateName;
                    console.log("Project Template: " + templateName);
                    action(templateName);
                });
        });
    }

    public static changeStatus(selectedItems: Array<number>, template: string, forward: boolean, toState: string): void{
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
                    
                    let newState = toState || (forward ? StateLogic.getNextState(template, type, state) : StateLogic.getPrevState(template, type, state));
                    if(!newState) {
                        console.log(`Cannot change status for this item. Template: ${template}`);
                        continue;
                    }

                    let newReason = StateLogic.getReasonForStateForType(template, type, state, newState);
                    if(!newReason) {
                        console.log(`Cannot change reason for this item. Template: ${template}`);
                        continue;
                    }
                    
                    console.log( `Template: ${template}, New state: ${newState}, New reason: ${newReason}`);

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
                        console.log('UPDATED: ' + workItem.id);
                    });
                }

                // VSS.getService(VSS.ServiceIds.Navigation).then(function(navigationService) {
                //     navigationService.reload();
                // });
            });                
    }
}