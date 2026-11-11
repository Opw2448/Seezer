import { createContext, useContext, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { demarrerServiceArrierePlan } from '../services/backgroundPlayerService';


const PlayerContext = createContext(null) ;

export function PlayerProvider({ children }) {
    const soundRef = useRef(null);
    const queueRef = useRef([]); 
    const isShuffleRef = useRef(false);
    const isLoadingRef = useRef(false);

    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);

    const definirQueue = (tracks) => {
        queueRef.current = tracks;
    };

    const toggleShuffle = () => {
        isShuffleRef.current = !isShuffleRef.current;
        setIsShuffle(isShuffleRef.current);
    };

    const trouverMorceauSuivant = (trackActuelle) => {
        const queue = queueRef.current;
        console.log('Queue actuelle: ', queue.length, 'morceaux');
        if (!queue || queue.length === 0) return null;

        if (isShuffleRef.current) {
            const autres = queue.filter((t) => t.id !== trackActuelle.id);
            if (autres.length === 0) return null;
            const indexAleatoire = Math.floor(Math.random() * autres.length);
            return autres[indexAleatoire];
        }

        const indexActuel = queue.findIndex((t) => t.id === trackActuelle.id);
        if (indexActuel === -1 || indexActuel === queue.length - 1) return null;
        return queue[indexActuel + 1];
    };

    const jouerMorceauSuivant = () => {
        if (!currentTrack) return;
        const suivante = trouverMorceauSuivant(currentTrack)
        if (suivante) {
            jouerMorceau(suivante);
        }
    };

    const jouerMorceau = async (track) => {
        if (isLoadingRef.current) return;
        isLoadingRef.current = true

    const onPlaybackStatusUpdate = (status) => {
        if (status.isLoaded) {
            console.log('didJustFinish:', status.didJustFinish, '- position', status.positionMillis, '/', status.durationMillis);
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 0);
            setIsPlaying(status.isPlaying);

            if (status.didJustFinish) {
                const suivante = trouverMorceauSuivant(track);
                if(suivante) {
                    jouerMorceau(suivante);
                } else {
                    setIsPlaying(false);
                }
            }
        }
    };


        try {
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }

            if (currentTrack?.id === track.id && isPlaying) {
                setCurrentTrack(null);
                setIsPlaying(false);
                return;
            }

            await Audio.setAudioModeAsync({
                staysActiveInBackground: true,
                playsInSilentModeOS: true,
            });

            const { sound } = await Audio.Sound.createAsync(
                { uri: track.file_url },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );
            
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current =null;
            }

            soundRef.current = sound;
            setCurrentTrack(track);
            setIsPlaying(true);
            demarrerServiceArrierePlan();
        } finally {
            isLoadingRef.current = false;
        }
    };

    const togglePlayPause = async () => {
        if (!soundRef.current) return;
        if (isPlaying) {
            await soundRef.current.pauseAsync();
            setIsPlaying(false);
        } else {
            await soundRef.current.playAsync();
            setIsPlaying(true);
        }
    };

    return (
        <PlayerContext.Provider value={{ currentTrack, isPlaying, position, duration, isShuffle, jouerMorceau, jouerMorceauSuivant, togglePlayPause, definirQueue, toggleShuffle }}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    return useContext(PlayerContext);
}