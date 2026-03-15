<script>
  import { onMount, tick } from 'svelte';
  
  export let html = '';
  export let css = '';
  export let js = '';
  export let title = 'Interactive Demo';

  let activeTab = 'html'; 
  let iframe;
  let mounted = false;
  let hasChanges = false;

  async function runCode() {
    if (!iframe) return;
    hasChanges = false;
    activeTab = 'result';
    await tick();

    const isDark = document.documentElement.classList.contains('dark');
    const bgColor = isDark ? '#121212' : '#ffffff';
    const textColor = isDark ? '#e0e0e0' : '#333333';

    const source = `
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: sans-serif; 
              background-color: ${bgColor}; 
              color: ${textColor};
            }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch (err) {
              console.error('JS Error:', err);
              document.body.innerHTML += '<div style="color:#ff6b6b; margin-top:20px; font-size:12px; border-top:1px solid #ddd; padding-top:10px;"><strong>JS Error:</strong> ' + err.message + '</div>';
            }
          <\/script>
        </body>
      </html>
    `;
    iframe.srcdoc = source;
  }

  $: if (mounted && (html || css || js)) {
    hasChanges = true;
  }

  onMount(() => {
    mounted = true;
    runCode();
    setTimeout(() => { hasChanges = false; }, 100);
  });
</script>

<div class="playground-container" class:has-changes={hasChanges}>
  <div class="playground-header">
    <div class="tabs">
      <button class:active={activeTab === 'html'} on:click={() => activeTab = 'html'}>HTML</button>
      <button class:active={activeTab === 'css'} on:click={() => activeTab = 'css'}>CSS</button>
      <button class:active={activeTab === 'js'} on:click={() => activeTab = 'js'}>JS</button>
      <button class:active={activeTab === 'result'} on:click={() => activeTab = 'result'} class="btn-result">Result ✨</button>
    </div>

    <div class="actions">
      <button class="run-btn" on:click={runCode} class:pulse={hasChanges}>
        Run Code ⚡
      </button>
    </div>
  </div>

  <div class="content">
    <div class="pane" class:hidden={activeTab !== 'html'}>
      <textarea bind:value={html} spellcheck="false" placeholder="Tulis HTML..."></textarea>
    </div>
    <div class="pane" class:hidden={activeTab !== 'css'}>
      <textarea bind:value={css} spellcheck="false" placeholder="Tulis CSS..."></textarea>
    </div>
    <div class="pane" class:hidden={activeTab !== 'js'}>
      <textarea bind:value={js} spellcheck="false" placeholder="Tulis JavaScript..."></textarea>
    </div>
    <div class="pane" class:hidden={activeTab !== 'result'}>
      <iframe bind:this={iframe} title="preview"></iframe>
    </div>
    
    {#if hasChanges}
      <div class="status-bar">Klik "Run Code" untuk melihat perubahan</div>
    {/if}
  </div>
</div>

<style>
  .playground-container {
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--card-bg);
    overflow: hidden;
    margin: 24px 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    height: 480px; /* Tinggi PAS, tidak kepanjangan */
  }

  .playground-header {
    flex-shrink: 0;
    background: var(--sidebar-bg);
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border);
  }

  .tabs { display: flex; gap: 4px; }

  button {
    background: transparent;
    border: none;
    padding: 6px 12px;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
  }

  button.active {
    background: var(--bg);
    color: var(--accent);
  }

  .btn-result.active {
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
    color: white;
  }

  .run-btn {
    background: #4ade80;
    color: #fff;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: bold;
  }

  .run-btn.pulse {
    animation: pulse 1.5s infinite;
    background: var(--accent);
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  .content {
    flex: 1; /* MENGISI SISA RUANG FULL */
    position: relative;
    background: var(--code-bg);
    display: flex; /* Biarkan anak-anaknya stretch */
    min-height: 0; /* Penting untuk flex-child overflow */
  }

  .pane {
    width: 100%;
    height: 100%;
    display: block;
  }

  .hidden { display: none; }

  textarea {
    width: 100%;
    height: 100%;
    padding: 20px;
    border: none;
    font-family: 'Fira Code', monospace;
    font-size: 13px;
    line-height: 1.5;
    background: transparent;
    color: var(--text);
    resize: none;
    outline: none;
    display: block;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    background: white;
  }

  .status-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--accent);
    color: white;
    font-size: 0.7rem;
    padding: 4px;
    text-align: center;
    font-weight: 700;
    pointer-events: none;
    z-index: 10;
  }
</style>
