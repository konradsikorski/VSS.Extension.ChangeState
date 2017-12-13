// import ExtensionDataService = require("VSS/SDK/Services/ExtensionData")

namespace MyExtension.ChangeState {
    export class MenuHandler{
        projectTemplate : string;

        constructor()
        {
            this.getCurrentProjectTemplate();
        }

        private getCurrentProjectTemplate(){
            return VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData).then((dataService) => {
                let context = VSS.getWebContext();
                let projectId = context.project.id;
                let valueKey = "pt_"+projectId;
            
                return dataService.getValue(valueKey, {scopeType: "Default"}).then((projectTemplateValue: string) => {
                    console.log("User preference value is " + projectTemplateValue);                 
            
                    if(!projectTemplateValue){
                        StateLogic.getProjectTemplate(projectId, (templateName: string) => {
                            projectTemplateValue = templateName;
                            VSS.notifyLoadSucceeded();
                            dataService.setValue(valueKey, templateName, {scopeType: "Default"});
                        });
                    }

                    return projectTemplateValue;
                });
            })
            .then( projectTemplate => {
                this.projectTemplate = projectTemplate;
                VSS.notifyLoadSucceeded();
            });
        }

        private selectProjectTemplate(templateName: string){
            return VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
                .then(function(dataService) {
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
                            action: function(actionContext: any){
                                this.selectProjectTemplate("Agile");
                            }
                        },
                        {
                            text: "Scrum",
                            action: function(actionContext: any){
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
                        action: function(actionContext: any){
                            StateLogic.changeStatus(ids, this.projectTemplate, true, null);
                        },

                    },
                    {
                        text: "Backward",
                        icon: "static/images/changeStatusBackward.png",
                        action: function(actionContext: any){
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
                    action: function(actionContext: any){
                        StateLogic.changeStatus(ids, this.projectTemplate, undefined, this.text);
                    }
                });
            }

            return subMenus;
        }

        changeStateMenuHandler = (context: any): IContributedMenuSource => {
            return {
                getMenuItems: (actionContext: any) : Array<IContributedMenuItem> => {
                    let subMenus = (!this.projectTemplate || !StateLogic.isProjectTemplateSupported(this.projectTemplate)) 
                        ? this.buildSelectProjectTemplateMenu() 
                        : this.buildStatesMenu(actionContext, this.projectTemplate);

                    return new Array<IContributedMenuItem>(
                        {
                            text: "Change state",
                            groupId: "modify",
                            icon: "static/images/changeStatusAction.png",
                            childItems: subMenus
                        }
                    );
                }
            };
        }
    }      
}