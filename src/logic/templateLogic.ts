import {TeamProject} from "TFS/Core/Contracts"
import VSS_Extension_Service = require("VSS/SDK/Services/ExtensionData");
import Q = require("q");

export interface TemplateDetails{
    name : string;
    id: string;
}

export class TemplateLogic {
    public getCurrentProjectTemplateName(projectId: string) : PromiseLike<TemplateDetails> {
        return this.getProjectTemplate(projectId)
            .then((template: TemplateDetails) => {
                if(template) return template;
                console.warn("Cannot retrive template");                

                return VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
                    .then((dataService: VSS_Extension_Service.ExtensionDataService) => 
                    {
                        let valueKey = this.getCacheKey(projectId);
                    
                        return dataService.getValue(valueKey, {scopeType: "Default"})
                            .then((projectTemplateValue: string) => 
                            {
                                console.log(Date.now() + ": template name from cache: " + projectTemplateValue);                 
                                if(!projectTemplateValue) return undefined;
                                
                                return <TemplateDetails>{
                                    name: projectTemplateValue,
                                    id: undefined
                                };
                            });
                    })
            });
    }

    private getProjectTemplate(projectId: string): Promise<TemplateDetails>{
        let deferredPromise = Q.defer<TemplateDetails>();

        VSS.require(["TFS/Core/RestClient"], (TFS_Wit_WebApi: any) => {
            let client = TFS_Wit_WebApi.getClient();
            client.getProject(projectId, true).then(
                (project: TeamProject) => {
                    let template = project.capabilities.processTemplate ?
                        <TemplateDetails>{
                            id: project.capabilities.processTemplate.templateTypeId,
                            name: project.capabilities.processTemplate.templateName
                        }
                        : undefined;

                    console.log("Project Template from tfs api: " + (template && template.name));
                    deferredPromise.resolve(template);
                });
        });

        return deferredPromise.promise;
    }

    public selectProjectTemplate(templateName: string) {
        return VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
            .then( dataService =>{
                this.saveProjectTemplate(templateName, dataService);
                return templateName;
            });
    }

    private saveProjectTemplate(templateName: string, dataService: IExtensionDataService): void{
        let valueKey = this.getCacheKey();
        dataService.setValue(valueKey, templateName, {scopeType: "Default"});
        console.log("template name saved to cache: " + templateName);
    }

    private getCacheKey(projectId?: string) : string{
        if(!projectId) {
            let context = VSS.getWebContext();
            projectId = context.project.id;
        }

        let valueKey = "pt_"+projectId;
        return valueKey;
    }
}