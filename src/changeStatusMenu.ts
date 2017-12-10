namespace MyExtension.ChangeState {
    VSS.init({ 
        usePlatformScripts: true, 
        usePlatformStyles: true, 
        explicitNotifyLoaded: true 
    });

    VSS.register("changeStateMenu", new MyExtension.ChangeState.MenuHandler().changeStateMenuHandler);
}