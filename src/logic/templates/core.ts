export interface TemplateCollection{
    [name:string] : Template;
}

export interface ITemplate{
    [name:string] : string[];
}

export class Template {
    constructor(public template:ITemplate, public name: string = undefined){}

    public getStatusesForWorkItem(workItemType: string) : string[]{
        // return a copy so no one can manupulate it further
        return this.template[workItemType].slice();
    }
}