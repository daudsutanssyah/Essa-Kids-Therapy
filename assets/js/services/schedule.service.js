/**
 * Schedule Service (Data Access & Business Logic Layer)
 * Menangani pembuatan jadwal sesi, validasi anti-bentrok (Terapis/Ruangan/Pasien), dan pembatalan sesi.
 */

import { STORAGE_KEYS, SESSION_STATUS } from "../config/constants.js";
import { StorageAdapter } from "../database/storage-adapter.js";

export const ScheduleService = {
  /**
   * Memeriksa apakah ada bentrok jadwal pada tanggal & jam yang dipilih
   * (Mengabaikan jadwal yang berstatus CANCELLED)
   */
  checkConflict({ date, timeSlot, therapistId, room, patientId }) {
    const schedules = StorageAdapter.get(STORAGE_KEYS.SCHEDULES, []);
    const patients = StorageAdapter.get(STORAGE_KEYS.PATIENTS, []);
    const therapists = StorageAdapter.get(STORAGE_KEYS.THERAPISTS, []);

    // Ambil semua jadwal aktif di tanggal dan jam yang sama
    const activeAtSlot = schedules.filter(
      (s) =>
        s.date === date &&
        s.timeSlot === timeSlot &&
        s.status !== SESSION_STATUS.CANCELLED.id,
    );

    // 1. Cek Bentrok Terapis
    if (therapistId) {
      const therapistConflict = activeAtSlot.find(
        (s) => s.therapistId === therapistId,
      );
      if (therapistConflict) {
        const therapist = therapists.find((t) => t.id === therapistId);
        const patient = patients.find(
          (p) => p.id === therapistConflict.patientId,
        );
        return {
          hasConflict: true,
          type: "THERAPIST",
          message: `${therapist?.name || "Terapis"} sudah memiliki jadwal dengan pasien ${patient?.nickname || ""} di jam ${timeSlot}.`,
        };
      }
    }

    // 2. Cek Bentrok Ruangan
    if (room) {
      const roomConflict = activeAtSlot.find((s) => s.room === room);
      if (roomConflict) {
        const patient = patients.find((p) => p.id === roomConflict.patientId);
        return {
          hasConflict: true,
          type: "ROOM",
          message: `${room} sedang digunakan oleh pasien ${patient?.nickname || ""} pada jam ${timeSlot}.`,
        };
      }
    }

    // 3. Cek Bentrok Pasien (Pasien yang sama tidak bisa ikut 2 terapi di jam yang sama)
    if (patientId) {
      const patientConflict = activeAtSlot.find(
        (s) => s.patientId === patientId,
      );
      if (patientConflict) {
        return {
          hasConflict: true,
          type: "PATIENT",
          message: `Pasien anak ini sudah memiliki jadwal sesi lain pada jam ${timeSlot}.`,
        };
      }
    }

    return { hasConflict: false, type: null, message: "" };
  },

  /**
   * Menyimpan jadwal sesi terapi baru setelah lolos validasi anti-bentrok
   */
  createSchedule(payload) {
    const conflict = this.checkConflict(payload);
    if (conflict.hasConflict) {
      return { success: false, error: conflict.message };
    }

    // Pastikan paket yang dipilih masih memiliki sisa kuota > 0
    const packages = StorageAdapter.get(STORAGE_KEYS.PACKAGES, []);
    const selectedPkg = packages.find((p) => p.id === payload.packageId);
    if (!selectedPkg || selectedPkg.remainingQuota <= 0) {
      return {
        success: false,
        error:
          "Paket terapi yang dipilih sudah kehabisan kuota (0 sesi). Silakan Top-Up terlebih dahulu.",
      };
    }

    const newSchedule = {
      id: `SCH-${Date.now().toString().slice(-4)}`,
      date: payload.date,
      timeSlot: payload.timeSlot,
      patientId: payload.patientId,
      therapistId: payload.therapistId,
      packageId: payload.packageId,
      serviceId: payload.serviceId,
      room: payload.room,
      status: SESSION_STATUS.SCHEDULED.id,
    };

    StorageAdapter.insert(STORAGE_KEYS.SCHEDULES, newSchedule);
    return { success: true, data: newSchedule };
  },

  /**
   * Membatalkan jadwal sesi (Mengubah status menjadi CANCELLED agar slot Terapis & Ruangan kembali kosong)
   */
  cancelSchedule(scheduleId) {
    return StorageAdapter.updateById(STORAGE_KEYS.SCHEDULES, scheduleId, {
      status: SESSION_STATUS.CANCELLED.id,
    });
  },
};
