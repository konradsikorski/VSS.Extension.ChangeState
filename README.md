# VSS.Extension.ChangeState

This is an extension for Visual Studio Team Services and Team Foundation Server. It can be installed from [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=konradsikorski.change-status).

## Overview
Change state for many work items at once from context menu. 

1. Select one or more work items on your baclkog or query result
2. Right click on selected element
3. From context menu select 'Change State'
4. Chooce new state for your work item
5. Done :)

![menu](/readme/img/menu.png)

#### Backlog
![backlog](/readme/img/backlog.png)

#### Query Result
![queryResult](/readme/img/queryResult.png)

## Details
### Available states
List of states will contains only these allowed by workflow. So for example if current work item state is 'Removed' then the menu will contains only 'New' option because other are not allowed.

### Selecting many items
If you select items of different types then list of available states will be narrowed to the common of all of theme. If no state is available then '(empty)' text will be shown on the list.

### Refresh item state view
After changing the state the view will not be refreshed, you have to refresh the page manually if you want to see the change.

### Supported projects
For now only `Agile` and `Scrum` project templates are supported.

## Project Template Selection
If your project template is different than `Agile` or `Scrum` (or derives from) or extension was not able to get information about your current project template then you will see an option to select the project template like this (you have to set it only once):

![selectTemplate](/readme/img/selectTemplate.png)
