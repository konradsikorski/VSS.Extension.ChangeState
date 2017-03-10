# VSS.Extension.ChangeState
## Visual Studio Extension
This is extension for Visual Studio which can be installed from [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=konradsikorski.change-status).

## Overview
Change state for many work items at once from context menu. 

1. Select one or more work items on your baclkog or query result
2. Right click on selected element
3. From context menu select 'Change State'
4. Choice new state for your work item
5. Done :)

![menu](/readme/img/menu.png)

#### Backlog
![backlog](/readme/img/backlog.png)

#### Query Result
![queryResult](/readme/img/queryResult.png)

## Details
### Narrowing options
If you select items of different types then list of available states will be narrowed to the common of all of theme.

### Forward / Backword actions
In the menu you can find 'Forward' and 'Backword actions. Selecting theme will change work items state to next or previous in the workflow. Here are the workflow steps:
> New <> Active <> Resolved <> Closed

### Supported projects
For now only Agile and Scrum project templates are fully supported. For other templates this extension will not show some specific states.