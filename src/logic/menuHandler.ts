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
        return {
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

    private getCurrentProjectTemplate() : PromiseLike<void> {            
        return VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
            .then((dataService: VSS_Extension_Service.ExtensionDataService) => {
                let context = VSS.getWebContext();
                let projectId = context.project.id;
                let valueKey = this.getStoreKey(projectId);
            
                return dataService.getValue(valueKey, {scopeType: "Default"}).then((projectTemplateValue: string) => {
                    console.log("template name from cache: " + projectTemplateValue);                 
            
                    if(!projectTemplateValue){
                        StateLogic.getProjectTemplate(projectId, (templateName: string) => {
                            this.saveProjectTemplate(templateName, dataService);
                            //todo: this code should be Promise, now it is wrong because this callback will be call after the whole promise complete
                            this.projectTemplate = templateName;
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
                this.saveProjectTemplate(templateName, dataService);
                this.projectTemplate = templateName;
            });
    }

    private saveProjectTemplate(templateName: string, dataService: IExtensionDataService): void{
        let valueKey = this.getStoreKey();
        dataService.setValue(valueKey, templateName, {scopeType: "Default"});
        console.log("template name saved to cache: " + templateName);
    }

    private getStoreKey(projectId: string = null) : string{
        if(!projectId) {
            let context = VSS.getWebContext();
            projectId = context.project.id;
        }

        let valueKey = "pt_"+projectId;
        return valueKey;
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
}      