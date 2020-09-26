'use strict';
$(() => {
    // Replicants
    let currentTheme = nodecg.Replicant('currentTheme');

    // Sets the currently selected theme in the dropdown as the current one.
    $('#applyTheme').click(() => {
        let themeChosen = $('#themeOption').val();
        nodecg.sendMessage('changeTheme', themeChosen, err => {});
    });

    // Change the dropdown to the currently active theme.
    currentTheme.on('change', newVal => {
        if (newVal) {
            $('#themeOption').val(newVal);
        }
    });
});
