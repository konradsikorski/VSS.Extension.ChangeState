export class ActionContextWrapper { 
    public static GetWorkItemIds(actionContext: any) : number[]{
        if(!actionContext) return undefined;

        let ids = <number[]>(actionContext.ids || actionContext.workItemIds) ||
            (actionContext.id && [<number>actionContext.id]);

        return ids;
    }

    public static GetWorkItemTypes(actionContext: any): string[]{
        if(!actionContext) return undefined;

        let selectedItemsTypes = <string[]>actionContext.workItemTypeNames || 
            (actionContext.workItemType && [<string>actionContext.workItemType]);

        return selectedItemsTypes;
    }
}