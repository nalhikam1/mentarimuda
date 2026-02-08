<script>
  import { onMount } from 'svelte';

  let searchTerm = '';
  let filteredResults = [];
  let showResults = false;
  let searchData = [];

  onMount(async () => {
    try {
      const res = await fetch('/api/search.json');
      searchData = await res.json();
    } catch (err) {
      console.error('Gagal mengambil data pencarian:', err);
    }
  });

  function handleSearch() {
    if (searchTerm.trim() === '') {
      filteredResults = [];
      showResults = false;
      return;
    }

    const term = searchTerm.toLowerCase();
    filteredResults = searchData.filter(item => 
      item.title.toLowerCase().includes(term) || 
      (item.category && item.category.toLowerCase().includes(term))
    );
    showResults = true;
  }

  function handleBlur() {
    // Delay biar link hasil pencarian masih bisa diklik sebelum ketutup
    setTimeout(() => {
      showResults = false;
    }, 200);
  }

  function handleFocus() {
      if(searchTerm.trim() !== '') showResults = true;
  }
</script>

<div class="search-container">
  <div class="search-box">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <input 
      type="text" 
      placeholder="Cari artikel..." 
      bind:value={searchTerm}
      on:input={handleSearch}
      on:focus={handleFocus}
      on:blur={handleBlur}
    >
  </div>

  {#if showResults && filteredResults.length > 0}
    <div class="search-results">
      {#each filteredResults as result}
        <a href={result.url} class="search-item">
          <div class="search-item-title">{result.title}</div>
        </a>
      {/each}
    </div>
  {:else if showResults && searchTerm.length > 0}
     <div class="search-results">
        <div class="search-empty">Tidak ada hasil ditemukan.</div>
     </div>
  {/if}
</div>

<style>
  .search-container {
    position: relative;
    width: 100%;
    max-width: 400px; /* Batasi lebar agar estetik */
  }

  .search-box {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: 14px;
    color: var(--text-secondary);
    pointer-events: none;
    transition: color 0.2s;
  }

  .search-box input {
    width: 100%;
    padding: 10px 16px 10px 44px; /* Tambah padding kiri agar tidak nabrak icon */
    border: 1px solid var(--border);
    border-radius: 20px;
    font-size: 0.9rem;
    background: var(--code-bg); /* Use code-bg (slightly lighter) for inputs */
    color: var(--text);
    transition: all 0.2s;
    outline: none;
  }

  .search-box input:focus {
    background: var(--bg);
    border-color: #FF8E53;
    box-shadow: 0 0 0 3px rgba(255, 142, 83, 0.1);
  }

  .search-box input:focus + .search-icon,
  .search-box:focus-within .search-icon {
    color: #FF8E53; /* Icon ikut berwarna saat aktif */
  }


  .search-results {
    position: absolute;
    top: 110%; /* Muncul sedikit di bawah input */
    left: 0;
    width: 100%;
    background: var(--card-bg);
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    border-radius: 12px;
    padding: 8px 0;
    z-index: 105; /* Di atas segalanya */
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid var(--border);
  }

  .search-item {
    display: block;
    padding: 12px 16px;
    text-decoration: none;
    color: var(--text);
    transition: background 0.1s;
    border-left: 3px solid transparent;
  }

  .search-item:hover {
    background: var(--sidebar-bg); /* Hint warna brand */
    border-left-color: #FF6B6B;
  }

  .search-item-title {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text);
    margin-bottom: 4px;
  }

  .search-item-desc {
    font-size: 0.8rem;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .search-empty {
      padding: 16px;
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.9rem;
  }
</style>
