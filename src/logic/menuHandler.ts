import {StateLogic} from "./statesLogic"

import ExtensionDataService = require("VSS/SDK/Services/ExtensionData")
import TFS_Wit_Services = require("TFS/WorkItemTracking/Services");
import VSS_Extension_Service = require("VSS/SDK/Services/ExtensionData");

export class MenuHandler{
    projectTemplate : string;
    getCurrentProjectTemplatePromise: PromiseLike<void>;

    constructor()
    {
        this.getCurrentProjectTemplatePromise = this.getCurrentProjectTemplate();
    }

    changeStateMenuHandler = (context: any) => {
        return this.getCurrentProjectTemplatePromise
            .then(() =>{
                return {
                    getMenuItems: (actionContext: any) : Array<IContributedMenuItem> => {
                        let subMenus = 
                        //      this.getCurrentProjectTemplate()
                        //     .then(() => { 
                                // return 
                                (!this.projectTemplate || !StateLogic.isProjectTemplateSupported(this.projectTemplate)) 
                                            ? this.buildSelectProjectTemplateMenu() 
                                            : this.buildStatesMenu(actionContext, this.projectTemplate);
                        //         });
                        
                        return new Array<IContributedMenuItem>(
                            {
                                text: "Change state",
                                groupId: "modify",
                                icon: "static/images/changeStatusAction.png",
                                childItems: subMenus,
                            }
                        );
                    }
                };
            });
    }

    private getCurrentProjectTemplate() : PromiseLike<void> {            
        return VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
            .then((dataService: VSS_Extension_Service.ExtensionDataService) => {
                let context = VSS.getWebContext();
                let projectId = context.project.id;
                let valueKey = "pt_"+projectId;
            
                return dataService.getValue(valueKey, {scopeType: "Default"}).then((projectTemplateValue: string) => {
                    console.log("User preference value is: " + projectTemplateValue);                 
            
                    if(!projectTemplateValue){
                        StateLogic.getProjectTemplate(projectId, (templateName: string) => {
                            //todo: this code should be Promise, now it is wrong because this callback will be call after the whole promise complete
                            this.projectTemplate = templateName;
                            dataService.setValue(valueKey, templateName, {scopeType: "Default"});
                            console.log("template saved to store: " + templateName);
                        });
                    }

                    return projectTemplateValue;
                });
            })
            .then( projectTemplate => {
                this.projectTemplate = projectTemplate;
            });
    }

    private selectProjectTemplate(templateName: string){
        return VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
            .then( dataService =>{
                let context = VSS.getWebContext();
                let projectId = context.project.id;
                let valueKey = "pt_"+projectId;

                dataService.setValue(valueKey, templateName, {scopeType: "Default"});
                this.projectTemplate = templateName;
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

        console.debug("buildStatesMenu completed");
        return subMenus;
    }
}      