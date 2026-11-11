import { useState, useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Modal, TextInput } from 'react-native';
import { colors } from '../lib/theme';
import { PlaylistAPI } from '../api/localDb';


export default function HomeScreen({ navigation }) {
  const [playlists, setPlaylists] = useState([]);
  const [playlistARenommer, setPlaylistARenommer] = useState(null);
  const [nouveauNom, setNouveauNom] = useState('');
  const [playlistPourActions, setPlaylistPourActions] = useState(null);


  const chargerPlaylists = async () => {
    const data = await PlaylistAPI.list();
    console.log("Playlists loaded", data);
    setPlaylists(data);
  };

  useEffect(() => {
    chargerPlaylists();
  }, []);

  const ajouterPlaylist = async () => {
    console.log("Button pressed");
    try {
      const nouvelle = await PlaylistAPI.create({ name: `Playlist ${playlists.length + 1}`});
      console.log("Playlist created :", nouvelle);
      chargerPlaylists();
    } catch (erreur) {
      console.log("Error when create :", erreur);
    }
  };

  const supprimerPlaylist = async (id) => {
    await PlaylistAPI.delete(id);
    chargerPlaylists();
  };

  const gererAppuiLong = (playlist) => {
    setPlaylistPourActions(playlist);
  };

  const validerRenommage = async () => {
    console.log("Enregistrer appuye, playlistARenommer =", playlistARenommer, "nouveauNom =", nouveauNom);
    try {
      await PlaylistAPI.update(playlistARenommer.id, { name: nouveauNom});
      console.log("Renommage reussi");
      setPlaylistARenommer(null);
      chargerPlaylists();
    } catch (erreur) {
      console.log("Erreur de renommage :", erreur);
    }
  };

  return (
    <View style={styles.container}>
        <Text style={styles.titre}>Seezer</Text>

        <TouchableOpacity style={styles.bouton} onPress={ajouterPlaylist}>
          <Text style={styles.boutonTexte}>+ Add a Playlist</Text>
        </TouchableOpacity>

        {playlists.map((playlist) => (
          <TouchableOpacity
        key={playlist.id}
        onPress={() => navigation.navigate('PlaylistDetail', { playlist } )}
        onLongPress={() => gererAppuiLong(playlist)}
        >
            <Text style={styles.item}>{playlist.name}</Text>
          </TouchableOpacity>
        ))}
        <Modal visible={playlistPourActions !== null} transparent animationType='fade'>
          <TouchableOpacity
          style={styles.actionsFond}
          activeOpacity={1}
          onPress={() => setPlaylistPourActions(null)}
          >
            <View style={styles.actionsBoite}>
              <Text style={styles.actionsTitre} numberOfLines={1}>{playlistPourActions?.name}</Text>

              <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                setPlaylistARenommer(playlistPourActions);
                setNouveauNom(playlistPourActions.name);
                setPlaylistPourActions(null);
              }}
              >
                <Text style={styles.actionItemTexte}>Rename</Text>
              </TouchableOpacity>

              <View style={styles.actionSeparator} />

              <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                supprimerPlaylist(playlistPourActions.id);
                setPlaylistPourActions(null);
              }}
              >
                <Text style={styles.actionItemTexteDestructive}>Delete</Text>
                </TouchableOpacity>

                <View style={styles.actionSeparator} />

                <TouchableOpacity
                style={styles.actionItem}
                onPress={() => setPlaylistPourActions(null)}
                >
                  <Text style={styles.actionItemTexteEnd}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
        <Modal visible={playlistARenommer !== null} transparent animationType='fade'>
          <View style={styles.modalFond}>
            <View style={styles.modalBoite}>
              <TextInput
              style={styles.modalInput}
              value={nouveauNom}
              onChangeText={setNouveauNom}
              />
              <TouchableOpacity style={styles.bouton} onPress={validerRenommage}>
                <Text style={styles.boutonTexte}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPlaylistARenommer(null)}>
                <Text style={styles.item}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingTop: 60,
    gap: 16,
  },
  titre: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: 'bold',
  },
  bouton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  boutonTexte: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
  },
  item: {
    color: colors.foreground,
    fontSize: 18,
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