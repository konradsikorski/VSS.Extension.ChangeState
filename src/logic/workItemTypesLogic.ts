import { WorkItemStateTransition, WorkItemType } from "TFS/WorkItemTracking/Contracts";
import { ITemplate } from "./templates/core";
import { VssClientHelper } from './vssClientHelper';

export class WorkItemTypeLogic {
    public static async getProjectTemplateDetails(projectId: string): Promise<ITemplate> {
        console.log("Retriving Work Item Types from DevOps");
        const client = await VssClientHelper.getWorkItemTrackingHttpClient();
        const workItemTypes = await client.getWorkItemTypes(projectId);

        const template = this.extractWorkItemTypes(workItemTypes);

        return template;
    }

    private static extractWorkItemTypes(workItemTypes: WorkItemType[]): ITemplate {
        const template: ITemplate = {};

        for (const workItemType of workItemTypes) {
            const states = this.extractStates(workItemType.transitions);

            template[workItemType.name] = states;
        }

        return template;
    }

    private static extractStates(transitions: { [key: string]: WorkItemStateTransition[] }): string[] {
        const states: string[] = [];

        for (const state in transitions) {
            if (state) states.push(state);
        }

        return states;
    }
}