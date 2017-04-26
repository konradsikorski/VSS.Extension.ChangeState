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
### Narrowing options
If you select items of different types then list of available states will be narrowed to the common of all of theme.

### Forward / Backword actions
In the menu you can find 'Forward' and 'Backword actions. Selecting theme will change work items state to next or previous in the workflow. Below example of workflow steps for Backlog Item for

Agile:
> New <> Active <> Resolved <> Closed

and Scrum:
> New <> Approved <> Committed <> Done

### Supported projects
For now only `Agile` and `Scrum` project templates are supported.

## Project Template Selection
If your project template is different than `Agile` or `Scrum` (or derives from) or extension was not able to get information about your current project template then you will see an option to select the project template like this (you have to set it only once):

![selectTemplate](/readme/img/selectTemplate.png)