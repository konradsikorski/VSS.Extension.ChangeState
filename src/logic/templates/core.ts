export interface TemplateCollection{
    [name:string] : Template;
}

export interface ITemplate{
    [name:string] : string[];
}

export class Template {
    constructor(public name: string, public template:ITemplate){}

    public getStatusesForWorkItem(workItemType: string) : string[]{
        return  this.template[workItemType];
    }
}