const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function withForegroundType(config) {
    return withAndroidManifest(config, (config) => {
        const application = config.modResults.manifest.application[0];

        if (!application.service) {
            application.service = [];
        }

        application.service.push({
            $: {
                'android:name': 'com.asterinet.react.bgactions.RNBackgroundActionsTask',
                'android:foregroundServiceType': 'mediaPlayback',
            },
        });

        return config;
    });
};