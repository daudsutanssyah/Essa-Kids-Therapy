/**
 * Entry Point Aplikasi (Bootstrapper)
 * Menghubungkan modul Store, Seed Data, Layout Modular (Admin & Terapis), dan Lucide Icons.
 */

import { STORAGE_KEYS } from "./config/constants.js";
import { StorageAdapter } from "./database/storage-adapter.js";
import { initializeDatabase } from "./database/seed-data.js";
import { createClinicStore } from "./stores/clinic.store.js";
import { renderAdminSidebar } from "../../components/layout/admin-sidebar.js";
import { renderTherapistSidebar } from "../../components/layout/therapist-sidebar.js";
import { renderTopNavbar } from "../../components/layout/top-navbar.js";
import { renderTherapistBottomNav } from "../../components/layout/therapist-bottom-nav.js";

// 0. CEK & VALIDASI SEED DATA LOKAL (PATIENTS, THERAPISTS, PACKAGES, SCHEDULES)
const checkAndSeedDatabase = () => {
  const patients = StorageAdapter.get(STORAGE_KEYS.PATIENTS, []);
  const therapists = StorageAdapter.get(STORAGE_KEYS.THERAPISTS, []);
  const packages = StorageAdapter.get(STORAGE_KEYS.PACKAGES, []);
  const schedules = StorageAdapter.get(STORAGE_KEYS.SCHEDULES, []);

  const isCorruptedOrEmpty =
    !Array.isArray(patients) || patients.length === 0 ||
    !Array.isArray(therapists) || therapists.length === 0 ||
    !Array.isArray(packages) || packages.length === 0 ||
    !Array.isArray(schedules) || schedules.length === 0;

  if (isCorruptedOrEmpty) {
    initializeDatabase(true);
  }
};
checkAndSeedDatabase();

// 1. Injeksi Komponen Layout Modular terlebih dahulu
const initLayoutAndIcons = () => {
  // Mount Sidebar (Admin atau Terapis berdasarkan dataset.role)
  const sidebarTarget = document.getElementById("app-sidebar");
  if (sidebarTarget && !sidebarTarget.innerHTML.trim()) {
    const activeMenu = sidebarTarget.dataset.active || "dashboard";
    const role = sidebarTarget.dataset.role || "admin";
    if (role === "therapist") {
      sidebarTarget.innerHTML = renderTherapistSidebar(activeMenu);
    } else {
      sidebarTarget.innerHTML = renderAdminSidebar(activeMenu);
    }
  }

  // Mount Top Navbar (Admin atau Terapis berdasarkan dataset.role & dataset.drawer)
  const navbarTarget = document.getElementById("app-navbar");
  if (navbarTarget && !navbarTarget.innerHTML.trim()) {
    const pageTitle = navbarTarget.dataset.title || "Dashboard Operasional";
    const role = navbarTarget.dataset.role || "admin";
    const drawerId =
      navbarTarget.dataset.drawer ||
      (role === "therapist" ? "therapist-drawer" : "admin-drawer");
    navbarTarget.innerHTML = renderTopNavbar(pageTitle, role, drawerId);
  }

  // Fallback untuk bottom nav legacy jika masih ada
  const bottomNavTarget = document.getElementById("app-bottom-nav");
  if (bottomNavTarget && !bottomNavTarget.innerHTML.trim()) {
    const activeTab = bottomNavTarget.dataset.active || "schedule";
    bottomNavTarget.innerHTML = renderTherapistBottomNav(activeTab);
  }

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
};

initLayoutAndIcons();

// 2. Registrasi seluruh store saat Alpine.js siap diinisialisasi
const registerAlpineStores = () => {
  if (!window.Alpine) return;

  const clinicStore = createClinicStore();
  clinicStore.syncFromStorage();
  window.Alpine.store("clinic", clinicStore);

  window.Alpine.store("ui", {
    sidebarCollapsed: localStorage.getItem("essa_sidebar_collapsed") === "true",
    toastMessage: "",
    toastType: "info",

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      localStorage.setItem("essa_sidebar_collapsed", this.sidebarCollapsed);
      window.refreshIcons();
    },

    showToast(message, type = "success") {
      this.toastMessage = message;
      this.toastType = type;
      setTimeout(() => {
        this.toastMessage = "";
      }, 3500);
    },
  });
};

document.addEventListener("alpine:init", registerAlpineStores);
if (window.Alpine) {
  registerAlpineStores();
}

// 3. Helper global untuk merender ulang ikon setelah manipulasi DOM reaktif Alpine.js
window.refreshIcons = () => {
  if (typeof lucide !== "undefined") {
    setTimeout(() => lucide.createIcons(), 15);
  }
};
