import { ITemplate } from "./templates/core";

export class Cache {
    static cache: Map<string, ITemplate> = new Map<string, ITemplate>();

    public static saveProjectTemplate(projectId: string, template: ITemplate) {
        Cache.cache.set(projectId, template);
    }

    public static getProjectTemplate(projectId: string): ITemplate | undefined {
        return Cache.cache.get(projectId);
    }
}