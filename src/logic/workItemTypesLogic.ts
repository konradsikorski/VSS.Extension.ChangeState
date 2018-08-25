import {WorkItemType} from "TFS/WorkItemTracking/Contracts";
import {ITemplate} from "./templates/core"
import Q = require("q");

export class WorkItemTypeLogic {    
    public static getProjectTemplateDetails(): Promise<ITemplate> {
        let deferredPromise = Q.defer<ITemplate>();
        
        let context = VSS.getWebContext();
        let projectId = context.project.id;
        
        VSS.require(["TFS/WorkItemTracking/RestClient"], (restClient: any) => {
            let client = restClient.getClient();
            client.getWorkItemTypes(projectId).then(
                (workItemTypes: WorkItemType[]) => {
                    let template = <ITemplate>{};

                    for( let workItemType of workItemTypes) {
                        let states = new Array();

                        for( let state in workItemType.transitions) {
                            if(state) states.push(state);
                        }

                        template[workItemType.name] = states;
                    }

                    return deferredPromise.resolve(template);
                });
        });
        
        return deferredPromise.promise;
    }
}