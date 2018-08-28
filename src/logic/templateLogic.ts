import {TeamProject} from "TFS/Core/Contracts"
import VSS_Extension_Service = require("VSS/SDK/Services/ExtensionData");
import Q = require("q");

export interface TemplateDetails{
    name : string;
    id: string;
}

export class TemplateLogic {
    public static getCurrentProjectTemplateName(projectId: string) : PromiseLike<TemplateDetails> {
        return this.getProjectTemplate(projectId)
            .then((template: TemplateDetails) => {
                if(!template) console.warn("Cannot retrive template");
                return template;
            });
    }

    private static getProjectTemplate(projectId: string): Promise<TemplateDetails>{
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
}