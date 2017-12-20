import {MenuHandler} from "./logic/menuHandler";

// VSS.init({ 
//     usePlatformScripts: true, 
//     usePlatformStyles: true, 
//     explicitNotifyLoaded: true 
// }); 

// VSS.register(VSS.getContribution().id, new MenuHandler().changeStateMenuHandler);
VSS.register("changeStateMenu", new MenuHandler().changeStateMenuHandler);