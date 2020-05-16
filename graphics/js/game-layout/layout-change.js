// Javascript for layout changing functionality.  Change applied CSS and show/hide layout containers.
'use strict';

$(() => {
    if (offlineMode) {
        loadOffline();
    }
    else{
        loadFromSpeedControl();
    }

    function loadOffline() {
        console.log("loadOffline");
        changeLayout(globalLayoutInfo);
    }

    function loadFromSpeedControl() {
        // The bundle name where all the run information is pulled from.
        const layoutBundle = 'speedcontrol-layoutswitch';

        // Replicants
        let currentLayout = nodecg.Replicant('currentGameLayout', layoutBundle);

        // Listens for the layout style to change.
        currentLayout.on('change', newVal => {
            if (newVal) {
                changeLayout(newVal);
            }
        });
    }
});

// Update the current layout by switching the CSS file.
function changeLayout(layoutInfo) {
    let cssURL = 'css/game-layout/' + layoutInfo.code + '.css';
    $('#layout-css-file').attr('href', cssURL);
    FixSize('#game-name');
}
