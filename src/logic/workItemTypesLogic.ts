import {WorkItemType} from "TFS/WorkItemTracking/Contracts";
import {ITemplate} from "./templates/core";
import {WorkItemTrackingHttpClient4_1} from "TFS/WorkItemTracking/RestClient";
import Q = require("q");

export class WorkItemTypeLogic {    
    public static getProjectTemplateDetails(projectId: string): IPromise<ITemplate> {
        console.log("Trying to retrive Work Item Types from VSTS");
        let deferredPromise = Q.defer<ITemplate>();
        
        VSS.require(["TFS/WorkItemTracking/RestClient"], (restClient: any) => {
            let client = <WorkItemTrackingHttpClient4_1>restClient.getClient();

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