<script>
  import { onMount } from 'svelte';
  import { toasts, removeToast, addToast } from '../stores/toastStore';
  import { flip } from 'svelte/animate';
  import { fade, fly } from 'svelte/transition';

  const typeStyles = {
    success: 'bg-success',
    error: 'bg-error',
    info: 'bg-info',
    bookmark: 'bg-bookmark'
  };

  onMount(() => {
    const handleShowToast = (e) => {
      const { message, type, duration, position } = e.detail;
      addToast(message, type, duration, position || 'bottom');
    };

    window.addEventListener('showToast', handleShowToast);
    return () => window.removeEventListener('showToast', handleShowToast);
  });
</script>

<!-- Top Container (Ex: Save Guide) -->
<div class="toast-container top">
  {#each $toasts.filter(t => t.position === 'top') as toast (toast.id)}
    <div
      animate:flip={{ duration: 300 }}
      in:fly={{ y: -20, duration: 400, opacity: 0 }}
      out:fade={{ duration: 200 }}
      class="toast {typeStyles[toast.type] || 'bg-info'} {toast.type === 'bookmark' ? 'toast-bookmark' : ''}"
      on:click={() => removeToast(toast.id)}
    >
      <div class="toast-content">
        {#if toast.type === 'bookmark'}
          <div class="icon-circle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        {:else}
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        {/if}
        <span class="message">{toast.message}</span>
      </div>
      <button class="close-btn" aria-label="Tutup">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  {/each}
</div>

<!-- Bottom Container (Ex: Success/Error) -->
<div class="toast-container bottom">
  {#each $toasts.filter(t => t.position !== 'top') as toast (toast.id)}
    <div
      animate:flip={{ duration: 300 }}
      in:fly={{ y: 20, duration: 400, opacity: 0 }}
      out:fade={{ duration: 200 }}
      class="toast {typeStyles[toast.type] || 'bg-info'}"
      on:click={() => removeToast(toast.id)}
    >
      <div class="toast-content">
        {#if toast.type === 'success'}
          <div class="icon-circle success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        {:else if toast.type === 'error'}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
        {:else}
          <div class="icon-circle info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
        {/if}
        <span class="message">{toast.message}</span>
      </div>
      <button class="close-btn" aria-label="Tutup">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    pointer-events: none;
  }

  .toast-container.top {
    top: 68px;
    right: 24px;
    max-width: 320px;
  }

  .toast-container.bottom {
    bottom: 24px;
    right: 24px;
    max-width: 320px;
  }

  @media (min-width: 1201px) {
    .toast-container.top {
      right: calc(50% - 150px);
    }
  }

  @media (min-width: 969px) {
    .toast-container.top {
      right: 340px; 
      max-width: 280px;
    }
  }

  .toast {
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-radius: 14px;
    color: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    width: 100%;
    backdrop-filter: blur(12px);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 10001;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .toast:hover {
    transform: translateY(-3px) scale(1.02);
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  .bg-success, .bg-info {
    background: #ffffff;
    color: #333 !important;
    border: 1px solid var(--border);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  }

  :global(html.dark) .bg-success, :global(html.dark) .bg-info {
    background: #1e1e1e;
    color: #eee !important;
  }

  .bg-error {
    background: linear-gradient(135deg, #c62828 0%, #e53935 100%);
  }

  .bg-bookmark {
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
    color: white !important;
    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.3);
    position: relative;
  }

  /* Triangle Arrow for Bookmark Toast on Desktop */
  @media (min-width: 641px) {
    .bg-bookmark::after {
      content: "";
      position: absolute;
      top: -8px;
      right: 40px;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid #FF7565;
    }
  }

  .icon-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  .icon-circle.success {
    background: #FF6B6B;
    color: white;
  }

  .icon-circle.info {
    background: #f0f0f0;
    color: #666;
  }

  .bg-bookmark .icon-circle {
    background: white;
    color: #FF6B6B;
  }

  .bg-bookmark .close-btn {
    color: rgba(255, 255, 255, 0.8);
  }

  .message {
    line-height: 1.4;
  }

  .close-btn {
    background: none;
    border: none;
    color: rgba(0, 0, 0, 0.3);
    padding: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .bg-bookmark .close-btn, .bg-error .close-btn {
    color: rgba(255, 255, 255, 0.6);
  }

  :global(html.dark) .close-btn {
    color: rgba(255, 255, 255, 0.3);
  }

  .close-btn:hover {
    color: var(--text);
    transform: rotate(90deg);
  }

  .bg-bookmark .close-btn:hover, .bg-error .close-btn:hover {
    color: white;
  }

  @media (max-width: 640px) {
    .toast-container.top {
      top: 70px;
      right: 16px;
      left: 16px;
      width: auto;
      max-width: none;
    }

    .toast-container.bottom {
      bottom: 80px; /* Di atas bottom nav */
      right: 16px;
      left: 16px;
      width: auto;
      max-width: none;
    }
    
    .toast {
      padding: 10px 14px;
      font-size: 0.85rem;
    }
  }

  .toast-bookmark {
    animation: bounceInTop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @keyframes bounceInTop {
    0% { transform: translateY(-30px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
</style>
