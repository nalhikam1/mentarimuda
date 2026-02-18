<script>
  import { onMount, onDestroy } from 'svelte';
  import { addToast } from '../stores/toastStore';
  import { fade, fly } from 'svelte/transition';
  
  export let postTitle = "";
  export let postUrl = "";
  export let showSaveButton = true;
  export let hideListOnMobile = false;

  let bookmarks = [];
  let showPopup = false;
  let showTip = false;

  onMount(() => {
    // Load existing bookmarks
    const saved = localStorage.getItem('mentari-bookmarks');
    if (saved) bookmarks = JSON.parse(saved);

    const handleOpenBookmark = () => {
      showPopup = !showPopup; 

    };

    const handleCloseBookmark = () => {
      showPopup = false;
    };

    window.addEventListener('openSavedBookmarks', handleOpenBookmark);
    window.addEventListener('closeSavedBookmarks', handleCloseBookmark);
    
    // Show tip if applicable
    if (showSaveButton && postTitle) {
      const tipShown = localStorage.getItem('mentari_tip_shown_v4');
      const isAlreadySaved = bookmarks.some(b => b.title === postTitle);
      
      if (!tipShown && !isAlreadySaved) {
        setTimeout(() => {
          showTip = true;
          // Auto hide after 8s
          setTimeout(() => {
            showTip = false;
            localStorage.setItem('mentari_tip_shown_v4', 'true');
          }, 8000);
        }, 1500);
      }
    }
    


    return () => {
      window.removeEventListener('openSavedBookmarks', handleOpenBookmark);
      window.removeEventListener('closeSavedBookmarks', handleCloseBookmark);
    };
  });

  // Update badge in BottomNav
  $: {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bookmarksChanged', { 
        detail: { count: bookmarks.length } 
      }));
    }
  }

  $: isSaved = bookmarks.some(b => b.title === postTitle);

  function toggleBookmark() {
    showTip = false;

    if (isSaved) {
      bookmarks = bookmarks.filter(b => b.title !== postTitle);
      addToast('Dihapus 👌', 'info', 3000, 'bottom');
    } else {
      bookmarks = [...bookmarks, { title: postTitle, url: postUrl }];
      addToast('Disimpan 🥳', 'success', 3000, 'bottom');

    }
    localStorage.setItem('mentari-bookmarks', JSON.stringify(bookmarks));
    bookmarks = [...bookmarks]; 
  }

  function removeBookmark(title) {
    bookmarks = bookmarks.filter(b => b.title !== title);
    localStorage.setItem('mentari-bookmarks', JSON.stringify(bookmarks));
    addToast('Dihapus 👌', 'info', 3000, 'bottom');
    bookmarks = [...bookmarks];
  }
</script>

<div class="bookmark-actions">
  {#if showTip && showSaveButton}
    <div class="save-tip" in:fly={{ y: 10, duration: 500 }} out:fade>
       <div class="tip-content">
         <span class="tip-icon">✨</span> Simpan jika Suka ya 😊
       </div>
       <button class="tip-close" on:click={() => showTip = false}>✕</button>
       <div class="tip-arrow"></div>
    </div>
  {/if}
  {#if showSaveButton}
    <button on:click={toggleBookmark} class="btn-save" class:active={isSaved} title={isSaved ? 'Hapus dari simpanan' : 'Simpan artikel'}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>{isSaved ? 'Tersimpan' : 'Simpan'}</span>
    </button>
  {/if}
  
  <button on:click={() => { showPopup = !showPopup; showTip = false; }} class="btn-list" class:hide-mobile={hideListOnMobile} title="Bacaan Tersimpan">
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
        <button class="close-btn-mobile" on:click={() => showPopup = false}>
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
              <button on:click={() => removeBookmark(item.title)} class="delete-item-btn" aria-label="Hapus">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
    <!-- Backdrop for mobile ONLY -->
    <div class="backdrop-blur" on:click={() => showPopup = false} in:fade={{duration: 200}} out:fade={{duration: 200}}></div>
  {/if}
</div>

<style>
  .bookmark-actions { display: flex; gap: 8px; position: relative; align-items: center; }
  
  .save-tip {
    position: absolute;
    top: 55px;
    right: 0;
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
    color: white;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 700;
    box-shadow: 0 15px 35px rgba(255, 107, 107, 0.4);
    z-index: 10005;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: floatTip 3s ease-in-out infinite;
  }

  .tip-content {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .tip-close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .tip-close:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  .tip-arrow {
    position: absolute;
    top: -6px;
    right: 105px; /* Points to 'Simpan' button */
    width: 12px;
    height: 12px;
    background: #FF6B6B;
    transform: rotate(45deg);
  }

  @keyframes floatTip {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  @media (max-width: 768px) {
    .save-tip {
      top: 55px;
      right: -10px;
      font-size: 0.8rem;
      padding: 8px 12px;
    }
    .tip-arrow {
      right: 62px; /* Adjusted for mobile circular buttons */
    }
  }
  


  .btn-save, .btn-list { 
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--card-bg);
    border: 1px solid var(--border); 
    padding: 8px 16px; 
    border-radius: 20px; 
    cursor: pointer; 
    font-size: 0.875rem;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
    color: var(--text-secondary);
    height: 40px; 
    white-space: nowrap;
  }
  




  .btn-save:hover, .btn-list:hover {
    background: var(--sidebar-bg);
    border-color: #ccc;
    color: var(--text);
  }

  .btn-list.hide-mobile {
    display: flex;
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
      border: 2px solid var(--card-bg);
  }

  /* Dropdown Style */
  .bookmark-dropdown {
    position: absolute; 
    right: 0; 
    top: 55px; 
    width: 320px;
    background: var(--card-bg); 
    border: 1px solid var(--border); 
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.12); 
    z-index: 2001;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
  }

  .dropdown-header h4 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text);
  }

  /* List Style */
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
    padding: 12px 20px; 
    border-bottom: 1px solid var(--border); 
    align-items: center; 
  }

  .bookmark-list li:hover {
    background: var(--sidebar-bg);
  }

  .bookmark-link { 
    font-size: 0.875rem; 
    text-decoration: none; 
    color: var(--text); 
    line-height: 1.4;
    font-weight: 500;
    flex: 1;
    margin-right: 12px;
  }

  .delete-item-btn { 
    background: none; 
    border: none; 
    cursor: pointer; 
    color: #bbb;
    padding: 4px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .delete-item-btn:hover {
    color: #ff4444;
    background: #fff0f0;
  }

  .empty-state {
    padding: 30px 20px;
    text-align: center;
  }

  .empty-state p { margin: 0; font-size: 0.9rem; color: var(--text); font-weight: 600; }
  .empty-state .subtitle { font-weight: 400; color: var(--text-secondary); font-size: 0.8rem; margin-top: 4px; }

  .backdrop-blur {
    display: none; 
  }

  .close-btn-mobile { display: none; }

  /* Responsive Text Hide */
  @media (max-width: 768px) {
      .btn-text { display: none; }
      .btn-save span { display: none; }
      .btn-save, .btn-list { padding: 8px; border-radius: 50%; width: 40px; justify-content: center; }
      
      .btn-list.hide-mobile {
        display: none !important;
      }
      


      /* Mobile Fullscreen Bookmark List */
      .bookmark-dropdown {
        position: fixed;
        top: 0; bottom: 0; left: 0; right: 0;
        width: 100%; height: 100%;
        max-height: none;
        border-radius: 0;
        z-index: 2000;
        background: var(--bg);
      }
      .close-btn-mobile {
        display: flex;
        background: var(--sidebar-bg);
        border: 1px solid var(--border);
        width: 36px; height: 36px;
        border-radius: 50%;
        align-items: center; justify-content: center;
        cursor: pointer;
      }
      .backdrop-blur {
        display: block;
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 1999; 
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(4px);
      }
  }
</style>