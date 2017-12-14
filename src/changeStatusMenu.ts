namespace MyExtension.ChangeState {
    VSS.init({ 
        usePlatformScripts: true, 
        usePlatformStyles: true, 
        explicitNotifyLoaded: true 
    });

    console.info("0");
    
    VSS.register("changeStateMenu", new MyExtension.ChangeState.MenuHandler().changeStateMenuHandler);
}