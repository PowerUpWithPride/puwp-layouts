// Main run info update functionality.
'use strict';

// The bundle name where all the run information is pulled from.
const speedcontrolBundle = 'nodecg-speedcontrol';
const donationBundle = 'speedcontrol-gdqtracker';


const rotateInterval = 15000;
let rotateState = 0;

// Flag for whether we've resized the bid war names after updating.
let bid_war_size_done = false;

// Initialize the page.
$(() => {
    // Run data.
    let runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
    let runDataArray = nodecg.Replicant('runDataArray', speedcontrolBundle);
    let bids = nodecg.Replicant('bids', donationBundle);

    // Get the next X runs in the schedule.
    function getNextRuns(runData, amount) {
        let nextRuns = [];
        let indexOfCurrentRun = findIndexInRunDataArray(runData);
        for (let i = 1; i <= amount; i++) {
            if (!runDataArray.value[indexOfCurrentRun + i]) {
                break;
            }
            nextRuns.push(runDataArray.value[indexOfCurrentRun + i]);
        }
        return nextRuns;
    }

    // Find array index of current run based on it's ID.
    function findIndexInRunDataArray(run) {
        let indexOfRun = -1;

        // Completely skips this if the run variable isn't defined.
        if (run) {
            for (let i = 0; i < runDataArray.value.length; i++) {
                if (run.id === runDataArray.value[i].id) {
                    indexOfRun = i; break;
                }
            }
        }

        return indexOfRun;
    }

    // Wait for replicants to load before we do anything.
    NodeCG.waitForReplicants(runDataActiveRun, runDataArray, bids).then(loadFromSpeedControl);

    // Rotate between upcoming runs, incentives, and bid wars.
    setInterval(rotate, rotateInterval);

    //Hi, other jank ways of fixing things
    function rotate() {
      /*  if (rotateState === 0) {
            rotateState = 1;
            $('.bid-wars').hide();
            $('.schedule').fadeOut(500, () => {
                $('.incentives').fadeIn(500);
            });
        } else if (rotateState === 1) {
            rotateState = 2;
            $('.schedule').hide();
            $('.incentives').fadeOut(500, () => {
                $('.bid-wars').fadeIn(500, () => {
                    // Fix size for bid names once we're visible.
                    if (!bid_war_size_done) {
                        FixSize('.bid-name');
                        bid_war_size_done = true;
                    }
                });
            });
        } else {
            rotateState = 0;
            $('.incentives').hide();
            $('.bid-wars').fadeOut(500, () => {
                $('.schedule').fadeIn(500);
            });
        } */
    }

    function loadFromSpeedControl() {
        // This is where the information is received for the run we want to display.
        // The "change" event is triggered when the current run is changed.
        runDataActiveRun.on('change', (newVal, oldVal) => {
            refreshNextRunsData(newVal);
        });

        runDataArray.on('change', (newVal, oldVal) => {
            refreshNextRunsData(runDataActiveRun.value);
        });

        bids.on('change', (newVal, oldVal) => {
            refreshNextBidsData(newVal);
        });
    }

    function getNamesForRun(runData) {
        let currentTeamsData = getRunnersFromRunData(runData);
        let names = [];
        for (let team of currentTeamsData) {
            for (let player of team.players) {
                names.push(player.name);
            }
        }
        return names;
    }

    function refreshNextRunsData(currentRun) {
        const numUpcoming = 3;
        let nextRuns = getNextRuns(currentRun, numUpcoming);

        let comingUpGame = $('.coming-up-name');
        let comingUpRunner = $('.coming-up-runner');

        // Next up game.
        comingUpGame.html(currentRun.game);
        comingUpRunner.html(getNamesForRun(runDataActiveRun.value).join(', '));

        // On deck games.
        let onDeckInfoWrapper = $(".on-deck-info-wrapper");
        onDeckInfoWrapper.children().remove();

        let i = 0;
        for (let run of nextRuns) {
            i += 1;
            let onDeckGame = $("<div>").addClass("on-deck-name on-deck-name" + i);
            let onDeckRunner = $("<div>").addClass("on-deck-runner on-deck-runner" + i);
            onDeckGame.html(run.game);
            onDeckRunner.html(getNamesForRun(run).join(', '));

            // Build the container for this run.
            onDeckInfoWrapper.append($("<div>").addClass("on-deck-info").append(onDeckGame).append(onDeckRunner));
        }
    }

    function refreshNextBidsData(currentBids) {
        const numIncentives = 3;
        const numBids = 1;
        let incentives = [];
        let bidWars = [];

        for (let bid of currentBids) {
            if (bid.war) {
                if (bidWars.length < numBids) {
                    bidWars.push(bid);
                }
            } else {
                if (incentives.length < numIncentives) {
                    incentives.push(bid);
                }
            }
        }

        const bidProgressFullWidth = 300;  // Same as CSS class width.

        let incentiveWrapper = $(".incentive-wrapper")
        incentiveWrapper.children().remove();

        let i = 0;
        for (let bid of incentives) {
            i += 1;

            let incentiveGame = $("<div>").addClass("incentive-game incentive-game" + i);
            let incentiveName = $("<div>").addClass("incentive-name incentive-name" + i);
            let incentiveProgressText = $("<div>").addClass("incentive-progress-text incentive-progress-text" + i);
            let incentiveProgress = $("<div>").addClass("incentive-progress incentive-progress" + i);

            let incentiveTotalValue = bid.goal;
            let incentiveProgressValue = bid.total;
            let incentiveTextConcat = currencyFormatter.format(incentiveProgressValue) + "/" + currencyFormatter.format(incentiveTotalValue);
            incentiveProgress.width((incentiveProgressValue / incentiveTotalValue) * bidProgressFullWidth);
            incentiveProgress.css('background-color', getProgressBarColor(incentiveProgressValue, incentiveTotalValue));

            incentiveGame.text(bid.game);
            incentiveName.text(bid.name);
            incentiveProgressText.text(incentiveTextConcat);

            // Build the container for this incentive.
            incentiveWrapper.append($("<div>").addClass("incentive").append(incentiveGame).append(incentiveName).append(
                $("<div>").addClass("incentive-footer").append(
                    $("<div>").addClass("incentive-progress-full").append(incentiveProgress)
                ).append(incentiveProgressText)));
        }

        let bidWarsWrapper = $(".bid-wars-wrapper");
        bidWarsWrapper.hide();
        if (bidWars.length > 0) {
            let bid = bidWars[0];

            let bidWarGame = $(".bid-war-game");
            let bidWarName = $(".bid-war-name");
            bidWarGame.text(bid.game);
            bidWarName.text(bid.name);

            let bidWarTotal = bid.total; /* All bids summed */

            // Show bid war options.
            let bidWrapper = $(".bid-wrapper")
            bidWrapper.children().remove();

            i = 0;
            for (let option of bid.options) {
                i += 1;

                let bidProgress = $("<div>").addClass("bid-progress bid-progress" + i);
                let bidName = $("<div>").addClass("bid-name bid-name" + i);
                let bidProgressText = $("<div>").addClass("bid-progress-text bid-progress-text" + i);
                let bidProgressValue = option.total;

                let progress;
                if (bidWarTotal) {
                    progress = bidProgressValue / bidWarTotal;
                } else {
                    progress = 0;
                }

                bidProgress.width(progress * bidProgressFullWidth);
                bidProgress.css('background-color', getProgressBarColor(bidProgressValue, bidWarTotal));
                bidName.text(option.name);
                bidProgressText.text(currencyFormatter.format(bidProgressValue));

                // Build the container for this bid.
                bidWrapper.append($("<div>").addClass("bid").append(
                    $("<div>").addClass("bid-footer").append(
                        $("<div>").addClass("bid-progress-full").append(bidProgress).append(bidName)
                    ).append(bidProgressText)));
            }

            // Show bid war.
            bidWarsWrapper.show();
            bid_war_size_done = false;
        }
    }
});
