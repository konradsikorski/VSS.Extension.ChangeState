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

### Selecting many items

If you select items of different types then list of available states will be narrowed to the common of all of theme. If no state is available then '(empty)' text will be shown on the list.

### Refresh item state view

After changing the state the view will not be refreshed, you have to refresh the page manually if you want to see the change.

### Supported projects

Extension is working for built-in and custom project templates. For custom project templates options for state menu will be sorted alphabetically and may have no icons.

## Initial loading behavior

Upon your first access of the context menu after refreshing the page, there will be an approximate 5-second delay before the "Change State" option becomes visible. This delay is necessary for the extension to properly load and read the project template details, ensuring that the correct statuses are displayed.After this initial loading period, the "Change State" option will appear immediately in the context menu for subsequent uses. However, if you refresh the page, the process will repeat.

## Ignoring transition rules in state selection

For each Work Item type, such as a Task, the context menu displays all possible states (e.g., New, In Progress, Closed) regardless of the current state. It does not account for transition conditions; for instance, even if a Task is in the 'New' state, where typically only 'In Progress' is the next logical state, the menu will still show all options. This design choice is made to ensure faster access to the context menu during every use.