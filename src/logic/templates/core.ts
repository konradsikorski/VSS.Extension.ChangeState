export interface TemplateCollection{
    [name:string] : Template;
}

export interface ITemplate{
    [name:string] : string[];
}

export class Template {
    constructor(public template:ITemplate, public name: string = undefined){}

    public getStatusesForWorkItem(workItemType: string) : string[]{
        return  this.template[workItemType];
    }
}