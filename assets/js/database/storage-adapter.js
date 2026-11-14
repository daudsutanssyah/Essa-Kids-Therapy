/**
 * Storage Adapter (Abstraksi LocalStorage)
 * Menangani serialisasi JSON dan mencegah crash jika data korup.
 */

export const StorageAdapter = {
    /**
     * Mengambil koleksi data dari localStorage
     * @param {string} key 
     * @param {any} defaultValue 
     */
    get(key, defaultValue = []) {
        try {
            const rawData = localStorage.getItem(key);
            return rawData ? JSON.parse(rawData) : defaultValue;
        } catch (error) {
            console.error(`[StorageAdapter] Gagal membaca key "${key}":`, error);
            return defaultValue;
        }
    },

    /**
     * Menyimpan koleksi data ke localStorage
     * @param {string} key 
     * @param {any} data 
     */
    set(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`[StorageAdapter] Gagal menyimpan key "${key}":`, error);
            return false;
        }
    },

    /**
     * Menambahkan satu item baru ke dalam array koleksi
     * @param {string} key 
     * @param {object} newItem 
     */
    insert(key, newItem) {
        const list = this.get(key, []);
        list.unshift(newItem); // Data terbaru di urutan paling atas
        this.set(key, list);
        return newItem;
    },

    /**
     * Memperbarui item berdasarkan ID di dalam array koleksi
     * @param {string} key 
     * @param {string} id 
     * @param {object} updatedFields 
     */
    updateById(key, id, updatedFields) {
        const list = this.get(key, []);
        const index = list.findIndex(item => item.id === id);
        if (index !== -1) {
            list[index] = { ...list[index], ...updatedFields };
            this.set(key, list);
            return list[index];
        }
        return null;
    },

    /**
     * Menghapus seluruh data simulasi klinik
     */
    clearAll() {
        localStorage.clear();
    }
};