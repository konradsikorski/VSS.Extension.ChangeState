import { StateLogic } from "./statesLogic";
import { WorkItemTypeLogic } from "./workItemTypesLogic";
import { Template } from "./templates/core";
import { Cache } from "./cache";
import { ActionContextWrapper } from "./actionContextWrapper";
import TFS_Wit_Client = require("TFS/WorkItemTracking/RestClient"); 

export class MenuHandler {
    private projectId: string;

    constructor() {
        this.projectId = VSS.getWebContext().project.id;
        this.getMenuItems = this.getMenuItems.bind(this);
    }

    changeStateMenuHandler = (context: any): IContributedMenuSource => {
        console.debug("Extension started");
        return <IContributedMenuSource>{
            getMenuItems: this.getMenuItems
        };
    }

    private async getMenuItems(actionContext: any): Promise<IContributedMenuItem[]> {
        const subMenus = await this.buildStatesMenu(actionContext);
        return this.buildMainMenu(subMenus);
    }

    private buildMainMenu(subMenus: IContributedMenuItem[] | Promise<IContributedMenuItem[]>): IContributedMenuItem[] {
        return [
            {
                text: "Change state",
                groupId: "modify",
                icon: "static/images/changeStatusAction.png",
                childItems: subMenus,
            }
        ];
    }

    private async buildStatesMenu(actionContext: any): Promise<IContributedMenuItem[]> {
        const ids = ActionContextWrapper.GetWorkItemIds(actionContext);
        const selectedItemsTypes = ActionContextWrapper.GetWorkItemTypes(actionContext);
        const template = await this.getProjectTemplate();
        const commonStatuses = StateLogic.getCommonStatuses(template, selectedItemsTypes);

        const subMenus: IContributedMenuItem[] = commonStatuses.map((state) => ({
            text: state,
            icon: this.getIcon(state),
            action: async (actionContext: any) => {
                await StateLogic.changeStatus(ids, state);
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

    private async getProjectTemplate(): Promise<Template> {
        let templateFromCache = Cache.getProjectTemplate(this.projectId);
        if (templateFromCache) {
            console.log("Project template loaded from cache");
            return new Template(templateFromCache);
        }
        
        const templateWorkItem = await WorkItemTypeLogic.getProjectTemplateDetails(this.projectId);
        const projectTemplate = templateWorkItem ? new Template(templateWorkItem) : undefined;
        if (projectTemplate) Cache.saveProjectTemplate(this.projectId, projectTemplate.template)

        console.log(`Project template created from Work Item Types: ${projectTemplate != undefined}`);
        return projectTemplate;
    }

    private getIcon(state: string): string | undefined {
        const icons = ["Active", "Approved", "Closed", "Committed", "Design", "Done", "InProgress",
            "New", "Open", "Ready", "Removed", "Resolved", "ToDo"];

        const icon = state.replace(' ', '');
        return icons.includes(icon) ? `static/images/status${icon}.png` : undefined;
    }
}
