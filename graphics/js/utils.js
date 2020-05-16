// Currency formatter for $USD for bid totals and donation amounts.
const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
});

// Converts milliseconds to a time string.
function msToTime(duration, noHour) {
    let seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    let timeString = '';

    if (!noHour)
        timeString += hours+':';
    timeString += minutes + ':' + seconds;

    return timeString;
}

function FixSize(selector) {

    setTimeout(function(){
        let divWidth = $(selector + ":visible").width();
        let fontSize = 92;

        // Reset font to default size to start.
        $(selector).css("font-size", "");

        let text_org = $(selector + ":visible").html();
        let text_update = '<span style="white-space:nowrap;">' + text_org + '</span>';
        $(selector + ":visible").html(text_update);

        while ($(selector + ":visible").children().width() > divWidth){
            // console.log($(selector + ":visible").children().width() + " " + divWidth);
            $(selector).css("font-size", fontSize -= 1);
        }

        // console.log(fontSize)
    }, 500);
}

function getProgressBarColor(current, max){
    let progress;
    if (max) {
        progress = current / max;
    } else {
        progress = 0;
    }
    let color = '#b52911';

    if(progress > 0.6)
    {
        color = '#03b000';
    }
    else if(progress > 0.3)
    {
        color = '#da7500';
    }

    return color;
}

// Get team info from run data.
function getRunnersFromRunData(runData) {
    let currentTeamsData = [];
    runData.teams.forEach(team => {
        let teamData = {players: [], id: team.id};
        team.players.forEach(player => {teamData.players.push(createPlayerData(player));});
        currentTeamsData.push(teamData);
    });
    return currentTeamsData;
}

// Easy access to create member data object used above.
function createPlayerData(player) {
    // Gets username from URL.
    let twitchUsername = '';
    if (player.social && player.social.twitch) {
        twitchUsername = player.social.twitch;
    }

    // Parse pronouns from the runner name, if they're present.
    // Check for "name (pronouns)" form as well as "name - pronouns".
    let name;
    if (player.name.includes('(') && player.name.includes(')')) {
        name = player.name.split('(');
    } else {
        name = player.name.split('-');
    }
    let pronouns = '';
    if (name.length > 1) {
        pronouns = name[1].trim().replace(')', '');
    }
    name = name[0].trim();

    return {
        id: player.id,
        teamID: player.teamID,
        name: name,
        pronouns: pronouns,
        twitch: twitchUsername,
        region: player.region
    };
}
