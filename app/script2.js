function initializeWidget() {
    ZOHO.embeddedApp.on("PageLoad", function(data) {
        alert("Page Reloaded");
    });

    ZOHO.embeddedApp.init();
}
