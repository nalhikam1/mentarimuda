<script>
  import { onMount } from 'svelte';

  let savedPosts = [];

  // Fungsi baca dari localStorage
  function loadBookmarks() {
    try {
      const stored = localStorage.getItem('mentari-bookmarks');
      if (stored) {
        savedPosts = JSON.parse(stored);
      } else {
        savedPosts = [];
      }
    } catch (e) {
      console.error('Error loading bookmarks', e);
    }
  }

  onMount(() => {
    loadBookmarks();

    // Listen event storage (jika berubah di tab lain)
    window.addEventListener('storage', loadBookmarks);
    
    // Custom event jika diupdate dari komponen Bookmark.svelte di halaman yang sama
    window.addEventListener('bookmarksUpdated', loadBookmarks);
    
    // Custom event untuk trigger reload manual (misal saat panel dibuka)
    window.addEventListener('reloadBookmarks', loadBookmarks);

    return () => {
        window.removeEventListener('storage', loadBookmarks);
        window.removeEventListener('bookmarksUpdated', loadBookmarks);
        window.removeEventListener('reloadBookmarks', loadBookmarks);
    };
  });
</script>

<div class="bookmark-list-container">
  {#if savedPosts.length === 0}
    <div class="empty-state">
      <p>Belum ada artikel yang disimpan.</p>
    </div>
  {:else}
    <div class="list">
      {#each savedPosts as post}
        <a href={post.url} class="bookmark-item">
            <span class="bookmark-title">{post.title}</span>
            <span class="bookmark-arrow">→</span>
        </a>
      {/each}
    </div>
  {/if}
</div>

<style>
  .bookmark-list-container {
    padding: 16px 0;
  }
  
  .empty-state {
    text-align: center;
    color: var(--text-secondary);
    padding: 24px;
    font-size: 0.9rem;
  }

  .bookmark-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
    text-decoration: none;
    color: var(--text);
    transition: all 0.2s;
  }

  .bookmark-item:last-child {
      border-bottom: none;
  }

  .bookmark-item:hover {
      padding-left: 8px;
      color: var(--accent);
  }

  .bookmark-title {
      font-weight: 500;
      font-size: 0.95rem;
  }

  .bookmark-arrow {
      color: var(--text-secondary);
      font-size: 1.2rem;
  }
</style>
