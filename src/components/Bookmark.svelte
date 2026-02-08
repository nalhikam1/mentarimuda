<script>
  import { onMount } from 'svelte';
  export let postTitle = "";
  export let postUrl = "";
  export let showSaveButton = true; // Kontrol apakah tombol simpan ditampilkan

  let bookmarks = [];
  let showPopup = false;

  // Mengambil data saat pertama kali komponen muncul
  onMount(() => {
    const saved = localStorage.getItem('mentari-bookmarks');
    if (saved) bookmarks = JSON.parse(saved);

    // Listen to custom event from BottomNav
    const handleOpenBookmark = () => {
      showPopup = !showPopup; 
      // Hapus scroll ke atas agar user experience lebih baik di mobile
    };

    // Listen to event to close bookmarks (e.g. when Topic Sidebar opens)
    const handleCloseBookmark = () => {
      showPopup = false;
    };

    window.addEventListener('openSavedBookmarks', handleOpenBookmark);
    window.addEventListener('closeSavedBookmarks', handleCloseBookmark);
    
    // Cleanup listener on destroy
    return () => {
      window.removeEventListener('openSavedBookmarks', handleOpenBookmark);
      window.removeEventListener('closeSavedBookmarks', handleCloseBookmark);
    };
  });

  // LOGIKA PENTING: Svelte akan mengecek ulang status ini 
  // setiap kali postTitle atau bookmarks berubah.
  $: isSaved = bookmarks.some(b => b.title === postTitle);

  function toggleBookmark() {
    if (isSaved) {
      bookmarks = bookmarks.filter(b => b.title !== postTitle);
    } else {
      bookmarks = [...bookmarks, { title: postTitle, url: postUrl }];
    }
    localStorage.setItem('mentari-bookmarks', JSON.stringify(bookmarks));
  }

  function removeBookmark(title) {
    bookmarks = bookmarks.filter(b => b.title !== title);
    localStorage.setItem('mentari-bookmarks', JSON.stringify(bookmarks));
  }
</script>

<div class="bookmark-actions">
  {#if showSaveButton}
    <button on:click={toggleBookmark} class="btn-save" class:active={isSaved} title={isSaved ? 'Hapus dari simpanan' : 'Simpan artikel'}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>{isSaved ? 'Tersimpan' : 'Simpan'}</span>
    </button>
  {/if}
  
  <button on:click={() => showPopup = !showPopup} class="btn-list" title="Bacaan Tersimpan">
    <div class="icon-wrapper">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
      {#if bookmarks.length > 0}
        <span class="badge">{bookmarks.length}</span>
      {/if}
    </div>
    <span class="btn-text">Bacaan</span>
  </button>

  {#if showPopup}
    <div class="bookmark-dropdown">
      <div class="dropdown-header">
        <h4>Daftar Bacaan</h4>
        <button class="close-btn" on:click={() => showPopup = false}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      {#if bookmarks.length === 0}
        <div class="empty-state">
          <p>Belum ada artikel disimpan.</p>
          <p class="subtitle">Simpan artikel untuk dibaca nanti.</p>
        </div>
      {:else}
        <ul class="bookmark-list">
          {#each bookmarks as item}
            <li>
              <a href={item.url} class="bookmark-link">{item.title}</a>
              <button on:click={() => removeBookmark(item.title)} class="delete-btn" aria-label="Hapus">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
    <!-- Backdrop for mobile -->
    <div class="backdrop" on:click={() => showPopup = false}></div>
  {/if}
</div>

<style>
  .bookmark-actions { display: flex; gap: 8px; position: relative; align-items: center; }
  
  .btn-save, .btn-list { 
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--card-bg); /* Use var */
    border: 1px solid var(--border); 
    padding: 8px 16px; 
    border-radius: 20px; 
    cursor: pointer; 
    font-size: 0.875rem;
    transition: all 0.2s ease;
    font-weight: 500;
    color: var(--text-secondary);
    height: 40px; 
  }
  
  .btn-save:hover, .btn-list:hover {
    background: var(--sidebar-bg);
    border-color: #ccc;
    color: var(--text);
  }

  .btn-save.active { 
    background: #e8f5e9; 
    color: #2e7d32; 
    border-color: #c8e6c9; 
  }
  
  .icon-wrapper {
      position: relative;
      display: flex;
      align-items: center;
  }

  .badge {
      position: absolute;
      top: -8px;
      right: -10px;
      background: #FF6B6B;
      color: white;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0 5px;
      height: 16px;
      border-radius: 10px;
      min-width: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
  }

  /* Responsive Text Hide */
  @media (max-width: 768px) {
      .btn-text { display: none; }
      .btn-save span { display: none; }
      .btn-save, .btn-list { padding: 8px; border-radius: 50%; width: 40px; justify-content: center; }
  }
  
  /* Dropdown / Modal Style */
  .bookmark-dropdown {
    position: absolute; 
    right: 0; 
    top: 55px; 
    width: 340px;
    background: var(--card-bg); 
    border: 1px solid var(--border); 
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15); 
    z-index: 1001;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: fadeIn 0.2s ease-out;
  }

  .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--card-bg);
  }

  .dropdown-header h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: var(--text);
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 4px;
    display: none; /* Hidden on desktop usually */
  }

  .bookmark-list {
    list-style: none; 
    padding: 0; 
    margin: 0; 
    max-height: 400px;
    overflow-y: auto;
  }

  .bookmark-list li { 
    display: flex; 
    justify-content: space-between; 
    padding: 14px 20px; 
    border-bottom: 1px solid var(--border); 
    align-items: center; 
    transition: background 0.2s;
  }

  .bookmark-list li:hover {
    background: var(--sidebar-bg);
  }

  .bookmark-link { 
    font-size: 0.9rem; 
    text-decoration: none; 
    color: var(--text); 
    line-height: 1.4;
    margin-right: 12px;
    font-weight: 500;
  }

  .bookmark-link:hover {
    color: var(--text);
    text-decoration: underline;
  }

  .delete-btn { 
    background: none; 
    border: none; 
    cursor: pointer; 
    font-size: 1rem;
    color: #bbb;
    padding: 4px;
    border-radius: 4px;
  }

  .delete-btn:hover {
    color: #ff4444;
    background: #fff0f0;
  }

  .empty-state {
    padding: 40px 20px;
    text-align: center;
  }

  .empty-state p {
    margin: 0;
    color: var(--text);
    font-weight: 600;
  }

  .empty-state .subtitle {
    font-weight: 400;
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin-top: 6px;
  }

  .backdrop {
    display: none;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Mobile Responsive Dropdown & Button */
  @media (max-width: 640px) {
    .btn-list {
      display: none; 
    }

    .btn-save {
      padding: 8px 12px;
      font-size: 0.8rem;
    }

    /* Modal Fullscreen (Sama seperti Search Panel) */
    .bookmark-dropdown {
      position: fixed;
      top: 0;       
      bottom: 0;    
      left: 0;
      right: 0;
      width: 100%;
      height: 100vh; 
      max-height: 100vh;
      border-radius: 0; 
      border: none;
      background: var(--bg); /* Gunakan bg utama agar solid */
      box-shadow: none;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 2000; 
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow: hidden;
    }

    .dropdown-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      background: var(--bg); /* Solid bg */
      z-index: 10;
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .dropdown-header h4 {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0;
    }
    
    /* Tombol close di header */
    .close-btn {
      display: flex !important;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: var(--sidebar-bg);
      border: 1px solid var(--border);
      border-radius: 50%;
      color: var(--text);
      cursor: pointer;
    }
    
    /* List Style */
    .bookmark-list {
      padding: 10px 0 100px 0; /* Padding bawah extra untuk bottom nav */
      margin: 0;
      display: block; 
      overflow-y: auto;
      flex: 1;
      -webkit-overflow-scrolling: touch;
    }

    .bookmark-list li {
      background: transparent;
      border-bottom: 1px solid var(--border);
      padding: 18px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .bookmark-link {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text);
      text-decoration: none;
      flex: 1;
      line-height: 1.5;
    }
    
    .delete-btn {
      background: var(--sidebar-bg);
      border: 1px solid var(--border);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .delete-btn:hover {
      background: #ff4444;
      color: white;
      border-color: #ff4444;
    }
    
    /* Empty state */
    .empty-state {
      padding: 60px 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .backdrop {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(2px);
      z-index: 1500;
    }
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
</style>