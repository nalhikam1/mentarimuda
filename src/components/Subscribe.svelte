<script>
  import { addToast } from '../stores/toastStore';
  let email = '';
  let loading = false;

  async function handleSubscribe() {
    if (!email) {
      addToast('Email harus diisi ya!', 'error');
      return;
    }

    loading = true;

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        addToast('YAY! Berhasil subscribe! Cek email kamu ya. 🚀', 'success');
        email = '';
        
        // PETASAN MELEDAK (Import dinamis agar aman saat SSR/Build)
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77']
        });
      } else {
        addToast(data.message || 'Gagal subscribe. Coba lagi ya.', 'error');
      }
    } catch (error) {
      addToast('Waduh, ada masalah koneksi. Coba lagi nanti.', 'error');
    } finally {
      loading = false;
    }
  }
</script>

<div class="card">
  <div class="card__header">
    <svg class="bell-icon" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
      <path d="M106.67-564q0-93.33 41.5-171.17 41.5-77.83 111.16-129.5L299-811.33q-57.33 42.66-91.5 106.66T173.33-564h-66.66Zm680 0q0-76.67-34.17-140.67-34.17-64-91.5-106.66l39.67-53.34q69.66 51.67 111.16 129.5 41.5 77.84 41.5 171.17h-66.66ZM160-200v-66.67h80v-296q0-83.66 49.67-149.5Q339.33-778 420-796v-24q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v24q80.67 18 130.33 83.83Q720-646.33 720-562.67v296h80V-200H160Zm320-301.33ZM480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM306.67-266.67h346.66v-296q0-72-50.66-122.66Q552-736 480-736t-122.67 50.67q-50.66 50.66-50.66 122.66v296Z"></path>
    </svg>
    <h4 class="card__title">Tetap Terhubung</h4>
  </div>
  <p class="card__content">
    Dapatkan inspirasi, refleksi, dan update tulisan terbaru langsung di inbox-mu.
  </p>
  <form class="card__form" on:submit|preventDefault={handleSubscribe}>
    <input 
      type="email" 
      placeholder="Email kamu..." 
      bind:value={email}
      required
      disabled={loading}
    />
    <button type="submit" class="sign-up" disabled={loading}>
      {#if loading}
        <div class="spinner"></div>
      {:else}
        <svg
          fill="#e8eaed"
          width="24px"
          viewBox="0 -960 960 960"
          height="24px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"></path>
        </svg>
      {/if}
    </button>
  </form>
</div>

<style>
  .card {
    width: 100%;
    padding: 20px 16px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: transparent;
  }

  .card__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .bell-icon {
    width: 36px;
    height: 36px;
    fill: var(--accent);
    filter: drop-shadow(0 4px 10px rgba(255, 142, 83, 0.2));
    margin-bottom: 0;
  }

  .card__title {
    font-family: 'Merriweather', serif;
    font-size: 1.2rem;
    font-weight: 900;
    margin: 0;
    color: var(--text);
  }

  .card__content {
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--text-secondary);
    margin: 0;
  }

  .card__form {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;
    margin-top: 4px;
    align-items: center;
  }

  .card__form input {
    flex: 1;
    background: var(--code-bg);
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid var(--border);
    color: var(--text);
    font-size: 0.85rem;
    transition: all 0.2s;
    outline: none;
    box-sizing: border-box;
    display: block;
    min-width: 0;
  }

  .card__form input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(255, 142, 83, 0.15);
  }

  .card__form button {
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border: 0;
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
    color: #fff;
    border-radius: 50%;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .sign-up:hover {
    transform: scale(1.1) rotate(5deg);
    filter: brightness(1.1);
  }

  .status-msg {
    font-size: 12px;
    margin-top: 8px;
    color: #333;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #fff;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Dark Mode Overrides */
  :global(html.dark) .bell-icon {
    filter: drop-shadow(0 4px 12px rgba(255, 142, 83, 0.1));
  }
</style>
