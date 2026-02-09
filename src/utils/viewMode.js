// Utility untuk View Mode Toggle
const VIEW_MODE_KEY = 'mentari-view-mode';
let isInitialized = false;

function applyViewMode(mode) {
    const containers = document.querySelectorAll('[data-view-container]');
    containers.forEach(container => {
        // Hapus class lama
        container.classList.remove('grid-view', 'list-view');
        // Tambah class baru
        container.classList.add(`${mode}-view`);
    });
}

export function initViewMode() {
    if (isInitialized) return;

    // 1. Initial Load Handler
    const handlePageLoad = () => {
        const savedMode = localStorage.getItem(VIEW_MODE_KEY) || 'grid';
        applyViewMode(savedMode);
    };

    // 2. Change Event Handler
    const handleChange = (e) => {
        const newMode = e.detail;
        applyViewMode(newMode);
        localStorage.setItem(VIEW_MODE_KEY, newMode);
    };

    // Pasang listeners
    document.addEventListener('astro:page-load', handlePageLoad);
    window.addEventListener('viewModeChange', handleChange);

    // Jalankan sekali saat init jika sudah di halaman (untuk SPA feel)
    handlePageLoad();

    isInitialized = true;
}
