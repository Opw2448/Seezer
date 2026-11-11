import backgroundService from "react-native-background-actions";


const tacheDeFond = async (taskData) => {
    const { delay } = taskData;

    await new Promise(async () => {
        for (let i = 0; backgroundService.isRunning(); i++) {
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    });
};

const options = {
    taskName: 'Seezer',
    taskTitle: 'Seezer',
    taskDesc: 'Lecture en cours',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#0a0a0f',
    linkURI: 'seezer://',
    foregroundServiceType: ['mediaPlayback'],
    parameters: {
        delay: 1000,
    },
};

export const demarrerServiceArrierePlan = async () => {
    try {
        await backgroundService.start(tacheDeFond, options);
    } catch (erreur) {
        console.log('Erreur denarrage service arriere-plan :', erreur);
    }
};

export const arreterServiceArrierePlan = async () => {
    await backgroundService.stop();
};