import {StateLogic} from "./statesLogic"
import VSS_Extension_Service = require("VSS/SDK/Services/ExtensionData");

export class TemplateLogic{
    public getCurrentProjectTemplate(projectTemplate: string) : PromiseLike<string> {            
        return VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
            .then((dataService: VSS_Extension_Service.ExtensionDataService) => {
                let context = VSS.getWebContext();
                let projectId = context.project.id;
                let valueKey = this.getStoreKey(projectId);
            
                return dataService.getValue(valueKey, {scopeType: "Default"}).then((projectTemplateValue: string) => {
                    console.log("template name from cache: " + projectTemplateValue);                 
            
                    if(!projectTemplateValue){
                        this.getProjectTemplate(projectId, (templateName: string) => {
                            this.saveProjectTemplate(templateName, dataService);
                            //todo: this code should be Promise, now it is wrong because this callback will be call after the whole promise complete
                            projectTemplate = templateName;
                        });
                    }

                    return projectTemplateValue;
                });
            })
    }

    public selectProjectTemplate(templateName: string) {
        return VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
            .then( dataService =>{
                this.saveProjectTemplate(templateName, dataService);
                return templateName;
            });
    }

    private getProjectTemplate(projectId: string, action: (templateName: string) => void){
        VSS.require(["TFS/Core/RestClient"], (TFS_Wit_WebApi: any) => {
            let client = TFS_Wit_WebApi.getClient();
            client.getProject(projectId, true).then(
                (project: any) => {
                    let templateName = project.capabilities.processTemplate && project.capabilities.processTemplate.templateName;
                    console.log("Project Template: " + templateName);
                    action(templateName);
                });
        });
    }

    private saveProjectTemplate(templateName: string, dataService: IExtensionDataService): void{
        let valueKey = this.getStoreKey();
        dataService.setValue(valueKey, templateName, {scopeType: "Default"});
        console.log("template name saved to cache: " + templateName);
    }

    private getStoreKey(projectId: string = null) : string{
        if(!projectId) {
            let context = VSS.getWebContext();
            projectId = context.project.id;
        }

        let valueKey = "pt_"+projectId;
        return valueKey;
    }
}