import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { colors } from '../lib/theme';
import { TrackAPI } from '../api/localDb';
import * as DocumentPicker from 'expo-document-picker';
import { usePlayer } from '../context/PlayerContext';


export default function PlaylistDetailScreen({ route, navigation }) {
    const { playlist } = route.params;
    const [tracks, setTracks] = useState([]);
    const { currentTrack, isPlaying, jouerMorceau, definirQueue } = usePlayer();
    const [trackARenommer, setTrackARenommer] = useState(null);
    const [nouveauNomTrack, setNouveauNomTrack] = useState('');
    const [trackPourActions, setTrackPourActions] = useState(null);

    const chargerTracks = async () => {
        const data = await TrackAPI.filter(playlist.id);
        setTracks(data);
    };

    useEffect(() => {
        chargerTracks();
    }, []);

    useEffect(() => {
        definirQueue(tracks);
    }, [tracks]);

    useEffect(() => {
        navigation.setOptions({
            title: playlist.name,
            headerTitleAlign: 'left',
            headerTitleStyle: {
                color: colors.emoji,
            },
        });
    }, [playlist]);

    const importerMorceau = async () => {
        const resultat = await DocumentPicker.getDocumentAsync({ type: ['audio/*', 'video/mp4']});

        if (resultat.canceled) return;

        const fichier = resultat.assets[0];

        await TrackAPI.create({
            name: fichier.name.replace(/\.[^.]+$/,''),
            file_url: fichier.uri,
            playlist_id: playlist.id,
        });

        chargerTracks();
    };

    const supprimerTrack = async (id) => {
        await TrackAPI.delete(id);
        chargerTracks();
    };

    const gererAppuiLongTrack = (track) => {
        setTrackPourActions(track);
    };

    const validerRenommageTrack = async () => {
        await TrackAPI.update(trackARenommer.id, { name: nouveauNomTrack });
        setTrackARenommer(null);
        chargerTracks();
    };


    return (
        <View style={styles.container}>
                <TouchableOpacity style={styles.bouton} onPress={importerMorceau}>
                    <Text style={styles.boutonTexte}>+ Import a song</Text>
                </TouchableOpacity>
            {tracks.length === 0 ? (
                <Text style={styles.sousTitre}>No song for the moment</Text>
            ) : (
                tracks.map((track) => (
                    <Text
                    key={track.id}
                    style={styles.item}
                    onPress={() => jouerMorceau(track)}
                    onLongPress={() => gererAppuiLongTrack(track)}
                    >
                        {currentTrack?.id === track.id && isPlaying ? '🎵  ►  ' : ''}{track.name}
                    </Text>
                ))
            )}
            <Modal visible={trackPourActions !== null} transparent animationType='fade'>
                <TouchableOpacity
                style={styles.actionsFond}
                activeOpacity={1}
                onPress={() => setTrackPourActions(null)}
                >
                    <View style={styles.actionsBoite}>
                        <Text style={styles.actionsTitre} numberOfLines={1}>{trackPourActions?.name}</Text>

                        <TouchableOpacity
                        style={styles.actionItem}
                        onPress={() => {
                            setTrackARenommer(trackPourActions);
                            setNouveauNomTrack(trackPourActions.name);
                            setTrackPourActions(null);
                        }}
                        >
                            <Text style={styles.actionItemTexte}>Rename</Text>
                        </TouchableOpacity>

                        <View style={styles.actionSeparator} />

                        <TouchableOpacity
                        style={styles.actionItem}
                        onPress={() => {
                            supprimerTrack(trackPourActions.id);
                            setTrackPourActions(null);
                        }}
                        >
                            <Text style={styles.actionItemTexteDestructive}>Delete</Text>
                        </TouchableOpacity>

                        <View style={styles.actionSeparator} />

                        <TouchableOpacity
                        style={styles.actionItem}
                        onPress={() => setTrackPourActions(null)}
                        >
                            <Text style={styles.actionItemTexteEnd}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
            <Modal visible={trackARenommer !== null} transparent animationType='fade'>
                <View style={styles.modalFond}>
                    <View style={styles.modalBoite}>
                        <TextInput
                        style={styles.modalInput}
                        value={nouveauNomTrack}
                        onChangeText={setNouveauNomTrack}
                        />
                        <TouchableOpacity style={styles.bouton} onPress={validerRenommageTrack}>
                            <Text style={styles.boutonTexte}>Save</Text>
                        </TouchableOpacity> 
                        <TouchableOpacity onPress={() => setTrackARenommer(null)}>
                            <Text style={styles.item}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    titre: {
        color: colors.emoji,
        fontSize: 24,
        fontWeight: 'bold',
    },
    sousTitre: {
        color: colors.mutedForeground,
        fontSize: 14,
        marginTop: 8,
    },
    item: {
        color: colors.foreground,
        fontSize: 18,
        marginBottom: 6,
    },
    bouton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    boutonTexte: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 20,
    },
    modalFond: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0,6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBoite: {
        backgroundColor: colors.card,
        padding: 20,
        borderRadius: 16,
        width: '80%',
        gap: 12,
    },
    modalInput: {
        backgroundColor: colors.secondary,
        color: colors.foreground,
        padding: 12,
        borderRadius: 8,
    },
    actionsFond: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0,6)',
        justifyContent: 'flex-end',
    },
    actionsBoite: {
        backgroundColor: colors.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 12,
        paddingBottom: 32,
    },
    actionsTitre: {
        color: colors.mutedForeground,
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    actionItem: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    actionItemTexte: {
        color: colors.primary,
        fontSize: 23,
    },
    actionItemTexteEnd: {
        color: colors.foreground,
        fontSize: 17,
    },
    actionItemTexteDestructive: {
        color: colors.destructive,
        fontSize: 20,
        fontWeight: '600',
    },
    actionSeparator: {
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: 20,
    },
});