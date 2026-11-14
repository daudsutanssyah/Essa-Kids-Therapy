/**
 * Patient Service (Data Access & Business Logic Layer)
 * Mengelola pendaftaran pasien anak dan integrasi paket perdananya.
 */

import { STORAGE_KEYS, PACKAGE_TIERS } from '../config/constants.js';
import { StorageAdapter } from '../database/storage-adapter.js';

export const PatientService = {
    /**
     * Mendaftarkan pasien anak baru beserta opsional paket terapi perdana
     * @param {object} payload - Data input dari form pendaftaran
     */
    registerNewPatient(payload) {
        const timestamp = Date.now().toString().slice(-4);
        const newPatientId = `PAT-${timestamp}`;
        const todayISO = new Date().toISOString().split('T')[0];

        const newPatient = {
            id: newPatientId,
            fullName: payload.fullName.trim(),
            nickname: payload.nickname.trim(),
            birthDate: payload.birthDate,
            gender: payload.gender || 'L',
            parentName: payload.parentName.trim(),
            parentPhone: payload.parentPhone.trim(),
            diagnosisNotes: payload.diagnosisNotes.trim() || 'Belum ada catatan observasi awal',
            registeredAt: todayISO
        };

        // 1. Simpan profil pasien ke localStorage
        StorageAdapter.insert(STORAGE_KEYS.PATIENTS, newPatient);

        // 2. Jika saat pendaftaran langsung memilih layanan & paket kuota awal
        if (payload.initialServiceId && payload.initialPackageTierId) {
            const tier = PACKAGE_TIERS.find(t => t.id === payload.initialPackageTierId) || PACKAGE_TIERS[0];
            
            const newPackage = {
                id: `PKG-${Date.now().toString().slice(-4)}`,
                patientId: newPatientId,
                serviceId: payload.initialServiceId,
                packageName: tier.name,
                totalQuota: tier.totalQuota,
                usedQuota: 0,
                remainingQuota: tier.totalQuota,
                status: 'ACTIVE'
            };

            StorageAdapter.insert(STORAGE_KEYS.PACKAGES, newPackage);
        }

        return newPatient;
    }
};