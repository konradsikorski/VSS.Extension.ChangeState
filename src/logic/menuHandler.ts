import {StateLogic} from "./statesLogic"
import {TemplateLogic} from "./templateLogic"
import {TemplateDefinitions} from "./templateDefinitions"
import {Template} from "./templates/core"

import TFS_Wit_Services = require("TFS/WorkItemTracking/Services");
import VSS_Extension_Service = require("VSS/SDK/Services/ExtensionData");

export class MenuHandler{
    projectTemplate : Template;
    templateDefinitions: TemplateDefinitions = new TemplateDefinitions();
    templateLogic: TemplateLogic = new TemplateLogic();
    getCurrentProjectTemplatePromise: PromiseLike<void>;

    constructor()
    {
        this.getCurrentProjectTemplatePromise = 
            this.templateLogic.getCurrentProjectTemplate()
                .then(templateName => {
                    this.templateDefinitions.getTemplate(templateName)
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
                            let subMenus = 
                                (!this.projectTemplate) 
                                    ? this.buildSelectProjectTemplateMenu() 
                                    : this.buildStatesMenu(actionContext, this.projectTemplate);
                            
                            return new Array<IContributedMenuItem>(
                                {
                                    text: "Change state",
                                    groupId: "modify",
                                    icon: "static/images/changeStatusAction.png",
                                    childItems: subMenus,
                                }
                            );
                        });
                    }
            };
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

    private buildStatesMenu(actionContext: any, template: Template) : IPromise<IContributedMenuItem[]>{
        let ids = <number[]>(actionContext.ids || actionContext.workItemIds);
        let subMenus = new Array<IContributedMenuItem>();
        
        let selectedItemsTypes = actionContext.workItemTypeNames;
        
        return StateLogic.getStatusWitType(ids)
            .then(workItems => {
                let availableStatuses = new Array<string[]>();

                for( let workItem of workItems) {
                    availableStatuses.push( template.getAvailableStatuses(workItem.type, workItem.status) );
                }

                let commonStatuses = StateLogic.getCommonStatuses(availableStatuses);
                    
                for(let i = 0; i < commonStatuses.length; ++i) {
                    let state = commonStatuses[i];

                    subMenus.push( {
                        text: state,
                        icon: `static/images/status${state.replace(' ', '')}.png`,
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
            });
    }

    private selectProjectTemplate(templateName: string){
        this.templateLogic.selectProjectTemplate(templateName)
            .then( templateName =>{
                this.templateDefinitions.getTemplate(templateName)
                    .then( template => this.projectTemplate = template)
            });
    }
}      