/**
 * Alpine.js Production Safety Bootstrapper
 * Mencegah race condition antara CDN Alpine.js (defer) dan ES6 Modules (app.js) di Vercel/Production.
 * Dijalankan sinkron sebelum Alpine.js memproses DOM.
 */

(function () {
  const safeInitAlpine = () => {
    if (!window.Alpine) return;

    if (!window.Alpine.store("clinic")) {
      window.Alpine.store("clinic", {
        therapists: [],
        patients: [],
        packages: [],
        schedules: [],
        evaluations: [],
        timeSlots: [],
        clinicRooms: [],
        activeTherapistId: "THR-03",
        get currentTherapist() {
          return {
            id: "",
            name: "Terapis",
            phone: "-",
            serviceMeta: { badgeClass: "badge-ghost", shortName: "Terapis", name: "Layanan" },
          };
        },
        get enrichedTherapists() {
          return [];
        },
        get enrichedPatients() {
          return [];
        },
        get enrichedPackages() {
          return [];
        },
        get enrichedSchedules() {
          return [];
        },
        get therapistSchedules() {
          return [];
        },
        get lowQuotaAlerts() {
          return [];
        },
        get metrics() {
          return {
            totalPatients: 0,
            totalTherapists: 0,
            todaySessions: 0,
            checkedInToday: 0,
            lowQuotaPackages: 0,
            activePackagesCount: 0,
            exhaustedPackagesCount: 0,
          };
        },
        setActiveTherapist() {},
        checkInPatient() {},
        submitEvaluation() {
          return false;
        },
        registerPatient() {
          return false;
        },
        registerTherapist() {
          return false;
        },
        addPackage() {
          return false;
        },
        topUpPackage() {
          return false;
        },
        adjustPackageQuota() {},
        createSchedule() {
          return false;
        },
        cancelSchedule() {},
        checkScheduleConflict() {
          return { hasConflict: false };
        },
        resetDatabase() {},
      });
    }

    if (!window.Alpine.store("ui")) {
      window.Alpine.store("ui", {
        sidebarCollapsed: localStorage.getItem("essa_sidebar_collapsed") === "true",
        toastMessage: "",
        toastType: "info",
        toggleSidebar() {},
        showToast() {},
      });
    }
  };

  document.addEventListener("alpine:init", safeInitAlpine);
  if (window.Alpine) {
    safeInitAlpine();
  }
})();
