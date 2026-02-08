<script>
  import { onMount } from 'svelte';
  
  let currentMode = 'grid';
  let initialized = false;
  
  // Load dari localStorage saat mount
  onMount(() => {
    const saved = localStorage.getItem('mentari-view-mode');
    if (saved) {
      currentMode = saved;
      console.log('ViewToggle: Loaded saved mode:', saved);
    }
    
    // Dispatch initial event setelah mount
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('viewModeChange', { detail: currentMode }));
      initialized = true;
    }, 100);
  });
  
  function toggleView(mode) {
    console.log('ViewToggle: Switching to', mode);
    currentMode = mode;
    localStorage.setItem('mentari-view-mode', mode);
    
    // Dispatch event untuk notify perubahan
    if (initialized) {
      window.dispatchEvent(new CustomEvent('viewModeChange', { detail: mode }));
    }
  }
</script>

<div class="view-toggle">
  <button 
    class="toggle-btn" 
    class:active={currentMode === 'grid'}
    on:click={() => toggleView('grid')}
    aria-label="Grid view"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  </button>
  
  <button 
    class="toggle-btn" 
    class:active={currentMode === 'list'}
    on:click={() => toggleView('list')}
    aria-label="List view"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  </button>
</div>

<style>
  .view-toggle {
    display: flex;
    gap: 4px;
    background: var(--sidebar-bg); /* Sesuai tema */
    padding: 4px;
    border-radius: 8px;
    border: 1px solid var(--border); /* Tambah border tipis */
  }

  .toggle-btn {
    background: transparent;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    color: var(--text-secondary); /* Sesuai tema */
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toggle-btn:hover {
    background: var(--card-bg);
    color: var(--text);
  }

  .toggle-btn.active {
    background: var(--card-bg);
    color: var(--text);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    /* Sedikit highlight border untuk dark mode */
    border: 1px solid var(--border); 
  }
</style>
