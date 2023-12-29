import { StateLogic } from "./statesLogic"
import { TemplateLogic, TemplateDetails } from "./templateLogic"
import { TemplateDefinitions } from "./templateDefinitions"
import { WorkItemTypeLogic } from "./workItemTypesLogic"
import { Template } from "./templates/core"
import { Cache } from "./cache";
import { ActionContextWrapper } from "./actionContextWrapper";

export class MenuHandler {
    projectId: string;
    _projectTemplate?: Template = undefined;
    templateDefinitions: TemplateDefinitions = new TemplateDefinitions();

    constructor() {
        let context = VSS.getWebContext();
        this.projectId = context.project.id;
    }

    get projectTemplate(): Template {
        return this._projectTemplate;
    }

    set projectTemplate(template: Template) {
        if (template) Cache.saveProjectTemplate(this.projectId, template.template);
        this._projectTemplate = template;
    }

    changeStateMenuHandler = (context: any): IContributedMenuSource => {
        console.log("Extension started");
        return <IContributedMenuSource>{
            getMenuItems: this.getMenuItems
        };
    }

    private async getMenuItems(actionContext: any): Promise<IContributedMenuItem[]> {
        const projectTemplate = await this.menuHandlerStart()
        let subMenus = this.buildStatesMenu(actionContext, projectTemplate)
        
        return this.buildMainMenu(subMenus)
    }

    private async menuHandlerStart(): Promise<Template> {
        // try get the template from cache
        let templateFromCache = Cache.getProjectTemplate(this.projectId);
        if (templateFromCache) {
            console.log("Project template loaded from cache");
            this._projectTemplate = new Template(templateFromCache);
            return this._projectTemplate;
        }

        const templateDetails = await TemplateLogic.getCurrentProjectTemplateName(this.projectId)
        this.projectTemplate = this.templateDefinitions.getTemplate(templateDetails && templateDetails.name)

        if (this.projectTemplate) return this.projectTemplate
        else {
            const templateWorkItem = await WorkItemTypeLogic.getProjectTemplateDetails(this.projectId);
            this.projectTemplate = templateWorkItem ? new Template(templateWorkItem) : undefined;
            console.log(`Project template created form Work Item Types: ${this.projectTemplate != undefined}`);
            return this.projectTemplate;
        }
    }

    private buildMainMenu(subMenus: IContributedMenuItem[]): Array<IContributedMenuItem> {
        return new Array<IContributedMenuItem>(
            {
                text: "Change state",
                groupId: "modify",
                icon: "static/images/changeStatusAction.png",
                childItems: subMenus,
            });
    }

    private buildStatesMenu(actionContext: any, template: Template): IContributedMenuItem[] {
        const ids = ActionContextWrapper.GetWorkItemIds(actionContext);
        const selectedItemsTypes = ActionContextWrapper.GetWorkItemTypes(actionContext);
        const commonStatuses = StateLogic.getCommonStatuses(template, selectedItemsTypes);

        const subMenus: IContributedMenuItem[] = commonStatuses.map((state) => ({
            text: state,
            icon: this.getIcon(state),
            action: async (actionContext: any) => {
                await StateLogic.changeStatus(ids, template, state);
            }
        }));

        if (subMenus.length === 0) {
            subMenus.push({
                text: '(empty)',
                noIcon: true,
                disabled: true
            });
        }

        return subMenus;
    }

    private getIcon(state: string)
    {
        const icons = ["Active", "Approved", "Closed", "Committed", "Design", "Done", "InProgress",
            "New", "Open", "Ready", "Removed", "Resolved", "ToDo"];

        const icon = state.replace(' ', '');
        return icons.indexOf(icon) >= 0 ? `static/images/status${icon}.png` : undefined
    }

    private selectProjectTemplate(templateName: string) {
        this.projectTemplate = this.templateDefinitions.getTemplate(templateName);
    }
}      