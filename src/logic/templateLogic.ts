import {StateLogic} from "./statesLogic"
import VSS_Extension_Service = require("VSS/SDK/Services/ExtensionData");
import Q = require("q");

export class TemplateLogic {
    public getCurrentProjectTemplate() : PromiseLike<string> {
        let context = VSS.getWebContext();
        let projectId = context.project.id;

        return this.getProjectTemplate(projectId)
            .then((templateName: string) => {
                if(templateName) return templateName;

                return VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
                    .then((dataService: VSS_Extension_Service.ExtensionDataService) => 
                    {
                        let valueKey = this.getCacheKey(projectId);
                    
                        return dataService.getValue(valueKey, {scopeType: "Default"})
                            .then((projectTemplateValue: string) => 
                            {
                                console.log(Date.now() + ": template name from cache: " + projectTemplateValue);                 
                                return projectTemplateValue;
                            });
                    })
            });
    }

    private getProjectTemplate(projectId: string){
        let deferredPromise = Q.defer<string>();

        VSS.require(["TFS/Core/RestClient"], (TFS_Wit_WebApi: any) => {
            let client = TFS_Wit_WebApi.getClient();
            client.getProject(projectId, true).then(
                (project: any) => {
                    let templateName = project.capabilities.processTemplate && project.capabilities.processTemplate.templateName;
                    console.log("Project Template from tfs api: " + templateName);
                    deferredPromise.resolve(templateName);
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

    private getCacheKey(projectId: string = null) : string{
        if(!projectId) {
            let context = VSS.getWebContext();
            projectId = context.project.id;
        }

        let valueKey = "pt_"+projectId;
        return valueKey;
    }
}