/**
 * Therapist Service (Data Access & Business Logic Layer)
 * Mengelola pendaftaran terapis baru dan penghapusan dengan proteksi jadwal aktif.
 */

import { STORAGE_KEYS, SESSION_STATUS } from "../config/constants.js";
import { StorageAdapter } from "../database/storage-adapter.js";

export const TherapistService = {
  /**
   * Mendaftarkan terapis baru ke dalam sistem
   * @param {object} payload - { name, specialty, phone }
   */
  registerTherapist(payload) {
    const timestamp = Date.now().toString().slice(-3);
    const newTherapist = {
      id: `THR-${timestamp}`,
      name: payload.name.trim(),
      specialty: payload.specialty,
      phone: payload.phone.trim(),
    };

    StorageAdapter.insert(STORAGE_KEYS.THERAPISTS, newTherapist);
    return { success: true, data: newTherapist };
  },

  /**
   * Menghapus data terapis (Ditolak jika terapis masih memiliki jadwal aktif)
   * @param {string} therapistId
   */
  deleteTherapist(therapistId) {
    const schedules = StorageAdapter.get(STORAGE_KEYS.SCHEDULES, []);

    // Cek apakah terapis masih punya jadwal berstatus SCHEDULED atau CHECKED_IN
    const hasActiveSchedule = schedules.some(
      (s) =>
        s.therapistId === therapistId &&
        (s.status === SESSION_STATUS.SCHEDULED.id ||
          s.status === SESSION_STATUS.CHECKED_IN.id),
    );

    if (hasActiveSchedule) {
      return {
        success: false,
        error:
          "Tidak dapat menghapus: Terapis ini masih memiliki jadwal sesi aktif yang belum selesai.",
      };
    }

    const therapists = StorageAdapter.get(STORAGE_KEYS.THERAPISTS, []);
    const filtered = therapists.filter((t) => t.id !== therapistId);
    StorageAdapter.set(STORAGE_KEYS.THERAPISTS, filtered);

    return { success: true };
  },
};
