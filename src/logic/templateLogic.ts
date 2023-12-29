import { VssClientHelper } from './vssClientHelper';

export interface TemplateDetails {
    name: string;
    id: string;
}

export class TemplateLogic {
    public static async getCurrentProjectTemplateName(projectId: string): Promise<TemplateDetails> {
        console.log(`Retrieving project template for project: ${projectId}`);
        const template = await this.getProjectTemplate(projectId);

        if (!template) console.warn("Cannot retrieve template");
        else console.log("Project template: " + template.name);
        
        return template;
    }

    private static async getProjectTemplate(projectId: string): Promise<TemplateDetails> {
        const client = await VssClientHelper.getCoreHttpClient();
        const project = await client.getProject(projectId, true);
        const template = project.capabilities.processTemplate ?
            <TemplateDetails>{
                id: project.capabilities.processTemplate.templateTypeId,
                name: project.capabilities.processTemplate.templateName
            }
            : undefined;
        return template;
    }
}