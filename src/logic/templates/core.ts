export interface TemplateCollection{
    [name:string] : Template;
}

export interface ITemplate{
    [name:string] : IWorkItemType;
}

export interface IWorkItemType{
    [name:string] : string[];
}

export class Template {
    constructor(public name: string, public template:ITemplate){}

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