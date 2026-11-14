/**
 * Utility Format Tanggal & Kalkulasi Usia Tumbuh Kembang Anak
 * Pure functions tanpa ketergantungan pada framework apa pun.
 */

export const DateFormatter = {
    /**
     * Menghitung usia detail anak dalam Tahun dan Bulan dari tanggal lahir (YYYY-MM-DD)
     * Contoh output: "4 Thn 6 Bln"
     */
    calculateChildAge(birthDateString) {
        if (!birthDateString) return '-';
        
        const birth = new Date(birthDateString);
        const today = new Date();
        
        if (isNaN(birth.getTime())) return '-';

        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();

        if (today.getDate() < birth.getDate()) {
            months--;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        if (years < 0) return 'Baru Lahir';
        if (years === 0) return `${months} Bulan`;
        return `${years} Thn ${months} Bln`;
    },

    /**
     * Mengubah tanggal YYYY-MM-DD menjadi format Indonesia (contoh: 14 Mei 2021)
     */
    toIndonesianDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(date);
    }
};