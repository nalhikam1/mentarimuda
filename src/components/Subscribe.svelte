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
  <span class="card__title"
    >Subscribe
    <svg
      fill="#333"
      width="40px"
      viewBox="0 -960 960 960"
      height="40px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M106.67-564q0-93.33 41.5-171.17 41.5-77.83 111.16-129.5L299-811.33q-57.33 42.66-91.5 106.66T173.33-564h-66.66Zm680 0q0-76.67-34.17-140.67-34.17-64-91.5-106.66l39.67-53.34q69.66 51.67 111.16 129.5 41.5 77.84 41.5 171.17h-66.66ZM160-200v-66.67h80v-296q0-83.66 49.67-149.5Q339.33-778 420-796v-24q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v24q80.67 18 130.33 83.83Q720-646.33 720-562.67v296h80V-200H160Zm320-301.33ZM480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM306.67-266.67h346.66v-296q0-72-50.66-122.66Q552-736 480-736t-122.67 50.67q-50.66 50.66-50.66 122.66v296Z"
      ></path></svg
    ></span>
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
    max-width: 340px;
    padding: 24px 15px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
    background: transparent;
    border-radius: 20px;
  }

  :global(.dark) .card {
    background: transparent;
  }

  :global(.dark) .card__title,
  :global(.dark) .card__content,
  :global(.dark) .status-msg {
    color: #e0e0e0;
  }

  :global(.dark) .card__form input {
    background: #2a2a2a;
    border-color: #444;
    color: #fff;
  }

  :global(.dark) .card__title svg {
    fill: #e0e0e0;
  }

  .card > * {
    margin: 0;
  }

  .card__title {
    font-size: 23px;
    font-weight: 900;
    color: #333;
  }

  .card__content {
    font-size: 13px;
    line-height: 18px;
    color: #333;
    margin: 10px;
  }

  .card__form {
    display: flex;
    flex-direction: row;
    gap: 10px;
    width: 100%;
    padding: 0 10px;
  }

  .card__form input {
    flex: 1;
    min-width: 0;
    outline: 0;
    background: rgb(255, 255, 255);
    box-shadow: transparent 0px 0px 0px 1px inset;
    padding: 0.6em;
    border-radius: 14px;
    border: 1px solid #333;
    color: black;
  }

  .card__form button {
    border: 0;
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
    color: #fff;
    padding: 0.68em;
    border-radius: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign-up:hover {
    transform: scale(1.05);
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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
