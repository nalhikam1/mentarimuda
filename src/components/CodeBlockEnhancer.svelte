<script>
  import { onMount } from 'svelte';

  onMount(() => {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach((block) => {
      // Abaikan jika ada di dalam .code-group karena CodeTabs sudah punya tombol sendiri di header
      if (block.closest('.code-group')) return;
      
      // Pastikan block belum punya tombol copy
      if (block.querySelector('.copy-button')) return;

      const button = document.createElement('button');
      button.className = 'copy-button';
      button.ariaLabel = 'Copy code';
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;

      button.addEventListener('click', async () => {
        const code = block.querySelector('code')?.innerText || block.innerText;
        
        try {
          await navigator.clipboard.writeText(code);
          
          // Efek Berhasil
          button.classList.add('copied');
          button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
          
          setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            `;
          }, 2000);
        } catch (err) {
          console.error('Gagal menyalin teks: ', err);
        }
      });

      block.appendChild(button);
    });
  });
</script>

<style>
  /* Styling sudah ada di article.css, di sini kosong saja */
</style>
