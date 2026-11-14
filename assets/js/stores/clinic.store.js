/**
 * Global Store Operasional Klinik (Alpine.store('clinic'))
 * Mengelola state reaktif penuh untuk Admin & Terapis.
 */

import {
  STORAGE_KEYS,
  THERAPY_SERVICES,
  SESSION_STATUS,
  TIME_SLOTS,
  CLINIC_ROOMS,
} from "../config/constants.js";
import { StorageAdapter } from "../database/storage-adapter.js";
import { initializeDatabase } from "../database/seed-data.js";
import { DateFormatter } from "../utils/date-formatter.js";
import { PatientService } from "../services/patient.service.js";
import { TherapistService } from "../services/therapist.service.js";
import { PackageService } from "../services/package.service.js";
import { ScheduleService } from "../services/schedule.service.js";
import { EvaluationService } from "../services/evaluation.service.js";

export const createClinicStore = () => ({
  patients: [],
  therapists: [],
  packages: [],
  schedules: [],
  evaluations: [],
  timeSlots: TIME_SLOTS,
  clinicRooms: CLINIC_ROOMS,
  activeTherapistId: localStorage.getItem(STORAGE_KEYS.ACTIVE_USER) || "THR-03",

  init() {
    initializeDatabase(false);
    this.syncFromStorage();
  },

  syncFromStorage() {
    this.therapists = StorageAdapter.get(STORAGE_KEYS.THERAPISTS, []);
    this.patients = StorageAdapter.get(STORAGE_KEYS.PATIENTS, []);
    this.packages = StorageAdapter.get(STORAGE_KEYS.PACKAGES, []);
    this.schedules = StorageAdapter.get(STORAGE_KEYS.SCHEDULES, []);
    this.evaluations = StorageAdapter.get(STORAGE_KEYS.EVALUATIONS, []);
  },

  setActiveTherapist(therapistId) {
    this.activeTherapistId = therapistId;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, therapistId);
    window.refreshIcons();
  },

  get currentTherapist() {
    const list = this.therapists || [];
    const found =
      list.find((t) => t.id === this.activeTherapistId) ||
      list[0] ||
      {};
    const serviceMeta = THERAPY_SERVICES[found.specialty] || {
      id: found.specialty || 'UNKNOWN',
      name: found.specialty || 'Layanan Terapis',
      shortName: found.specialty || 'Terapis',
      badgeClass: 'badge-ghost',
      icon: 'stethoscope',
    };
    return {
      ...found,
      id: found.id || '',
      name: found.name || 'Terapis',
      phone: found.phone || '-',
      serviceMeta,
    };
  },

  // Getter Reaktif: Daftar Terapis Lengkap dengan Statistik Beban Jadwal & Evaluasi
  get enrichedTherapists() {
    return (this.therapists || []).map((therapist) => {
      const serviceMeta = THERAPY_SERVICES[therapist.specialty] || {
        id: therapist.specialty || 'UNKNOWN',
        name: therapist.specialty || 'Layanan Tidak Dikenal',
        shortName: therapist.specialty || 'Layanan',
        badgeClass: 'badge-ghost',
        icon: 'activity',
      };
      const schedulesList = this.schedules || [];
      const evaluationsList = this.evaluations || [];
      const therapistSchedules = schedulesList.filter(
        (s) =>
          s.therapistId === therapist.id &&
          s.status !== SESSION_STATUS.CANCELLED.id,
      );
      const activeSessionsCount = therapistSchedules.filter(
        (s) =>
          s.status === SESSION_STATUS.SCHEDULED.id ||
          s.status === SESSION_STATUS.CHECKED_IN.id,
      ).length;
      const completedEvaluationsCount = evaluationsList.filter(
        (e) => e.therapistId === therapist.id,
      ).length;

      // Ambil 2 huruf inisial nama (mengabaikan kata sapaan "Kak")
      const rawName = therapist.name || '';
      const cleanName = rawName.replace(/^Kak\s+/i, "").trim();
      const initials = cleanName
        ? cleanName
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase()
        : "TR";

      return {
        ...therapist,
        id: therapist.id || '',
        name: therapist.name || 'Terapis',
        phone: therapist.phone || '-',
        initials: initials || "TR",
        serviceMeta,
        totalSchedulesCount: therapistSchedules.length,
        activeSessionsCount,
        completedEvaluationsCount,
      };
    });
  },

  // Getter Reaktif: Data Pasien Lengkap
  get enrichedPatients() {
    const patientsList = this.patients || [];
    const packagesList = this.packages || [];
    const evaluationsList = this.evaluations || [];
    const therapistsList = this.therapists || [];

    return patientsList.map((patient) => {
      const patientPackages = packagesList
        .filter((pkg) => pkg.patientId === patient.id)
        .map((pkg) => ({
          ...pkg,
          serviceMeta: THERAPY_SERVICES[pkg.serviceId] || {
            name: pkg.serviceId || 'Layanan',
            shortName: pkg.serviceId || 'Layanan',
            badgeClass: 'badge-ghost',
          },
        }));

      const patientEvaluations = evaluationsList
        .filter((ev) => ev.patientId === patient.id)
        .map((ev) => {
          const therapist =
            therapistsList.find((t) => t.id === ev.therapistId) || {};
          return {
            ...ev,
            therapistName: therapist.name || "-",
            serviceMeta: THERAPY_SERVICES[ev.serviceId] || {
              name: ev.serviceId || 'Layanan',
              shortName: ev.serviceId || 'Layanan',
              badgeClass: 'badge-ghost',
            },
            formattedDate: DateFormatter.toIndonesianDate(ev.date),
          };
        });

      return {
        ...patient,
        id: patient.id || '',
        fullName: patient.fullName || 'Pasien',
        nickname: patient.nickname || '-',
        parentName: patient.parentName || '-',
        parentPhone: patient.parentPhone || '-',
        ageLabel: DateFormatter.calculateChildAge(patient.birthDate),
        formattedBirthDate: DateFormatter.toIndonesianDate(patient.birthDate),
        formattedRegDate: DateFormatter.toIndonesianDate(patient.registeredAt),
        activePackages: patientPackages,
        totalRemainingQuota: patientPackages.reduce(
          (sum, p) => sum + (p.remainingQuota || 0),
          0,
        ),
        evaluations: patientEvaluations,
      };
    });
  },

  // Getter Reaktif: Daftar Paket & Kuota Sesi
  get enrichedPackages() {
    const packagesList = this.packages || [];
    const patientsList = this.patients || [];

    return packagesList.map((pkg) => {
      const patient = patientsList.find((p) => p.id === pkg.patientId) || {};
      const service = THERAPY_SERVICES[pkg.serviceId] || {
        name: pkg.serviceId || 'Layanan',
        shortName: pkg.serviceId || 'Layanan',
        badgeClass: 'badge-ghost',
      };
      const total = pkg.totalQuota || 1;
      const remaining = pkg.remainingQuota ?? 0;
      const percentage = Math.round((remaining / total) * 100);

      let quotaHealth = "SAFE";
      if (remaining === 0) quotaHealth = "EXHAUSTED";
      else if (remaining <= 2) quotaHealth = "LOW";

      return {
        ...pkg,
        patientName: patient.fullName || "Pasien Tidak Ditemukan",
        patientNickname: patient.nickname || "-",
        parentName: patient.parentName || "-",
        parentPhone: patient.parentPhone || "-",
        serviceMeta: service,
        quotaPercentage: percentage,
        quotaHealth,
      };
    });
  },

  // Getter Reaktif: Jadwal Sesi Lengkap
  get enrichedSchedules() {
    const schedulesList = this.schedules || [];
    const patientsList = this.patients || [];
    const therapistsList = this.therapists || [];
    const packagesList = this.packages || [];
    const evaluationsList = this.evaluations || [];

    return schedulesList.map((schedule) => {
      const patient =
        patientsList.find((p) => p.id === schedule.patientId) || {};
      const therapist =
        therapistsList.find((t) => t.id === schedule.therapistId) || {};
      const pkg = packagesList.find((k) => k.id === schedule.packageId) || {};
      const evaluation =
        evaluationsList.find((e) => e.scheduleId === schedule.id) || null;
      const service = THERAPY_SERVICES[schedule.serviceId] || {
        name: schedule.serviceId || 'Layanan',
        shortName: schedule.serviceId || 'Layanan',
        badgeClass: 'badge-ghost',
      };
      const statusMeta =
        SESSION_STATUS[schedule.status] || SESSION_STATUS.SCHEDULED;

      return {
        ...schedule,
        formattedDate: DateFormatter.toIndonesianDate(schedule.date),
        patientName: patient.fullName || "Pasien Tidak Ditemukan",
        patientNickname: patient.nickname || "-",
        patientAge: DateFormatter.calculateChildAge(patient.birthDate),
        diagnosisNotes: patient.diagnosisNotes || "-",
        parentName: patient.parentName || "-",
        therapistName: therapist.name || "Terapis Belum Ditentukan",
        packageName: pkg.packageName || "-",
        remainingQuota: pkg.remainingQuota ?? 0,
        totalQuota: pkg.totalQuota ?? 0,
        serviceMeta: service,
        statusMeta: statusMeta,
        evaluationData: evaluation,
      };
    });
  },

  get therapistSchedules() {
    return (this.enrichedSchedules || []).filter(
      (s) => s.therapistId === this.activeTherapistId,
    );
  },

  get lowQuotaAlerts() {
    return (this.enrichedPackages || []).filter((pkg) => pkg.remainingQuota <= 2);
  },

  get metrics() {
    const p = this.patients || [];
    const t = this.therapists || [];
    const s = this.schedules || [];
    const k = this.packages || [];
    return {
      totalPatients: p.length,
      totalTherapists: t.length,
      todaySessions: s.length,
      checkedInToday: s.filter(
        (item) =>
          item.status === SESSION_STATUS.CHECKED_IN.id ||
          item.status === SESSION_STATUS.COMPLETED.id,
      ).length,
      lowQuotaPackages: k.filter((pkg) => (pkg.remainingQuota ?? 0) <= 2).length,
      activePackagesCount: k.filter((pkg) => (pkg.remainingQuota ?? 0) > 0).length,
      exhaustedPackagesCount: k.filter((pkg) => (pkg.remainingQuota ?? 0) === 0).length,
    };
  },

  // Aksi Operasional: Pendaftaran Pasien Anak Baru
  registerPatient(formData) {
    if (
      !formData.fullName ||
      !formData.birthDate ||
      !formData.parentName ||
      !formData.parentPhone
    ) {
      Alpine.store("ui").showToast(
        "Mohon lengkapi nama anak, tanggal lahir, dan kontak orang tua.",
        "error",
      );
      return false;
    }

    PatientService.registerNewPatient(formData);
    this.syncFromStorage();
    window.refreshIcons();
    Alpine.store("ui").showToast(
      `Pasien anak "${formData.fullName}" berhasil didaftarkan!`,
      "success",
    );
    return true;
  },

  // Aksi Operasional: Pendaftaran Terapis Baru
  registerTherapist(formData) {
    if (!formData.name || !formData.specialty || !formData.phone) {
      Alpine.store("ui").showToast(
        "Mohon lengkapi nama terapis, spesialisasi, dan nomor WhatsApp.",
        "error",
      );
      return false;
    }

    TherapistService.registerTherapist(formData);
    this.syncFromStorage();
    window.refreshIcons();
    Alpine.store("ui").showToast(
      `Terapis "${formData.name}" berhasil ditambahkan!`,
      "success",
    );
    return true;
  },

  // Aksi Operasional: Hapus Data Terapis
  removeTherapist(therapistId) {
    const result = TherapistService.deleteTherapist(therapistId);
    if (!result.success) {
      Alpine.store("ui").showToast(result.error, "error");
      return false;
    }

    this.syncFromStorage();
    window.refreshIcons();
    Alpine.store("ui").showToast("Data terapis berhasil dihapus.", "info");
    return true;
  },

  // Aksi Operasional: Tambah Paket Terapi Baru
  addPackage(formData) {
    if (!formData.patientId || !formData.serviceId || !formData.tierId) {
      Alpine.store("ui").showToast(
        "Pilih pasien, layanan terapi, dan jenis paket terlebih dahulu.",
        "error",
      );
      return false;
    }

    PackageService.createPackage(formData);
    this.syncFromStorage();
    window.refreshIcons();
    Alpine.store("ui").showToast(
      "Paket kuota terapi baru berhasil diaktifkan!",
      "success",
    );
    return true;
  },

  // Aksi Operasional: Perpanjangan / Top-Up Kuota Paket
  topUpPackage(packageId, tierId) {
    const updated = PackageService.topUpPackage(packageId, tierId);
    if (updated) {
      this.syncFromStorage();
      window.refreshIcons();
      Alpine.store("ui").showToast(
        `Kuota paket berhasil diperpanjang! Sisa kuota sekarang: ${updated.remainingQuota} sesi.`,
        "success",
      );
      return true;
    }
    return false;
  },

  // Aksi Operasional: Koreksi Manual Kuota (+1 / -1)
  adjustPackageQuota(packageId, delta) {
    const updated = PackageService.adjustQuota(packageId, delta);
    if (updated) {
      this.syncFromStorage();
      window.refreshIcons();
      const actionLabel = delta > 0 ? "ditambah (+1)" : "dikurangi (-1)";
      Alpine.store("ui").showToast(
        `Sisa kuota sesi berhasil ${actionLabel}.`,
        "info",
      );
    }
  },

  checkScheduleConflict(payload) {
    return ScheduleService.checkConflict(payload);
  },

  createSchedule(formData) {
    if (
      !formData.date ||
      !formData.timeSlot ||
      !formData.patientId ||
      !formData.packageId ||
      !formData.therapistId ||
      !formData.room
    ) {
      Alpine.store("ui").showToast(
        "Mohon lengkapi seluruh kolom penjadwalan.",
        "error",
      );
      return false;
    }

    const result = ScheduleService.createSchedule(formData);
    if (!result.success) {
      Alpine.store("ui").showToast(result.error, "error");
      return false;
    }

    this.syncFromStorage();
    window.refreshIcons();
    Alpine.store("ui").showToast(
      "Jadwal sesi terapi berhasil ditambahkan!",
      "success",
    );
    return true;
  },

  cancelSchedule(scheduleId) {
    const updated = ScheduleService.cancelSchedule(scheduleId);
    if (updated) {
      this.syncFromStorage();
      window.refreshIcons();
      Alpine.store("ui").showToast(
        "Jadwal sesi dibatalkan. Slot terapis & ruangan kembali tersedia.",
        "info",
      );
    }
  },

  checkInPatient(scheduleId) {
    const schedule = this.schedules.find((s) => s.id === scheduleId);
    if (!schedule || schedule.status !== SESSION_STATUS.SCHEDULED.id) return;

    const pkg = this.packages.find((p) => p.id === schedule.packageId);
    if (pkg && pkg.remainingQuota <= 0) {
      Alpine.store("ui").showToast(
        "Gagal Check-In: Kuota paket sesi pasien ini sudah habis!",
        "error",
      );
      return;
    }

    StorageAdapter.updateById(STORAGE_KEYS.SCHEDULES, scheduleId, {
      status: SESSION_STATUS.CHECKED_IN.id,
    });

    if (pkg) {
      const newUsed = (pkg.usedQuota || 0) + 1;
      const newRemaining = Math.max(0, pkg.totalQuota - newUsed);
      StorageAdapter.updateById(STORAGE_KEYS.PACKAGES, pkg.id, {
        usedQuota: newUsed,
        remainingQuota: newRemaining,
        status: newRemaining === 0 ? "EXHAUSTED" : "ACTIVE",
      });
    }

    this.syncFromStorage();
    window.refreshIcons();
    Alpine.store("ui").showToast(
      "Pasien berhasil Check-In & kuota otomatis dipotong 1 sesi.",
      "success",
    );
  },

  submitEvaluation(formData) {
    if (
      !formData.scheduleId ||
      !formData.activitySummary ||
      !formData.progressNotes
    ) {
      Alpine.store("ui").showToast(
        "Mohon lengkapi ringkasan aktivitas dan catatan perkembangan anak.",
        "error",
      );
      return false;
    }

    const result = EvaluationService.saveEvaluation(formData);
    if (!result.success) {
      Alpine.store("ui").showToast(result.error, "error");
      return false;
    }

    this.syncFromStorage();
    window.refreshIcons();
    Alpine.store("ui").showToast(
      "Catatan evaluasi perkembangan sesi berhasil disimpan!",
      "success",
    );
    return true;
  },

  resetDatabase() {
    const confirmed = confirm(
      "Reset seluruh data simulasi (Pasien, Terapis, Paket Kuota, Jadwal, & Evaluasi) ke kondisi awal?",
    );
    if (confirmed) {
      StorageAdapter.clearAll();
      initializeDatabase(true);
      this.syncFromStorage();
      window.location.reload();
    }
  },
});
