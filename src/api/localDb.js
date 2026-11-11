import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAYLISTS_KEY = 'playlists';
const TRACKS_KEY = 'tracks';

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function getAll(key) {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
}

async function saveAll(key, items) {
    await AsyncStorage.setItem(key, JSON.stringify(items));
}

export const PlaylistAPI = {
    async list() {
        return await getAll(PLAYLISTS_KEY);
    },

    async create(data) {
        const items = await getAll(PLAYLISTS_KEY);
        const newItem = { id: generateId(), ...data };
        items.push(newItem);
        await saveAll(PLAYLISTS_KEY, items);
        return newItem;
    },

    async update(id, data) {
        const items = await getAll(PLAYLISTS_KEY);
        const index = items.findIndex((item) => item.id === id);
        if (index === -1) return null;
        items[index] = { ...items[index], ...data };
        await saveAll(PLAYLISTS_KEY, items);
        return items[index];
    },

    async delete(id) {
        const items = await getAll(PLAYLISTS_KEY);
        const nouveauxItems = items.filter((item) => item.id !== id);
        await saveAll(PLAYLISTS_KEY, nouveauxItems);
    },
};

export const TrackAPI = {
    async filter(playlistId) {
        const items = await getAll(TRACKS_KEY);
        return items.filter((item) => item.playlist_id === playlistId);
    },

    async create(data) {
        const items = await getAll(TRACKS_KEY);
        const newItem = { id: generateId(), ...data };
        items.push(newItem);
        await saveAll(TRACKS_KEY, items);
        return newItem;
    },

    async update(id, data) {
        const items = await getAll(TRACKS_KEY);
        const index = items.findIndex((item) => item.id === id);
        if (index === -1) return null;
        items[index] = { ...items[index], ...data };
        await saveAll(TRACKS_KEY, items);
        return items[index];
    },

    async delete(id) {
        const items = await getAll(TRACKS_KEY);
        const nouveauxItems = items.filter((item) => item.id !== id);
        await saveAll(TRACKS_KEY, nouveauxItems);
    },
};