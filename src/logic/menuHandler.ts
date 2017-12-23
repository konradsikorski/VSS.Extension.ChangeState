import {StateLogic} from "./statesLogic"
import {TemplateLogic} from "./templateLogic"

import TFS_Wit_Services = require("TFS/WorkItemTracking/Services");
import VSS_Extension_Service = require("VSS/SDK/Services/ExtensionData");

export class MenuHandler{
    projectTemplate : string;
    templateLogic: TemplateLogic = new TemplateLogic();
    getCurrentProjectTemplatePromise: PromiseLike<void>;

    constructor()
    {
        this.getCurrentProjectTemplatePromise = 
            this.templateLogic.getCurrentProjectTemplate()
                .then(templateName => {
                    this.projectTemplate = templateName
                });
    }

    changeStateMenuHandler = (context: any) : IContributedMenuSource => {
        return <IContributedMenuSource> {
            getMenuItems: (actionContext: any)  => {
                return this.getCurrentProjectTemplatePromise
                    .then(() => {
                            let subMenus = 
                                (!this.projectTemplate || !StateLogic.isProjectTemplateSupported(this.projectTemplate)) 
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

    private buildStatesMenu(actionContext: any, template: string) : IContributedMenuItem[]{
        let ids = actionContext.ids || actionContext.workItemIds;
        let subMenus = new Array<IContributedMenuItem>();

        subMenus.push({
            text: "Step",
            childItems: [
                {
                    text: "Forward",
                    icon: "static/images/changeStatusForward.png",
                    action: (actionContext: any) => {
                        StateLogic.changeStatus(ids, this.projectTemplate, true, null);
                    },
                },
                {
                    text: "Backward",
                    icon: "static/images/changeStatusBackward.png",
                    action: (actionContext: any) => {
                        StateLogic.changeStatus(ids, this.projectTemplate, false, null);
                    }
                }
            ]
        });
        
        let selectedItemsTypes = actionContext.workItemTypeNames;
        let commonStatuses = StateLogic.getCommonStatuses(template, selectedItemsTypes);
        
        for(let i = 0; i < commonStatuses.length; ++i){
            let state = commonStatuses[i];

            subMenus.push( {
                text: state,
                icon: `static/images/status${state.replace(' ', '')}.png`,
                action: (actionContext: any) => {
                    StateLogic.changeStatus(ids, this.projectTemplate, undefined, state);
                }
            });
        }

        return subMenus;
    }

    private selectProjectTemplate(templateName: string){
        this.templateLogic.selectProjectTemplate(templateName)
            .then( templateName =>{
                this.projectTemplate = templateName;
            });
    }
}      