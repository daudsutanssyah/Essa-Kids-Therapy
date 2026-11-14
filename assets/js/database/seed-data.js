/**
 * Seed Data (Data Dummy Awal)
 * Menggunakan tanggal dinamis hari ini agar jadwal langsung tampil aktif saat diuji.
 */

import { STORAGE_KEYS, THERAPY_SERVICES, SESSION_STATUS } from '../config/constants.js';
import { StorageAdapter } from './storage-adapter.js';

// Helper untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD (Waktu Lokal)
const getTodayISO = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().split('T')[0];
};

export const getInitialSeedData = () => {
    const today = getTodayISO();

    return {
        therapists: [
            {
                id: 'THR-01',
                name: 'Kak Nadia Putri, S.Tr.Kes',
                specialty: THERAPY_SERVICES.SENSORY.id,
                phone: '0812-3456-7001'
            },
            {
                id: 'THR-02',
                name: 'Kak Bima Pratama, A.Md.TW',
                specialty: THERAPY_SERVICES.SPEECH.id,
                phone: '0812-3456-7002'
            },
            {
                id: 'THR-03',
                name: 'Kak Rini Kartika, S.Fis',
                specialty: THERAPY_SERVICES.PHYSIO.id,
                phone: '0812-3456-7003'
            },
            {
                id: 'THR-04',
                name: 'Kak Dinda Lestari, A.Md.OT',
                specialty: THERAPY_SERVICES.OCCUPATIONAL.id,
                phone: '0812-3456-7004'
            }
        ],

        patients: [
            {
                id: 'PAT-1001',
                fullName: 'Arkaiyan Putra Pratama',
                nickname: 'Arka',
                birthDate: '2021-05-14',
                gender: 'L',
                parentName: 'Bpk. Hendra Pratama',
                parentPhone: '0811-7890-1122',
                diagnosisNotes: 'Speech delay & hipersensitivitas taktil ringan',
                registeredAt: '2026-01-10'
            },
            {
                id: 'PAT-1002',
                fullName: 'Callysta Aurelia',
                nickname: 'Cally',
                birthDate: '2022-08-22',
                gender: 'P',
                parentName: 'Ibu Maya Sari',
                parentPhone: '0813-4567-8899',
                diagnosisNotes: 'Keterlambatan motorik kasar (keseimbangan berjalan)',
                registeredAt: '2026-02-05'
            },
            {
                id: 'PAT-1003',
                fullName: 'Kenzo Alfarizqi',
                nickname: 'Kenzo',
                birthDate: '2020-11-03',
                gender: 'L',
                parentName: 'Ibu Rina Wijaya',
                parentPhone: '0812-9988-7766',
                diagnosisNotes: 'Gangguan konsentrasi & koordinasi motorik halus (ADL)',
                registeredAt: '2026-02-18'
            }
        ],

        packages: [
            {
                id: 'PKG-5001',
                patientId: 'PAT-1001',
                serviceId: THERAPY_SERVICES.SPEECH.id,
                packageName: 'Paket Intensif (8 Sesi)',
                totalQuota: 8,
                usedQuota: 3,
                remainingQuota: 5,
                status: 'ACTIVE'
            },
            {
                id: 'PKG-5002',
                patientId: 'PAT-1002',
                serviceId: THERAPY_SERVICES.PHYSIO.id,
                packageName: 'Paket Reguler (4 Sesi)',
                totalQuota: 4,
                usedQuota: 3,
                remainingQuota: 1, // Indikator kuota hampir habis (kritis)
                status: 'ACTIVE'
            },
            {
                id: 'PKG-5003',
                patientId: 'PAT-1003',
                serviceId: THERAPY_SERVICES.OCCUPATIONAL.id,
                packageName: 'Paket Optimal (12 Sesi)',
                totalQuota: 12,
                usedQuota: 4,
                remainingQuota: 8,
                status: 'ACTIVE'
            }
        ],

        schedules: [
            {
                id: 'SCH-9001',
                date: today,
                timeSlot: '09:00 - 10:00',
                patientId: 'PAT-1001',
                therapistId: 'THR-02',
                packageId: 'PKG-5001',
                serviceId: THERAPY_SERVICES.SPEECH.id,
                room: 'Ruang Wicara B',
                status: SESSION_STATUS.COMPLETED.id
            },
            {
                id: 'SCH-9002',
                date: today,
                timeSlot: '10:30 - 11:30',
                patientId: 'PAT-1002',
                therapistId: 'THR-03',
                packageId: 'PKG-5002',
                serviceId: THERAPY_SERVICES.PHYSIO.id,
                room: 'Gym Fisioterapi A',
                status: SESSION_STATUS.CHECKED_IN.id
            },
            {
                id: 'SCH-9003',
                date: today,
                timeSlot: '13:30 - 14:30',
                patientId: 'PAT-1003',
                therapistId: 'THR-04',
                packageId: 'PKG-5003',
                serviceId: THERAPY_SERVICES.OCCUPATIONAL.id,
                room: 'Ruang Okupasi C',
                status: SESSION_STATUS.SCHEDULED.id
            }
        ],

        evaluations: [
            {
                id: 'EVL-7001',
                scheduleId: 'SCH-9001',
                patientId: 'PAT-1001',
                therapistId: 'THR-02',
                serviceId: THERAPY_SERVICES.SPEECH.id,
                date: today,
                moodRating: 'Kooperatif & Ceria',
                activitySummary: 'Latihan artikulasi fonem bilabial (/p/, /b/, /m/) menggunakan kartu bergambar dan meniup gelembung.',
                progressNotes: 'Anak mampu meniru 6 dari 10 kata sederhana dengan kontak mata bertahan selama 15 detik.',
                homeRecommendation: 'Ajak anak menyebutkan nama benda saat makan bersama di rumah minimal 10 menit sehari.'
            }
        ]
    };
};

/**
 * Mengisi localStorage dengan data awal jika belum pernah diinisialisasi
 * @param {boolean} force - Paksa timpa seluruh data dengan data awal
 */
export const initializeDatabase = (force = false) => {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);

    if (!isInitialized || force) {
        const seed = getInitialSeedData();
        StorageAdapter.set(STORAGE_KEYS.THERAPISTS, seed.therapists);
        StorageAdapter.set(STORAGE_KEYS.PATIENTS, seed.patients);
        StorageAdapter.set(STORAGE_KEYS.PACKAGES, seed.packages);
        StorageAdapter.set(STORAGE_KEYS.SCHEDULES, seed.schedules);
        StorageAdapter.set(STORAGE_KEYS.EVALUATIONS, seed.evaluations);
        localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
        return true;
    }
    return false;
};