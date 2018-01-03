export interface TemplateCollection{
    [name:string] : Template;
}

export interface ITemplate{
    [name:string] : IWorkItemType;
}

export interface IWorkItemType{
    [name:string] : IState;
}

export interface IState {
    [name:string] : string;
}

export class Template {
    constructor(public name: string, public template:ITemplate){}

    public getReasonForStateForType(workItemType: string, fromState: string, toState: string): string{
        return  this.template[workItemType] && 
                this.template[workItemType][fromState]&&
                this.template[workItemType][fromState][toState];
    }

    public getAvailableStatuses(workItemType: string, workItemStatus: string): string[] {
        let statesObject = 
            this.template[workItemType] &&
            this.template[workItemType][workItemStatus]
        
        let states = new Array<string>();

        for (let key in statesObject) {
            if (statesObject.hasOwnProperty(key)) {
                states.push(key)
            }
        }

        return states;
    }

    public getStatusesForWorkItem(workItemType: string) : string[]{
        let statesObject = this.template[workItemType];
        let states = new Array<string>();
        
        for (let key in statesObject) {
            if (statesObject.hasOwnProperty(key)) {
                states.push(key)
            }
        }

        return states;
    }
}