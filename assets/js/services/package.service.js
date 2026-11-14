/**
 * Package Service (Data Access & Business Logic Layer)
 * Mengelola aktivasi paket terapi baru, perpanjangan (Top-Up), dan penyesuaian kuota.
 */

import { STORAGE_KEYS, PACKAGE_TIERS } from '../config/constants.js';
import { StorageAdapter } from '../database/storage-adapter.js';

export const PackageService = {
    /**
     * Membuat paket terapi baru untuk pasien anak yang sudah terdaftar
     */
    createPackage({ patientId, serviceId, tierId }) {
        const tier = PACKAGE_TIERS.find(t => t.id === tierId) || PACKAGE_TIERS[0];
        const newPackage = {
            id: `PKG-${Date.now().toString().slice(-4)}`,
            patientId,
            serviceId,
            packageName: tier.name,
            totalQuota: tier.totalQuota,
            usedQuota: 0,
            remainingQuota: tier.totalQuota,
            status: 'ACTIVE'
        };

        return StorageAdapter.insert(STORAGE_KEYS.PACKAGES, newPackage);
    },

    /**
     * Top-Up / Perpanjangan Kuota Paket yang sudah ada
     * Menambahkan kuota baru ke sisa kuota saat ini dan mereset hitungan sesi terpakai ke siklus baru
     */
    topUpPackage(packageId, tierId) {
        const packages = StorageAdapter.get(STORAGE_KEYS.PACKAGES, []);
        const pkg = packages.find(p => p.id === packageId);
        const tier = PACKAGE_TIERS.find(t => t.id === tierId);

        if (!pkg || !tier) return null;

        const newRemaining = (pkg.remainingQuota || 0) + tier.totalQuota;
        const newTotal = newRemaining; // Siklus baru dimulai dari total sisa + top-up

        return StorageAdapter.updateById(STORAGE_KEYS.PACKAGES, packageId, {
            packageName: tier.name,
            totalQuota: newTotal,
            usedQuota: 0,
            remainingQuota: newRemaining,
            status: 'ACTIVE'
        });
    },

    /**
     * Koreksi manual pemakaian kuota (+1 atau -1 sesi) oleh Admin jika terjadi kesalahan input
     */
    adjustQuota(packageId, deltaRemaining) {
        const packages = StorageAdapter.get(STORAGE_KEYS.PACKAGES, []);
        const pkg = packages.find(p => p.id === packageId);
        if (!pkg) return null;

        const newRemaining = Math.max(0, Math.min(pkg.totalQuota, pkg.remainingQuota + deltaRemaining));
        const newUsed = Math.max(0, pkg.totalQuota - newRemaining);

        return StorageAdapter.updateById(STORAGE_KEYS.PACKAGES, packageId, {
            usedQuota: newUsed,
            remainingQuota: newRemaining,
            status: newRemaining === 0 ? 'EXHAUSTED' : 'ACTIVE'
        });
    }
};