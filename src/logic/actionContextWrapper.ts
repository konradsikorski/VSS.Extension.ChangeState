export class ActionContextWrapper { 
    public static GetWorkItemIds(actionContext: any): number[] {
        if (!actionContext) return undefined;

        const ids = actionContext.ids || actionContext.workItemIds || (actionContext.id && [actionContext.id]);

        return ids;
    }

    public static GetWorkItemTypes(actionContext: any): string[] {
        if (!actionContext) return undefined;

        const selectedItemsTypes = actionContext.workItemTypeNames || (actionContext.workItemType && [actionContext.workItemType]);

        return selectedItemsTypes;
    }
}