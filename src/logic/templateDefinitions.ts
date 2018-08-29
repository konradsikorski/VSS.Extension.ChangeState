import { Template, TemplateCollection, ITemplate } from "./templates/core"
import { AgileTemplate } from "./templates/templateAgile"
import { ScrumTemplate } from "./templates/templateScrum"
import Q = require("q");

export class TemplateDefinitions{
    private templates: TemplateCollection = {};

    constructor(){
        this.templates["Agile"] = new AgileTemplate();
        this.templates["Scrum"] = new ScrumTemplate();
    }

    public getTemplate(templateName: string):Template{
        return templateName 
            ? this.templates[templateName]
            : undefined;
    }
}