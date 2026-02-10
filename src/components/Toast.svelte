  import { onMount } from 'svelte';
  import { toasts, removeToast, addToast } from '../stores/toastStore';
  import { flip } from 'svelte/animate';
  import { fade, fly } from 'svelte/transition';

  const typeStyles = {
    success: 'bg-success',
    error: 'bg-error',
    info: 'bg-info'
  };

  onMount(() => {
    const handleShowToast = (e) => {
      const { message, type, duration } = e.detail;
      addToast(message, type, duration);
    };

    window.addEventListener('showToast', handleShowToast);
    return () => window.removeEventListener('showToast', handleShowToast);
  });
</script>

<div class="toast-container">
  {#each $toasts as toast (toast.id)}
    <div
      animate:flip={{ duration: 300 }}
      in:fly={{ y: 20, duration: 400, opacity: 0 }}
      out:fade={{ duration: 200 }}
      class="toast {typeStyles[toast.type] || 'bg-info'}"
      on:click={() => removeToast(toast.id)}
    >
      <div class="toast-content">
        {#if toast.type === 'success'}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        {:else if toast.type === 'error'}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
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

<style>
  .toast-container {
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 400px;
    padding: 0 20px;
    pointer-events: none;
  }

  .toast {
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-radius: 12px;
    color: white;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    width: 100%;
    backdrop-filter: blur(12px);
    transition: all 0.2s ease;
    z-index: 10001;
  }

  .toast:hover {
    transform: translateY(-2px);
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  .bg-success {
    background: linear-gradient(135deg, #2e7d32 0%, #43a047 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .bg-error {
    background: linear-gradient(135deg, #c62828 0%, #e53935 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .bg-info {
    background: linear-gradient(135deg, #1565c0 0%, #1e88e5 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .message {
    line-height: 1.4;
  }

  .close-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }

  .close-btn:hover {
    color: white;
  }

  @media (max-width: 640px) {
    .toast-container {
      top: auto;
      bottom: 80px; /* Di atas bottom nav */
    }
  }
</style>
