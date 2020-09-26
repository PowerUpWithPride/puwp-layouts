const nodecg = require('./utils/nodecg-api-context').get();

// Current layout info stored in here. Defaults to the first one in the list above.
const currentTheme = nodecg.Replicant('currentTheme', {defaultValue: "puwp"});

// Message used to change layout, usually manually.
nodecg.listenFor('changeTheme', (name, callback) => {
    // Set replicant to have the correct information for use elsewhere.
    currentTheme.value = name;
    nodecg.log.info('Theme changed to %s.', name);
    if (callback) {
        callback();
    }
});
