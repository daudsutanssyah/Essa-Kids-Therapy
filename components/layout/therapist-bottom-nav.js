/**
 * Komponen Navigasi Terapis
 * Mendukung migrasi dari Bottom Nav mobile ke Desktop-First Collapsible Sidebar.
 */

export { renderTherapistSidebar } from "./therapist-sidebar.js";

/**
 * Fallback untuk kompatibilitas jika ada elemen lama yang masih memanggil renderTherapistBottomNav
 */
export const renderTherapistBottomNav = (activeTab = "schedule") => {
  return "";
};
