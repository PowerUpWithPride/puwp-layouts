'use strict';
$(() => {
    // The bundle name where all the run information is pulled from.
    const donationBundle = 'speedcontrol-gdqtracker';

    // JQuery selectors.
    let donationTotalElement = $('#donation-total');

    // Update donation total when changed.  Animate the number increasing to the new total.
    let donationTotal = nodecg.Replicant('donationTotal', donationBundle);
    donationTotal.on('change', (newVal, oldVal) => {
        $({countNum: oldVal}).animate({
                countNum: newVal,
            },
            {
                duration: 1000,
                easing: 'swing',
                step: function() {
                    donationTotalElement.text(currencyFormatter.format(this.countNum));
                },
                complete: function() {
                    donationTotalElement.text(currencyFormatter.format(this.countNum));
                },
            }
        );
    });
});
