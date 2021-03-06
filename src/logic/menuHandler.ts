import {StateLogic} from "./statesLogic"
import {TemplateLogic, TemplateDetails} from "./templateLogic"
import {TemplateDefinitions} from "./templateDefinitions"
import {WorkItemTypeLogic} from "./workItemTypesLogic"
import {Template} from "./templates/core"
import { CookieLogic } from "./cookieLogic";
import Q = require("q");
import { ActionContextWrapper } from "./actionContextWrapper";

export class MenuHandler{
    projectId: string;
    _projectTemplate? : Template = undefined;
    templateDefinitions: TemplateDefinitions = new TemplateDefinitions();

    constructor()
    {
        let context = VSS.getWebContext();
        this.projectId = context.project.id;
    }

    get projectTemplate(): Template{
        return this._projectTemplate;
    }

    set projectTemplate(template : Template) {
        if(template) CookieLogic.saveProjectTemplate(this.projectId, template.template);
        this._projectTemplate = template;
    }

    changeStateMenuHandler = (context: any) : IContributedMenuSource => {
        return <IContributedMenuSource> {
            getMenuItems: (actionContext: any)  => {
                return this.menuHandlerStart()
                    .then( projectTemplate => {
                        let subMenus = (!projectTemplate) 
                            ? this.buildSelectProjectTemplateMenu() 
                            : this.buildStatesMenu(actionContext, projectTemplate);

                        return this.buildMainMenu(subMenus);
                    });
            }
        };
    }

    private menuHandlerStart() : IPromise<Template>
    {
        // try get the template from cookies
        let templateFromCookie = CookieLogic.getProjectTemplate(this.projectId);
        if(templateFromCookie){
            console.log( "Project template loaded from cookie");
            this._projectTemplate = new Template(templateFromCookie);
            return Q.resolve(this._projectTemplate)
        }

        return TemplateLogic.getCurrentProjectTemplateName(this.projectId)
            .then(templateDetails => {
                this.projectTemplate = this.templateDefinitions.getTemplate(templateDetails && templateDetails.name);
                
                if(this.projectTemplate) return this.projectTemplate
                else {
                    return WorkItemTypeLogic.getProjectTemplateDetails(this.projectId)
                        .then( (templateWorkItem) => {
                            this.projectTemplate = templateWorkItem ? new Template(templateWorkItem) : undefined;
                            console.log(`Project template created form Work Item Types: ${this.projectTemplate != undefined}`);
                            return this.projectTemplate;
                        })
                }
            });
    }
    
    private buildMainMenu(subMenus: IContributedMenuItem[]) :Array<IContributedMenuItem>
    {
        return new Array<IContributedMenuItem>(
            {
                text: "Change state",
                groupId: "modify",
                icon: "static/images/changeStatusAction.png",
                childItems: subMenus,
            });
    }

    private buildSelectProjectTemplateMenu(): IContributedMenuItem[]{
        return [
            {
                text: "What is your project template?",
                childItems: [
                    {
                        text: "Agile",
                        action: (actionContext: any) => {
                            this.selectProjectTemplate("Agile");
                        }
                    },
                    {
                        text: "Scrum",
                        action: (actionContext: any) => {
                            this.selectProjectTemplate("Scrum");
                        }
                    }
                ]
            }
        ];
    }

    private buildStatesMenu(actionContext: any, template: Template) : IContributedMenuItem[]{
        let ids = ActionContextWrapper.GetWorkItemIds(actionContext);

        let subMenus = new Array<IContributedMenuItem>();
        const icons = ["Active", "Approved", "Closed", "Committed", "Design", "Done", "InProgress", 
            "New", "Open", "Ready", "Removed", "Resolved", "ToDo"];
                
        let selectedItemsTypes = ActionContextWrapper.GetWorkItemTypes(actionContext);
        let commonStatuses = StateLogic.getCommonStatuses(template, selectedItemsTypes);
        
        for (let i = 0; i < commonStatuses.length; ++i){
            let state = commonStatuses[i];
            let icon = state.replace(' ', '');

            subMenus.push( {
                text: state,
                icon: icons.indexOf(icon) >= 0 ? `static/images/status${icon}.png` : undefined,
                action: (actionContext: any) => {
                    StateLogic.changeStatus(ids, template, state);
                }
            });
        }

        if(subMenus.length == 0) {
            subMenus.push({
                text: '(empty)',
                noIcon: true,
                disabled: true
            });
        }

        return subMenus;
    }

    private selectProjectTemplate(templateName: string){
        this.projectTemplate = this.templateDefinitions.getTemplate(templateName);
    }
}      