import { CoreHttpClient4_1 } from "TFS/Core/RestClient";
import { WorkItemTrackingHttpClient4_1 } from "TFS/WorkItemTracking/RestClient";

export class VssClientHelper {
    public static async getCoreHttpClient(): Promise<CoreHttpClient4_1> {
        const TFS_Wit_WebApi = await this.getModule("TFS/Core/RestClient");
        return <CoreHttpClient4_1>TFS_Wit_WebApi.getClient();
    }

    public static async getWorkItemTrackingHttpClient(): Promise<WorkItemTrackingHttpClient4_1> {
        const restClient = await this.getModule("TFS/WorkItemTracking/RestClient");
        return <WorkItemTrackingHttpClient4_1>restClient.getClient();
    }

    private static getModule(moduleName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            VSS.require([moduleName], resolve);
        });
    }
}