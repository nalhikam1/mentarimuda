// Utility untuk View Mode Toggle
export function initViewMode() {
    function updateViewMode(mode) {
        const containers = document.querySelectorAll('[data-view-container]');

        containers.forEach(container => {
            if (mode === 'list') {
                container.classList.add('list-view');
                container.classList.remove('grid-view');
            } else {
                container.classList.add('grid-view');
                container.classList.remove('list-view');
            }
        });
    }

    // Load initial view mode
    document.addEventListener('astro:page-load', () => {
        const savedMode = localStorage.getItem('mentari-view-mode') || 'grid';
        updateViewMode(savedMode);
    });

    // Listen untuk perubahan
    window.addEventListener('viewModeChange', (e) => {
        updateViewMode(e.detail);
    });
}
