/**
 * Konstanta Domain & Konfigurasi Sistem ESSA Kids Therapy
 * Memudahkan perubahan label atau skema warna di satu tempat (Single Source of Truth).
 */

export const STORAGE_KEYS = Object.freeze({
  INITIALIZED: "essa_db_initialized",
  PATIENTS: "essa_patients",
  THERAPISTS: "essa_therapists",
  PACKAGES: "essa_packages",
  SCHEDULES: "essa_schedules",
  EVALUATIONS: "essa_evaluations",
  ACTIVE_USER: "essa_active_user",
});

export const THERAPY_SERVICES = Object.freeze({
  PHYSIO: {
    id: "PHYSIO",
    name: "Physiotherapy",
    shortName: "Fisioterapi",
    badgeClass: "badge-info",
    icon: "activity",
  },
  SENSORY: {
    id: "SENSORY",
    name: "Sensory Integration",
    shortName: "Sensori Integrasi",
    badgeClass: "badge-secondary",
    icon: "sparkles",
  },
  SPEECH: {
    id: "SPEECH",
    name: "Speech Therapy",
    shortName: "Terapi Wicara",
    badgeClass: "badge-warning",
    icon: "message-circle",
  },
  OCCUPATIONAL: {
    id: "OCCUPATIONAL",
    name: "Occupational Therapy",
    shortName: "Terapi Okupasi",
    badgeClass: "badge-success",
    icon: "puzzle",
  },
});

export const SESSION_STATUS = Object.freeze({
  SCHEDULED: { id: "SCHEDULED", label: "Terjadwal", badgeClass: "badge-ghost" },
  CHECKED_IN: {
    id: "CHECKED_IN",
    label: "Hadir / Berlangsung",
    badgeClass: "badge-primary",
  },
  COMPLETED: {
    id: "COMPLETED",
    label: "Selesai Dievaluasi",
    badgeClass: "badge-success",
  },
  CANCELLED: {
    id: "CANCELLED",
    label: "Batal / Izin",
    badgeClass: "badge-error",
  },
});

export const PACKAGE_TIERS = Object.freeze([
  {
    id: "PKG_REG_4",
    name: "Paket Reguler (4 Sesi)",
    totalQuota: 4,
    validityDays: 30,
  },
  {
    id: "PKG_INT_8",
    name: "Paket Intensif (8 Sesi)",
    totalQuota: 8,
    validityDays: 60,
  },
  {
    id: "PKG_OPT_12",
    name: "Paket Optimal (12 Sesi)",
    totalQuota: 12,
    validityDays: 90,
  },
]);

export const TIME_SLOTS = Object.freeze([
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:30 - 11:30",
  "13:30 - 14:30",
  "15:00 - 16:00",
]);

export const CLINIC_ROOMS = Object.freeze([
  { id: "RM-01", name: "Gym Fisioterapi A", defaultService: "PHYSIO" },
  { id: "RM-02", name: "Ruang Sensori Integrasi", defaultService: "SENSORY" },
  { id: "RM-03", name: "Ruang Wicara B", defaultService: "SPEECH" },
  { id: "RM-04", name: "Ruang Okupasi C", defaultService: "OCCUPATIONAL" },
]);
