<script>
  import { onMount, tick } from 'svelte';
  
  export let tabs = []; 
  let activeTab = tabs[0]?.id;
  let container;
  let copied = false;

  // Fungsi untuk menyembunyikan/menampilkan tab secara dinamis
  async function updateVisibility() {
    await tick(); // Tunggu Svelte selesai render
    if (!container) return;
    
    const children = container.querySelectorAll('[data-panel]');
    children.forEach(child => {
      if (child.getAttribute('data-panel') === activeTab) {
        child.style.display = 'block';
      } else {
        child.style.display = 'none';
      }
    });
  }

  async function handleCopy() {
    if (!container) return;
    const activePanel = container.querySelector(`[data-panel="${activeTab}"]`);
    if (!activePanel) return;

    const code = activePanel.querySelector('code')?.innerText || activePanel.innerText;
    
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
      setTimeout(() => { copied = false; }, 2000);
    } catch (err) {
      console.error('Gagal menyalin:', err);
    }
  }

  // Jalankan setiap kali activeTab berubah
  $: if (activeTab && container) {
    updateVisibility();
  }

  onMount(updateVisibility);
</script>

<div class="code-group">
  <div class="code-header">
    <div class="tab-list">
      {#each tabs as tab}
        <button 
          class:active={activeTab === tab.id} 
          on:click={() => activeTab = tab.id}
        >
          {tab.label}
        </button>
      {/each}
    </div>
    
    <button class="copy-trigger" on:click={handleCopy} class:success={copied}>
      {#if copied}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Copied</span>
      {:else}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>Copy</span>
      {/if}
    </button>
  </div>
  
  <div class="code-content" bind:this={container}>
    <slot />
  </div>
</div>

<style>
  .code-group {
    margin: 2rem 0;
    border-radius: 12px;
    background: #0d1117;
    border: 1px solid rgba(255,255,255,0.1);
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }

  .code-header {
    background: #161b22;
    padding: 0 12px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tab-list {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tab-list::-webkit-scrollbar { display: none; }

  button {
    background: transparent;
    border: none;
    color: #8b949e;
    padding: 12px 16px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
    transition: color 0.2s;
  }

  button:hover:not(.active) {
    color: #c9d1d9;
  }

  button.active {
    color: #FF8E53;
  }

  button.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #FF6B6B, #FF8E53);
  }

  .copy-trigger {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #8b949e;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid transparent;
  }

  .copy-trigger:hover {
    background: rgba(255,255,255,0.05);
    color: #fff;
    border-color: rgba(255,255,255,0.1);
  }

  .copy-trigger.success {
    color: #4ade80;
  }

  :global(.code-content pre) {
    margin: 0 !important;
    padding: 24px !important; /* Premium Padding */
    background: transparent !important;
    font-size: 0.85rem !important;
    line-height: 1.6 !important;
  }
</style>
