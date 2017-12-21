import {MenuHandler} from "./logic/menuHandler";

VSS.register(VSS.getContribution().id, new MenuHandler().changeStateMenuHandler);
//VSS.register("change-status.contextmenu", new MenuHandler().changeStateMenuHandler);