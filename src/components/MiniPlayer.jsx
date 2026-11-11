import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../lib/theme';
import { usePlayer } from '../context/PlayerContext';

export default function MiniPlayer() {
    const { currentTrack, isPlaying, position, duration, isShuffle, togglePlayPause, toggleShuffle, jouerMorceauSuivant } = usePlayer();

    if (!currentTrack) return null;

    const pourcentage = duration > 0 ? (position / duration) * 100 : 0;

    return (
        <View style={styles.container}>
            <View style={styles.barreFond}>
                <View style={[styles.barreProgres, { width: `${pourcentage}%` }]} />
            </View>
            <Text style={styles.nom} numberOfLines={1}>{currentTrack.name}</Text>
            <TouchableOpacity onPress={toggleShuffle}>
                <Text style={isShuffle ? styles.boutonShuffleActif : styles.boutonShuffle}>🔀</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePlayPause}>
                <Text style={styles.bouton}>{isPlaying ? '⏸️' : '▶️'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={jouerMorceauSuivant}>
                <Text style={styles.bouton}>⏭️</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    nom: {
        color: colors.emoji,
        fontSize: 20,
        fontWeight: '600',
        flex: 1,
    },
    bouton: {
        color: colors.primary,
        fontWeight: '700',
        marginLeft: 20,
        fontSize: 25,
    },
    barreFond: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: colors.secondary,
    },
    barreProgres : {
        height: 5,
        backgroundColor: colors.primary,
    },
    boutonShuffle: {
        fontSize: 25,
        opacity: 0.4,
    },
    boutonShuffleActif: {
        fontSize: 25,
        opacity: 1,
    },
});