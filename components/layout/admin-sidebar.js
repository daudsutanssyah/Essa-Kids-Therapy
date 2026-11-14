/**
 * Komponen Sidebar Admin (Modular UI Partial)
 * Mendukung mode Collapse (Mini Icon w-20) & Expand (Full w-72)
 */

export const renderAdminSidebar = (activeMenu = "dashboard") => {
  const menus = [
    {
      id: "dashboard",
      label: "Dashboard Operasional",
      icon: "layout-dashboard",
      href: "./dashboard.html",
    },
    {
      id: "patients",
      label: "Data Pasien Anak",
      icon: "users",
      href: "./patients.html",
    },
    {
      id: "therapists",
      label: "Data Terapis",
      icon: "stethoscope",
      href: "./therapists.html",
    },
    {
      id: "packages",
      label: "Paket & Kuota Sesi",
      icon: "package-check",
      href: "./packages.html",
    },
    {
      id: "schedules",
      label: "Jadwal & Ruangan",
      icon: "calendar-clock",
      href: "./schedules.html",
    },
  ];

  const menuItemsHtml = menus
    .map((item) => {
      const isActive = item.id === activeMenu;
      const activeClass = isActive
        ? "bg-primary text-primary-content font-semibold shadow-sm"
        : "text-base-content/75 hover:bg-base-200 hover:text-base-content";

      return `
        <li>
          <a href="${item.href}"
             title="${item.label}"
             :class="$store.ui.sidebarCollapsed ? 'justify-center px-2' : 'px-4'"
             class="flex items-center gap-3 py-3 rounded-xl transition-all duration-200 ${activeClass}">
            <i data-lucide="${item.icon}" class="w-5 h-5 shrink-0"></i>
            <span x-show="!$store.ui.sidebarCollapsed" 
                  x-transition.opacity.duration.150ms
                  class="whitespace-nowrap overflow-hidden text-ellipsis">
              ${item.label}
            </span>
          </a>
        </li>
      `;
    })
    .join("");

  return `
    <aside x-data 
           :class="$store.ui.sidebarCollapsed ? 'w-20 px-2.5' : 'w-72 px-4'"
           class="bg-base-100 border-r border-base-300 min-h-screen flex flex-col justify-between py-4 select-none transition-all duration-300 ease-in-out">
      
      <!-- Bagian Atas: Brand, Tombol Toggle, & Navigasi -->
      <div>
        <div class="flex items-center justify-between mb-6"
             :class="$store.ui.sidebarCollapsed ? 'flex-col gap-3' : 'px-2'">
          
          <a href="../../index.html" 
             class="flex items-center gap-3 rounded-xl hover:bg-base-200/60 transition p-1.5"
             :class="$store.ui.sidebarCollapsed ? 'justify-center' : ''">
            <div class="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <i data-lucide="baby" class="w-6 h-6"></i>
            </div>
            <div x-show="!$store.ui.sidebarCollapsed" x-transition.opacity.duration.150ms class="overflow-hidden">
              <div class="font-bold text-base leading-tight tracking-tight whitespace-nowrap">ESSA Kids</div>
              <div class="text-xs text-base-content/60 whitespace-nowrap">Portal Admin & Resepsionis</div>
            </div>
          </a>

          <!-- Tombol Toggle Collapse/Expand (Desktop) -->
          <button type="button"
                  @click="$store.ui.toggleSidebar()"
                  class="btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-primary hover:bg-primary/10 hidden lg:inline-flex"
                  :title="$store.ui.sidebarCollapsed ? 'Perlebar Sidebar' : 'Kecilkan Sidebar'">
            <span x-show="!$store.ui.sidebarCollapsed">
              <i data-lucide="panel-left-close" class="w-5 h-5"></i>
            </span>
            <span x-show="$store.ui.sidebarCollapsed" x-cloak>
              <i data-lucide="panel-left-open" class="w-5 h-5"></i>
            </span>
          </button>

          <!-- Tombol Tutup Sidebar (Mobile/Tablet) -->
          <label for="admin-drawer" class="btn btn-ghost btn-sm btn-square lg:hidden text-base-content/70">
            <i data-lucide="x" class="w-5 h-5"></i>
          </label>
        </div>

        <div x-show="!$store.ui.sidebarCollapsed" 
             class="text-[11px] font-semibold uppercase tracking-wider text-base-content/40 px-4 mb-2 whitespace-nowrap">
          Menu Operasional
        </div>
        <div x-show="$store.ui.sidebarCollapsed" x-cloak class="divider my-2"></div>

        <ul class="space-y-1.5 text-sm">
          ${menuItemsHtml}
        </ul>
      </div>

      <!-- Bagian Bawah: Switcher & Info Layanan -->
      <div class="space-y-3 pt-4 border-t border-base-200">
        <div x-show="!$store.ui.sidebarCollapsed" 
             x-transition.opacity
             class="bg-base-200/70 rounded-xl p-3 text-xs space-y-1.5 overflow-hidden">
          <div class="font-semibold text-base-content/70 mb-1 whitespace-nowrap">Layanan Klinik:</div>
          <div class="flex flex-wrap gap-1">
            <span class="badge badge-info badge-xs py-2">Physio</span>
            <span class="badge badge-secondary badge-xs py-2">Sensory</span>
            <span class="badge badge-warning badge-xs py-2">Speech</span>
            <span class="badge badge-success badge-xs py-2">Occup</span>
          </div>
        </div>

        <a href="../therapist/daily-schedule.html" 
           title="Buka Mode Terapis"
           :class="$store.ui.sidebarCollapsed ? 'btn-square mx-auto flex' : 'btn-block justify-between'"
           class="btn btn-outline btn-sm font-normal text-xs">
          <span class="flex items-center gap-2">
            <i data-lucide="stethoscope" class="w-4 h-4 text-secondary shrink-0"></i>
            <span x-show="!$store.ui.sidebarCollapsed" class="whitespace-nowrap">Buka Mode Terapis</span>
          </span>
          <span x-show="!$store.ui.sidebarCollapsed">
            <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 opacity-60"></i>
          </span>
        </a>
      </div>
    </aside>
  `;
};
