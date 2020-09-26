// Javascript for theme changing functionality.  Change applied base theme CSS.
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
        changeTheme("puwp");
    }

    function loadFromSpeedControl() {
        // Replicants
        let currentTheme = nodecg.Replicant('currentTheme');

        // Listens for the theme to change.
        currentTheme.on('change', newVal => {
            if (newVal) {
                changeTheme(newVal);
            }
        });
    }
});

// Update the current layout by switching the CSS file.
function changeTheme(name) {
    let cssURL = 'css/themes/' + name + '.css';
    $('#theme-css-file').attr('href', cssURL);
    FixSize('#game-name');
}
