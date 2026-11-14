/**
 * Komponen Sidebar Terapis (Modular UI Partial)
 * Mendukung mode Collapse (Mini Icon w-20) & Expand (Full w-72) menggunakan Alpine.js ($store.ui.sidebarCollapsed)
 * Menggunakan drawer DaisyUI yang responsif (desktop fixed sidebar + mobile slide-out drawer)
 */

export const renderTherapistSidebar = (activeMenu = "schedule") => {
  const menus = [
    {
      id: "schedule",
      label: "Jadwal Harian Saya",
      icon: "calendar-check",
      href: "./daily-schedule.html",
    },
    {
      id: "evaluation",
      label: "Form & Riwayat Evaluasi",
      icon: "clipboard-pen-line",
      href: "./session-evaluation.html",
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
        <!-- Header Sidebar: Brand Identity + Tombol Toggle -->
        <div class="flex items-center justify-between mb-6"
             :class="$store.ui.sidebarCollapsed ? 'flex-col gap-3' : 'px-2'">
          
          <a href="../../index.html" 
             class="flex items-center gap-3 rounded-xl hover:bg-base-200/60 transition p-1.5"
             :class="$store.ui.sidebarCollapsed ? 'justify-center' : ''">
            <div class="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <i data-lucide="baby" class="w-6 h-6"></i>
            </div>
            <div x-show="!$store.ui.sidebarCollapsed" x-transition.opacity.duration.150ms class="overflow-hidden">
              <div class="font-bold text-base leading-tight tracking-tight whitespace-nowrap">ESSA Kids</div>
              <div class="text-xs text-secondary font-medium whitespace-nowrap">Portal Terapis</div>
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

          <!-- Tombol Tutup Sidebar (Khusus Layar Mobile/Tablet) -->
          <label for="therapist-drawer" class="btn btn-ghost btn-sm btn-square lg:hidden text-base-content/70">
            <i data-lucide="x" class="w-5 h-5"></i>
          </label>
        </div>

        <!-- Label Kategori Menu -->
        <div x-show="!$store.ui.sidebarCollapsed" 
             class="text-[11px] font-semibold uppercase tracking-wider text-base-content/40 px-4 mb-2 whitespace-nowrap">
          Menu Terapis
        </div>
        <div x-show="$store.ui.sidebarCollapsed" x-cloak class="divider my-2"></div>

        <!-- Daftar Menu -->
        <ul class="space-y-1.5 text-sm">
          ${menuItemsHtml}
        </ul>
      </div>

      <!-- Bagian Bawah: Profil Terapis Aktif & Pintasan ke Mode Admin -->
      <div class="space-y-3 pt-4 border-t border-base-200">
        
        <!-- Info Terapis Aktif (Disembunyikan saat mode Collapse agar rapi) -->
        <div x-show="!$store.ui.sidebarCollapsed" 
             x-transition.opacity
             class="bg-base-200/70 rounded-xl p-3 text-xs space-y-1.5 overflow-hidden">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-base-content/70">Terapis Aktif:</span>
            <span class="badge badge-sm font-semibold whitespace-nowrap"
                  :class="$store.clinic.currentTherapist.serviceMeta?.badgeClass"
                  x-text="$store.clinic.currentTherapist.serviceMeta?.shortName || 'Terapis'"></span>
          </div>
          <div class="font-bold text-sm text-base-content truncate" x-text="$store.clinic.currentTherapist.name"></div>
          <div class="text-[11px] text-base-content/60 flex items-center gap-1">
            <i data-lucide="phone" class="w-3 h-3"></i>
            <span x-text="$store.clinic.currentTherapist.phone || '-'"></span>
          </div>
        </div>

        <!-- Pintasan Beralih ke Portal Admin -->
        <a href="../admin/dashboard.html" 
           title="Buka Portal Admin"
           :class="$store.ui.sidebarCollapsed ? 'btn-square mx-auto flex' : 'btn-block justify-between'"
           class="btn btn-outline btn-sm font-normal text-xs">
          <span class="flex items-center gap-2">
            <i data-lucide="monitor" class="w-4 h-4 text-primary shrink-0"></i>
            <span x-show="!$store.ui.sidebarCollapsed" class="whitespace-nowrap">Portal Admin</span>
          </span>
          <span x-show="!$store.ui.sidebarCollapsed">
            <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 opacity-60"></i>
          </span>
        </a>
      </div>
    </aside>
  `;
};

