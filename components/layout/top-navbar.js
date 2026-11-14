/**
 * Komponen Top Navbar (Modular UI Partial)
 * Menampilkan judul halaman aktif, tanggal hari ini, dan aksi cepat.
 * Mendukung mode 'admin' dan 'therapist' secara dinamis.
 */

export const renderTopNavbar = (
  pageTitle = "Dashboard Operasional",
  role = "admin",
  drawerId = "admin-drawer",
) => {
  const todayFormatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const isTherapist = role === "therapist";

  // Bagian kanan khusus Admin (Profil Resepsionis)
  const adminProfileHtml = `
    <!-- Profil Resepsionis Aktif -->
    <div class="flex items-center gap-2.5 bg-base-200/80 pl-2 pr-3 py-1.5 rounded-full border border-base-300">
        <div class="w-7 h-7 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-xs">
            AD
        </div>
        <div class="text-left hidden md:block">
            <div class="text-xs font-semibold leading-none">Admin Resepsionis</div>
            <div class="text-[10px] text-base-content/60 leading-none mt-0.5">Front Office</div>
        </div>
    </div>
  `;

  // Bagian kanan khusus Terapis (Account Switcher + Badge Spesialisasi + Avatar)
  const therapistProfileHtml = `
    <!-- Switcher Simulasi Akun Terapis -->
    <div class="flex items-center gap-2 bg-base-200/60 p-1 sm:p-1.5 rounded-xl border border-base-300">
        <div class="hidden xl:flex items-center gap-1.5 text-xs text-base-content/70 pl-1">
            <i data-lucide="user-cog" class="w-4 h-4 text-secondary shrink-0"></i>
            <span class="font-medium whitespace-nowrap">Simulasi:</span>
        </div>
        <select :value="$store.clinic.activeTherapistId"
                @change="$store.clinic.setActiveTherapist($event.target.value)"
                class="select select-bordered select-xs sm:select-sm text-xs font-semibold max-w-[160px] sm:max-w-[220px]">
            <template x-for="t in $store.clinic.therapists" :key="t.id">
                <option :value="t.id" x-text="t.name + ' (' + (t.specialty || '') + ')'"></option>
            </template>
        </select>
        
        <!-- Badge Spesialisasi Layanan Terapi -->
        <span class="badge badge-sm font-semibold whitespace-nowrap hidden md:inline-flex"
              :class="$store.clinic.currentTherapist.serviceMeta?.badgeClass"
              x-text="$store.clinic.currentTherapist.serviceMeta?.shortName || 'Terapis'">
        </span>
    </div>

    <!-- Avatar Terapis Aktif -->
    <div class="flex items-center gap-2 bg-base-200/80 pl-1.5 pr-2.5 py-1 rounded-full border border-base-300">
        <div class="w-7 h-7 rounded-full bg-secondary text-secondary-content flex items-center justify-center font-bold text-xs shrink-0">
            <i data-lucide="stethoscope" class="w-3.5 h-3.5"></i>
        </div>
        <div class="text-left hidden lg:block">
            <div class="text-xs font-semibold leading-none truncate max-w-[120px]" x-text="$store.clinic.currentTherapist.name"></div>
            <div class="text-[10px] text-base-content/60 leading-none mt-0.5" x-text="$store.clinic.currentTherapist.serviceMeta?.shortName || 'Terapis'"></div>
        </div>
    </div>
  `;

  return `
    <header class="navbar bg-base-100 border-b border-base-300 px-4 lg:px-8 h-16 sticky top-0 z-20">
        <!-- Kiri: Tombol Drawer (Mobile/Tablet) & Judul Halaman -->
        <div class="flex-1 items-center gap-3">
            <label for="${drawerId}" class="btn btn-ghost btn-square btn-sm lg:hidden" aria-label="Buka Menu">
                <i data-lucide="menu" class="w-5 h-5"></i>
            </label>
            <div>
                <h1 class="text-lg font-bold tracking-tight leading-none">${pageTitle}</h1>
                <p class="text-xs text-base-content/60 mt-1 flex items-center gap-1.5">
                    <i data-lucide="calendar" class="w-3.5 h-3.5 text-primary"></i>
                    <span>${todayFormatted}</span>
                </p>
            </div>
        </div>

        <!-- Kanan: Role Indicator, Switcher, & Reset Simulasi -->
        <div class="flex-none items-center gap-2 sm:gap-3">
            <button type="button" 
                    @click="$store.clinic.resetDatabase()" 
                    class="btn btn-ghost btn-xs text-base-content/60 hover:text-error hidden sm:inline-flex gap-1"
                    title="Kembalikan ke data simulasi awal">
                <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                <span class="hidden md:inline">Reset Simulasi</span>
            </button>

            <div class="divider divider-horizontal my-2 hidden sm:flex"></div>

            ${isTherapist ? therapistProfileHtml : adminProfileHtml}
        </div>
    </header>
  `;
};
