/**
 * Konfigurasi Runtime Tailwind CSS (via CDN)
 * Dipisahkan agar mudah dimigrasikan ke file tailwind.config.js (Node.js) di masa depan.
 */
if (typeof tailwind !== 'undefined') {
    tailwind.config = {
        theme: {
            extend: {
                fontFamily: {
                    sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                },
                colors: {
                    // Warna identitas spesifik per layanan terapi ESSA Kids
                    therapy: {
                        physio: '#0ea5e9',   // Sky Blue - Fisioterapi
                        sensory: '#8b5cf6',  // Violet - Sensori Integrasi
                        speech: '#f59e0b',   // Amber - Terapi Wicara
                        occup: '#10b981',    // Emerald - Terapi Okupasi
                    }
                }
            }
        }
    };
}