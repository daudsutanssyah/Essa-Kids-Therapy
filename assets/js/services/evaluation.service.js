/**
 * Evaluation Service (Data Access & Business Logic Layer)
 * Mengelola penyimpanan catatan evaluasi perkembangan anak dan penyelesaian status sesi terapi.
 */

import { STORAGE_KEYS, SESSION_STATUS } from "../config/constants.js";
import { StorageAdapter } from "../database/storage-adapter.js";

export const EvaluationService = {
  /**
   * Menyimpan hasil evaluasi perkembangan sesi terapi dan menandai jadwal sebagai COMPLETED
   * @param {object} payload
   */
  saveEvaluation(payload) {
    const schedules = StorageAdapter.get(STORAGE_KEYS.SCHEDULES, []);
    const targetSchedule = schedules.find((s) => s.id === payload.scheduleId);

    if (!targetSchedule) {
      return { success: false, error: "Data jadwal sesi tidak ditemukan." };
    }

    const newEvaluation = {
      id: `EVL-${Date.now().toString().slice(-4)}`,
      scheduleId: targetSchedule.id,
      patientId: targetSchedule.patientId,
      therapistId: targetSchedule.therapistId,
      serviceId: targetSchedule.serviceId,
      date: targetSchedule.date,
      moodRating: payload.moodRating,
      activitySummary: payload.activitySummary.trim(),
      progressNotes: payload.progressNotes.trim(),
      homeRecommendation: payload.homeRecommendation.trim(),
    };

    // 1. Cek apakah evaluasi untuk jadwal ini sudah pernah diisi sebelumnya (Update vs Insert)
    const evaluations = StorageAdapter.get(STORAGE_KEYS.EVALUATIONS, []);
    const existingIndex = evaluations.findIndex(
      (e) => e.scheduleId === targetSchedule.id,
    );

    if (existingIndex !== -1) {
      evaluations[existingIndex] = {
        ...evaluations[existingIndex],
        ...newEvaluation,
      };
      StorageAdapter.set(STORAGE_KEYS.EVALUATIONS, evaluations);
    } else {
      StorageAdapter.insert(STORAGE_KEYS.EVALUATIONS, newEvaluation);
    }

    // 2. Ubah status jadwal menjadi COMPLETED (Selesai Dievaluasi)
    StorageAdapter.updateById(STORAGE_KEYS.SCHEDULES, targetSchedule.id, {
      status: SESSION_STATUS.COMPLETED.id,
    });

    return { success: true, data: newEvaluation };
  },
};
