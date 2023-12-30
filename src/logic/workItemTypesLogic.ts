import { WorkItemStateTransition, WorkItemType } from "TFS/WorkItemTracking/Contracts";
import { ITemplate } from "./templates/core";
import { VssClientHelper } from './vssClientHelper';

interface StateInfo {
    name: string;
    color: string;
    category: string;
}

export class WorkItemTypeLogic {
    public static async getProjectTemplateDetails(projectId: string): Promise<ITemplate> {
        console.log("Retriving Work Item Types from DevOps");
        const client = await VssClientHelper.getWorkItemTrackingHttpClient();
        const workItemTypes = await client.getWorkItemTypes(projectId);

        const template = this.extractWorkItemTypes(workItemTypes);

        return template;
    }

    private static extractWorkItemTypes(workItemTypes: any[]): ITemplate {
        const template: ITemplate = {};

        for (const workItemType of workItemTypes) {
            let states;

            if ('states' in workItemType) {
                states = this.extractStates(workItemType.states);
            } else if ('transitions' in workItemType) {
                states = this.extractStatesFromTransition(workItemType.transitions);
            }

            template[workItemType.name] = states;
        }

        return template;
    }

    private static extractStatesFromTransition(transitions: { [key: string]: WorkItemStateTransition[] }): string[] {
        const states: string[] = [];

        for (const state in transitions) {
            if (state) states.push(state);
        }

        return states;
    }

    private static extractStates(statesInfo: StateInfo[] ): string[] {
        const states: string[] = [];

        for (const state of statesInfo) {
            if (state) states.push(state.name);
        }

        return states;
    }
}