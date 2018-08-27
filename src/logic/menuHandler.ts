import {StateLogic} from "./statesLogic"
import {TemplateLogic, TemplateDetails} from "./templateLogic"
import {TemplateDefinitions} from "./templateDefinitions"
import {WorkItemTypeLogic} from "./workItemTypesLogic"
import {Template} from "./templates/core"
import { CookieLogic } from "./cookieLogic";
import Q = require("q");

export class MenuHandler{
    projectId: string;
    projectTemplateDetails?: TemplateDetails = undefined;
    _projectTemplate? : Template = undefined;
    templateDefinitions: TemplateDefinitions = new TemplateDefinitions();
    templateLogic: TemplateLogic = new TemplateLogic();
    getCurrentProjectTemplatePromise: PromiseLike<void>;

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
                    .then(() => {
                        if(this.projectTemplate) {
                            let subMenus = this.buildStatesMenu(actionContext, this.projectTemplate);
                            return this.buildMainMenu(subMenus);
                        }
                        else {
                            return WorkItemTypeLogic.getProjectTemplateDetails(this.projectId).then( (template) => {
                                this.projectTemplate = template ? new Template(template) : undefined;

                                let subMenus = 
                                    (!this.projectTemplate) 
                                        ? this.buildSelectProjectTemplateMenu() 
                                        : this.buildStatesMenu(actionContext, this.projectTemplate);

                                return this.buildMainMenu(subMenus);
                            });
                        }
                    });
            }
        };
    }

    private menuHandlerStart() : IPromise<void>
    {
        // try get the template from cookies
        let templateFromCookie = CookieLogic.getProjectTemplate(this.projectId);
        if(templateFromCookie){
            console.log( "Project template loaded from cookie2");
            this._projectTemplate = new Template(templateFromCookie);
            this.getCurrentProjectTemplatePromise = Q.resolve<void>()
            return this.getCurrentProjectTemplatePromise;
        }
        
        // if template doesnt exists in coockies then start standard procedure
        return this.getCurrentProjectTemplatePromise = 
            this.templateLogic.getCurrentProjectTemplateName(this.projectId)
                .then(templateDetails => {
                    if (!templateDetails) return;

                    this.projectTemplateDetails = templateDetails;
                    this.templateDefinitions.getTemplate(templateDetails.name)
                    .then( template => {
                        this.projectTemplate = template;  
                    });
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
        let ids = <number[]>(actionContext.ids || actionContext.workItemIds);
        let subMenus = new Array<IContributedMenuItem>();
        const icons = ["Active", "Approved", "Closed", "Committed", "Design", "Done", "InProgress", 
            "New", "Open", "Ready", "Removed", "Resolved", "ToDo"];
                
        let selectedItemsTypes = actionContext.workItemTypeNames;
        let commonStatuses = StateLogic.getCommonStatuses(template, selectedItemsTypes);
        
        for(let i = 0; i < commonStatuses.length; ++i){
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
        this.templateLogic.selectProjectTemplate(templateName)
            .then( templateName =>{
                this.templateDefinitions.getTemplate(templateName)
                    .then( template => this.projectTemplate = template)
            });
    }
}      