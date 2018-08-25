import {StateLogic} from "./statesLogic"
import {TemplateLogic, TemplateDetails} from "./templateLogic"
import {TemplateDefinitions} from "./templateDefinitions"
import {WorkItemTypeLogic} from "./workItemTypesLogic"
import {Template} from "./templates/core"

export class MenuHandler{
    projectTemplateDetails?: TemplateDetails = undefined;
    projectTemplate? : Template = undefined;
    templateDefinitions: TemplateDefinitions = new TemplateDefinitions();
    templateLogic: TemplateLogic = new TemplateLogic();
    getCurrentProjectTemplatePromise: PromiseLike<void>;

    constructor()
    {
        this.getCurrentProjectTemplatePromise = 
            this.templateLogic.getCurrentProjectTemplateName()
                .then(templateDetails => {
                    if (!templateDetails) return;

                    this.projectTemplateDetails = templateDetails;
                    this.templateDefinitions.getTemplate(templateDetails.name)
                    .then( template => {
                      this.projectTemplate = template;  
                    });
                });
    }

    changeStateMenuHandler = (context: any) : IContributedMenuSource => {
        return <IContributedMenuSource> {
            getMenuItems: (actionContext: any)  => {
                return this.getCurrentProjectTemplatePromise
                    .then(() => {
                        if(this.projectTemplate) {
                            let subMenus = this.buildStatesMenu(actionContext, this.projectTemplate);
                            return this.buildMainMenu(subMenus);
                        }
                        else {
                            return WorkItemTypeLogic.getProjectTemplateDetails().then( (t) => {
                                this.projectTemplate = new Template("", t);

                                let subMenus = 
                                    (!this.projectTemplate) 
                                        ? this.buildSelectProjectTemplateMenu(this.projectTemplateDetails) 
                                        : this.buildStatesMenu(actionContext, this.projectTemplate);

                                return this.buildMainMenu(subMenus);
                            });
                        }
                    });
            }
        };
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

    private buildSelectProjectTemplateMenu(templateDetails: TemplateDetails): IContributedMenuItem[]{
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
        
        let selectedItemsTypes = actionContext.workItemTypeNames;
        let commonStatuses = StateLogic.getCommonStatuses(template, selectedItemsTypes);
        
        for(let i = 0; i < commonStatuses.length; ++i){
            let state = commonStatuses[i];

            subMenus.push( {
                text: state,
                icon: (template.name) ? `static/images/status${state.replace(' ', '')}.png` : undefined,
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