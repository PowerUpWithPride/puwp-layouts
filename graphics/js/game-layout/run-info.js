// Main run info update functionality.
'use strict';

$(() => {
    // The bundle name where all the run information is pulled from.
    const speedcontrolBundle = 'nodecg-speedcontrol';

    // JQuery selectors.
    let gameTitle = $('#game-name');
    let gameCategory = $('#category');
    let gameSystem = $('#platform');
    let gameYear = $('#year');
    let gameEstimate = $('#estimate');
    let hostName = $('#host-name');
    let hostPronouns = $('#host-pronouns');
    let commentatorInfo = $('#commentator-info');

    // This is where the information is received for the run we want to display.
    // The "change" event is triggered when the current run is changed.
    let runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
    runDataActiveRun.on('change', (newVal, oldVal) => {
        if (newVal)
            updateSceneFields(newVal);
    });

    // Sets information on the pages for the run.
    function updateSceneFields(runData) {
        let currentTeamsData = getRunnersFromRunData(runData);

        // Split year out from system platform, if present.
        gameTitle.html(runData.game);
        gameCategory.html(runData.category);
        gameSystem.html(runData.system);
        gameYear.html(runData.release);
        gameEstimate.html(runData.estimate);

        // Set each player names and pronouns.
        $(".runner-name").add(".pronouns").text('');
        $(".runner-details").data('teamID', '');
        let i = 0;
        for (let team of currentTeamsData) {
            i += 1;
            let names = [];
            let pronouns = [];
            for (let player of team.players) {
                names.push(player.name);
                pronouns.push(player.pronouns);
            }

            // Set name/pronoun text for the whole team.
            $("#runner-name" + i).text(names.join(', '));
            $("#pronouns" + i).text(pronouns.join(', '));
            $("#runner-details" + i).data('teamID', team.id);
        }

        // Set host name and pronouns
        hostName.html(runData.customData.hostName);
        hostPronouns.html(runData.customData.hostPronouns);
        commentatorInfo.html(runData.customData.commentatorInfo);

        // Fix pronoun wrapping for the current layout if needed.
        FixSize('#game-name');
    }
});
