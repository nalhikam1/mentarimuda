
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
    } else {
        input.type = 'password';
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    }
}

function switchAuthTab(tab) {
    document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
    document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
    document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
    clearAuthError();
}

function showAuthError(msg) { const e = document.getElementById('authError'); e.textContent = msg; e.classList.add('show'); }
function clearAuthError() { document.getElementById('authError').classList.remove('show'); }
function setAuthLoading(v) { document.getElementById('authLoading').classList.toggle('show', v); }
function setAuthBtnDisabled(v) {
    document.getElementById('loginBtn').disabled = v;
    document.getElementById('registerBtn').disabled = v;
}

async function doEmailLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value;
    if (!email || !pass) { showAuthError('Isi email dan password dulu.'); return; }
    clearAuthError(); setAuthLoading(true); setAuthBtnDisabled(true);
    try {
        await window._fb.signInWithEmailAndPassword(window._fb.auth, email, pass);
    } catch (e) {
        const msgs = {
            'auth/user-not-found': 'Akun tidak ditemukan.',
            'auth/wrong-password': 'Password salah.',
            'auth/invalid-email': 'Email tidak valid.',
            'auth/invalid-credential': 'Email atau password salah.',
            'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.'
        };
        showAuthError(msgs[e.code] || 'Login gagal: ' + e.message);
    } finally { setAuthLoading(false); setAuthBtnDisabled(false); }
}

async function doRegister() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    if (!name || !email || !pass) { showAuthError('Semua kolom wajib diisi.'); return; }
    if (pass.length < 6) { showAuthError('Password minimal 6 karakter.'); return; }
    clearAuthError(); setAuthLoading(true); setAuthBtnDisabled(true);
    try {
        const cred = await window._fb.createUserWithEmailAndPassword(window._fb.auth, email, pass);
        await window._fb.updateProfile(cred.user, { displayName: name });
        cred.user.displayName = name; // update local ref
    } catch (e) {
        const msgs = {
            'auth/email-already-in-use': 'Email sudah dipakai akun lain.',
            'auth/invalid-email': 'Email tidak valid.',
            'auth/weak-password': 'Password terlalu lemah.'
        };
        showAuthError(msgs[e.code] || 'Gagal daftar: ' + e.message);
    } finally { setAuthLoading(false); setAuthBtnDisabled(false); }
}

function showForgotForm(show = true) {
    document.getElementById('loginForm').style.display = show ? 'none' : 'block';
    document.getElementById('forgotForm').style.display = show ? 'block' : 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('tabLogin').classList.toggle('active', !show);
    document.getElementById('tabRegister').classList.remove('active');
    clearAuthError();
    if (show) setTimeout(() => document.getElementById('forgotEmail').focus(), 50);
}

async function doResetPassword() {
    const email = document.getElementById('forgotEmail').value.trim();
    if (!email) { showAuthError('Masukkan email dulu.'); return; }
    clearAuthError(); setAuthLoading(true);
    document.getElementById('forgotBtn').disabled = true;
    try {
        await window._fb.sendPasswordResetEmail(window._fb.auth, email);
        showAuthError('');
        document.getElementById('forgotForm').innerHTML = `
    <div style="text-align:center;padding:10px 0">
        <div style="font-size:32px;margin-bottom:12px">📬</div>
        <div style="font-size:14px;font-weight:600;margin-bottom:6px">Email terkirim!</div>
        <div style="font-size:12.5px;color:#94A3B8;line-height:1.6;margin-bottom:16px">
            Cek inbox <strong>${email}</strong> — klik link di email untuk reset password.<br />Cek folder spam jika tidak muncul.
        </div>
        <button onclick="switchAuthTab('login')" style="background:none;border:none;font-size:12.5px;color:#94A3B8;cursor:pointer;font-family:inherit;text-decoration:underline;text-underline-offset:2px">← Kembali ke login</button>
    </div>`;
    } catch (e) {
        const msgs = {
            'auth/user-not-found': 'Email tidak terdaftar.',
            'auth/invalid-email': 'Format email tidak valid.',
            'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu beberapa menit.'
        };
        showAuthError(msgs[e.code] || 'Gagal kirim email: ' + e.message);
        document.getElementById('forgotBtn').disabled = false;
    } finally { setAuthLoading(false); }
}

async function doGoogleLogin() {
    clearAuthError(); setAuthLoading(true);
    try {
        const provider = new window._fb.GoogleAuthProvider();
        await window._fb.signInWithPopup(window._fb.auth, provider);
    } catch (e) {
        if (e.code !== 'auth/popup-closed-by-user')
            showAuthError('Login Google gagal: ' + e.message);
    } finally { setAuthLoading(false); }
}

async function doLogout() {
    if (!confirm('Keluar dari akun?')) return;
    closeModal('modalUser');
    await window._fb.signOut(window._fb.auth);
    showToast('Berhasil keluar');
}

// ── Firestore helpers ─────────────────────────────────────
let _uid = null;
let _unsubProfiles = null;
let _saveTimers = {};
let _saveResolvers = {};

function fsDoc(path) { return window._fb.doc(window._fb.db, path); }

function setSyncStatus(state) {
    const dot = document.getElementById('syncDot');
    const text = document.getElementById('syncText');
    if (!dot) return;
    dot.className = 'sync-dot' + (state === 'syncing' ? ' syncing' : state === 'error' ? ' error' : '');
    text.textContent = state === 'syncing' ? 'Menyimpan…' : state === 'error' ? 'Error sync' : 'Tersimpan';
}

// ── Debounced save to Firestore ───────────────────────────
async function saveToCloud(profId, type, data) {
    setSyncStatus('syncing');
    if (_saveTimers[type]) clearTimeout(_saveTimers[type]);
    if (_saveResolvers[type]) _saveResolvers[type]();

    return new Promise((resolve) => {
        _saveResolvers[type] = resolve;
        _saveTimers[type] = setTimeout(async () => {
            try {
                await window._fb.setDoc(
                    fsDoc(`users/${_uid}/profiles/${profId}/${type}/data`),
                    { items: data, updatedAt: new Date().toISOString() },
                    { merge: true }
                );
                setSyncStatus('saved');
            } catch (e) {
                console.error('Sync error:', e);
                setSyncStatus('error');
            }
            if (_saveResolvers[type]) {
                _saveResolvers[type]();
                _saveResolvers[type] = null;
            }
        }, 600);
    });
}

async function loadFromCloud(profId, type) {
    try {
        const snap = await window._fb.getDoc(fsDoc(`users/${_uid}/profiles/${profId}/${type}/data`));
        if (snap.exists()) return snap.data().items || [];
    } catch (e) { console.error('Load error:', e); }
    return [];
}

// ── Init app after login ──────────────────────────────────
window.initApp = async function (user) {
    _uid = user.uid;

    // Update user UI
    const name = user.displayName || user.email.split('@')[0];
    const initials = name.slice(0, 2).toUpperCase();
    document.getElementById('userAvatar').textContent = initials;
    document.getElementById('userAvatarBig').textContent = initials;
    document.getElementById('userName').textContent = name;
    document.getElementById('userNameBig').textContent = name;
    document.getElementById('userNameGreeting').textContent = name;
    document.getElementById('userEmailBig').textContent = user.email;

    // Load profiles list from Firestore
    try {
        const snap = await window._fb.getDoc(fsDoc(`users/${_uid}/meta/profiles`));
        if (snap.exists() && Array.isArray(snap.data().list) && snap.data().list.length) {
            profiles = snap.data().list;
        } else {
            profiles = [{ id: 'default', name: 'Utama' }];
            await window._fb.setDoc(fsDoc(`users/${_uid}/meta/profiles`), { list: profiles });
        }
    } catch (e) {
        profiles = [{ id: 'default', name: 'Utama' }];
    }

    // Set active profile
    activeProf = localStorage.getItem(`is_${_uid}_active`) || profiles[0].id;
    if (!profiles.find(p => p.id === activeProf)) activeProf = profiles[0].id;
    localStorage.setItem(`is_${_uid}_active`, activeProf);

    applyTheme(localStorage.getItem('ideaspace_theme') === 'dark');
    await reloadProfileData();
};

// ─── PROFILE SYSTEM ──────────────────────────────────────
let profiles = [];
let activeProf = 'default';

function pk(type) { return activeProf + '_' + type; }

async function saveProfiles() {
    await window._fb.setDoc(fsDoc(`users/${_uid}/meta/profiles`), { list: profiles });
}

// ─── STATE ───────────────────────────────────────────────
const STATUS = [
    { id: 'muncul', label: 'Muncul', dot: '#94A3B8', bg: '#F4F4F0' },
    { id: 'bingung', label: 'Bingung', dot: '#F97316', bg: '#FFF7ED' },
    { id: 'paham', label: 'Paham', dot: '#3B82F6', bg: '#EFF6FF' },
    { id: 'terwujud', label: 'Terwujud', dot: '#10B981', bg: '#ECFDF5' },
];

function migrateStatus(s) {
    if (s === 'baru') return 'muncul';
    if (s === 'proses') return 'bingung';
    if (s === 'terlaksana') return 'terwujud';
    if (s === 'arsip') return 'bingung';
    return STATUS.find(x => x.id === s) ? s : 'muncul';
}

let ideas = [];
let cats = [];
let activeFilter = 'Semua';
let activeCatFilter = 'all';
let activeStatusFilter = 'semua';

// ─── HELPERS ─────────────────────────────────────────────
function hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
}
function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }

function getWIB() {
    const now = new Date();
    const wib = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const pad = n => String(n).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    return {
        ts: wib.toISOString(),
        display: `${pad(wib.getDate())} ${months[wib.getMonth()]} ${wib.getFullYear()} — ${pad(wib.getHours())}:${pad(wib.getMinutes())}`,
        obj: wib
    };
}

function inRange(ts, f) {
    if (f === 'Semua') return true;
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const d = new Date(ts);
    if (f === 'Harian') return d.toDateString() === now.toDateString();
    if (f === 'Mingguan') { const sw = new Date(now); sw.setDate(now.getDate() - now.getDay()); sw.setHours(0, 0, 0, 0); return d >= sw; }
    if (f === 'Bulanan') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (f === 'Tahunan') return d.getFullYear() === now.getFullYear();
    return true;
}

function catById(id) { return cats.find(c => c.id === id) || { label: '—', color: '#94A3B8', bg: '#F4F4F0' } }
function statusById(id) { return STATUS.find(s => s.id === id) || STATUS[0] }

// ─── CLOCK ───────────────────────────────────────────────
function updateClock() {
    const { display } = getWIB();
    const el = document.getElementById('clock');
    if (el) el.textContent = display + ' WIB';
}
updateClock();
setInterval(updateClock, 1000);

// ─── TOAST ───────────────────────────────────────────────
let toastTimer;
function showToast(msg, warn = false, success = false) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show' + (warn ? ' warn' : success ? ' success' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.className = 'toast', 2800);
}

// ─── CATEGORY DROPDOWN ───────────────────────────────────
function buildCatSelect() {
    const sel = document.getElementById('ideaCat');
    if (!sel) return;
    if (!cats.length) { sel.innerHTML = '<option value="">— Buat kategori dulu —</option>'; return; }
    sel.innerHTML = cats.map(c => `<option value="${c.id}">${c.label}</option>`).join('');
}

// ─── CAT FILTER ──────────────────────────────────────────
function renderCatFilterPills() {
    const btn = document.getElementById('catFilterBtn');
    const lbl = document.getElementById('catFilterLabel');
    const badge = document.getElementById('catFilterBadge');
    if (!btn) return;
    if (activeCatFilter === 'all') {
        btn.classList.remove('has-filter'); lbl.textContent = 'Semua Kategori'; badge.textContent = '▾';
    } else {
        const c = catById(activeCatFilter);
        btn.classList.add('has-filter'); lbl.textContent = c.label; badge.textContent = '✕';
        badge.onclick = (e) => { e.stopPropagation(); setCatFilter('all'); };
    }
    const container = document.getElementById('fmodalCatPills');
    if (!container) return;
    let html = `<button class="fmodal-pill ${activeCatFilter === 'all' ? 'fpill-active' : ''}" onclick="setCatFilter('all');closeModal('modalFilterCat')">
    <span class="dot" style="background:${activeCatFilter === 'all' ? 'rgba(255,255,255,.6)' : '#94A3B8'}"></span>Semua
    <span class="count-badge" style="background:${activeCatFilter === 'all' ? 'rgba(255,255,255,.25)' : '#F0F0EC'};color:${activeCatFilter === 'all' ? 'inherit' : '#888'}">${ideas.length}</span>
  </button>`;
    cats.forEach(c => {
        const count = ideas.filter(i => i.cat === c.id).length;
        const isActive = activeCatFilter === c.id;
        html += `<button class="fmodal-pill ${isActive ? 'fpill-active' : ''}"
      style="${isActive ? `background:${hexToRgba(c.color, .15)};border-color:${c.color};color:${c.color}` : ''}"
      onclick="setCatFilter('${c.id}');closeModal('modalFilterCat')">
      <span class="dot" style="background:${c.color}"></span>${escHtml(c.label)}
      <span class="count-badge" style="background:${isActive ? hexToRgba(c.color, .2) : '#F0F0EC'};color:${isActive ? c.color : '#888'}">${count}</span>
    </button>`;
    });
    container.innerHTML = html;
}

function setCatFilter(catId) { activeCatFilter = catId; renderCatFilterPills(); renderIdeas(); updateActiveFiltersBar(); }

// ─── STATUS FILTER ───────────────────────────────────────
function renderStatusPills() {
    const btn = document.getElementById('statusFilterBtn');
    const lbl = document.getElementById('statusFilterLabel');
    const badge = document.getElementById('statusFilterBadge');
    if (!btn) return;
    if (activeStatusFilter === 'semua') {
        btn.classList.remove('has-filter'); lbl.textContent = 'Semua Status'; badge.textContent = '▾'; badge.onclick = null;
    } else {
        const s = statusById(activeStatusFilter);
        btn.classList.add('has-filter'); lbl.textContent = s.label; badge.textContent = '✕';
        badge.onclick = (e) => { e.stopPropagation(); setStatusFilter('semua'); };
    }
    const container = document.getElementById('fmodalStatusPills');
    if (!container) return;
    let html = `<button class="fmodal-pill ${activeStatusFilter === 'semua' ? 'fpill-active' : ''}" onclick="setStatusFilter('semua');closeModal('modalFilterStatus')">
    <span class="dot" style="background:#94A3B8"></span>Semua Status
  </button>`;
    STATUS.forEach(s => {
        const isActive = activeStatusFilter === s.id;
        const count = ideas.filter(i => i.status === s.id).length;
        html += `<button class="fmodal-pill ${isActive ? 'fpill-active' : ''}"
      style="${isActive ? `background:${hexToRgba(s.dot, .12)};border-color:${s.dot};color:${s.dot}` : ''}"
      onclick="setStatusFilter('${s.id}');closeModal('modalFilterStatus')">
      <span class="dot" style="background:${s.dot}"></span>${s.label}
      <span class="count-badge" style="background:${isActive ? hexToRgba(s.dot, .2) : '#F0F0EC'};color:${isActive ? s.dot : '#888'}">${count}</span>
    </button>`;
    });
    container.innerHTML = html;
}

function setStatusFilter(statusId) { activeStatusFilter = statusId; renderStatusPills(); renderIdeas(); renderStats(); updateActiveFiltersBar(); }

function openFilterModal(type) {
    if (type === 'cat') { renderCatFilterPills(); openModal('modalFilterCat'); }
    else { renderStatusPills(); openModal('modalFilterStatus'); }
}

// ─── ACTIVE FILTER BAR ────────────────────────────────────
function updateActiveFiltersBar() {
    const bar = document.getElementById('activeFiltersBar');
    if (!bar) return;
    const tags = [];
    if (activeCatFilter !== 'all') {
        const c = catById(activeCatFilter);
        tags.push(`<div class="active-tag" style="background:${c.color}"><span class="dot" style="background:rgba(255,255,255,.5)"></span>${escHtml(c.label)}<button onclick="setCatFilter('all')">✕</button></div>`);
    }
    if (activeStatusFilter !== 'semua') {
        const s = statusById(activeStatusFilter);
        tags.push(`<div class="active-tag" style="background:${s.dot}"><span class="dot" style="background:rgba(255,255,255,.5)"></span>${s.label}<button onclick="setStatusFilter('semua')">✕</button></div>`);
    }
    bar.innerHTML = tags.join('');
}

// ─── STATS ───────────────────────────────────────────────
function renderStats() {
    const total = ideas.length, muncul = ideas.filter(i => i.status === 'muncul').length,
        bingung = ideas.filter(i => i.status === 'bingung').length,
        paham = ideas.filter(i => i.status === 'paham').length,
        terwujud = ideas.filter(i => i.status === 'terwujud').length;
    const statsData = [
        { label: 'Total Ide', val: total, accent: '#111', status: 'all_total' },
        { label: 'Muncul', val: muncul, accent: '#94A3B8', status: 'muncul' },
        { label: 'Bingung', val: bingung, accent: '#F97316', status: 'bingung' },
        { label: 'Paham', val: paham, accent: '#3B82F6', status: 'paham' },
        { label: 'Terwujud', val: terwujud, accent: '#10B981', status: 'terwujud' },
    ];
    const el = document.getElementById('stats');
    if (!el) return;
    el.innerHTML = statsData.map(s => {
        const isActive = s.status !== 'all_total' && activeStatusFilter === s.status;
        return `<div class="stat-card ${isActive ? 'active-stat' : ''}" onclick="${s.status === 'all_total' ? `setStatusFilter('semua')` : `setStatusFilter('${s.status}')`}">
      <div class="mono stat-val" style="font-size:26px;font-weight:500;color:${isActive ? 'inherit' : s.accent};line-height:1">${s.val}</div>
      <div class="stat-lbl" style="font-size:11.5px;color:${isActive ? 'inherit' : '#94A3B8'};margin-top:5px;font-weight:500">${s.label}</div>
    </div>`;
    }).join('');
}

// ─── IDEAS ───────────────────────────────────────────────
function renderIdeas() {
    const q = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
    const list = ideas.filter(i =>
        inRange(i.ts, activeFilter) &&
        (activeStatusFilter === 'semua' || i.status === activeStatusFilter) &&
        (activeCatFilter === 'all' || i.cat === activeCatFilter) &&
        (!q || i.title.toLowerCase().includes(q))
    );
    const countEl = document.getElementById('ideaCount');
    if (countEl) {
        if (list.length === ideas.length) countEl.innerHTML = `<strong style="color:#111">${ideas.length}</strong> ide tersimpan`;
        else countEl.innerHTML = `Menampilkan <strong style="color:#111">${list.length}</strong> dari ${ideas.length} ide`;
    }
    const grid = document.getElementById('ideasGrid');
    if (!grid) return;
    if (!list.length) {
        grid.innerHTML = `<div class="empty">
      <div style="font-size:40px;margin-bottom:12px">💡</div>
      <div style="font-size:15px;font-weight:600;color:#333;margin-bottom:6px">Tidak ada ide ditemukan</div>
      <div style="font-size:13px;line-height:1.6">${q ? 'Coba kata kunci lain.' : ideas.length ? 'Coba ubah filter di atas.' : 'Mulai tulis ide pertamamu di atas!'}</div>
      ${(activeCatFilter !== 'all' || activeStatusFilter !== 'semua') ? '<button class="btn btn-light" onclick="resetFilters()" style="margin-top:14px">Reset Filter</button>' : ''}
    </div>`;
        return;
    }
    grid.innerHTML = list.map((i, idx) => {
        const cv = catById(i.cat), s = statusById(i.status);
        return `<div class="card card-appear" style="--cat-color:${cv.color};animation-delay:${Math.min(idx * 0.03, 0.3)}s" onclick="openDetail('${i.id}')">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:10px">
        <span class="cat-chip" style="background:${cv.bg};color:${cv.color}">${escHtml(cv.label)}</span>
        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
          <span class="mono card-num" style="font-size:11px;font-weight:600">#${i.num || '—'}</span>
          <div class="tag-row card-status-tag" style="background:${s.bg};padding:2px 7px;border-radius:6px">
            <span class="dot" style="background:${s.dot}"></span>${s.label}
          </div>
        </div>
      </div>
      <div class="card-title" style="font-size:14.5px;font-weight:500;line-height:1.5;margin-bottom:10px">${escHtml(i.title)}</div>
      <div class="mono card-date" style="font-size:11px">${i.display}</div>
    </div>`;
    }).join('');
}

function resetFilters() {
    activeCatFilter = 'all'; activeStatusFilter = 'semua';
    const si = document.getElementById('searchInput'); if (si) si.value = '';
    renderCatFilterPills(); renderStatusPills(); renderIdeas(); renderStats(); updateActiveFiltersBar();
}

// ─── ADD IDEA ─────────────────────────────────────────────
async function addIdea() {
    const titleEl = document.getElementById('ideaTitle');
    const title = titleEl.value.trim();
    if (!title) { titleEl.focus(); showToast('Tulis ide dulu ya!', true); return; }
    if (!cats.length) { showToast('Buat kategori dulu di menu Kategori', true); return; }
    const cat = document.getElementById('ideaCat').value;
    const { ts, display } = getWIB();
    const nextNum = ideas.length ? Math.max(...ideas.map(i => i.num || 0)) + 1 : 1;
    ideas.unshift({ id: Date.now().toString(), num: nextNum, title, cat, status: 'muncul', ts, display });
    await saveToCloud(activeProf, 'ideas', ideas);
    titleEl.value = ''; titleEl.focus();
    renderStats(); renderCatFilterPills(); renderIdeas(); updateActiveFiltersBar();
    showToast('Ide berhasil disimpan ✓', false, true);
}

// ─── DETAIL ───────────────────────────────────────────────
function openDetail(id) {
    const idea = ideas.find(i => i.id === id); if (!idea) return;
    const c = catById(idea.cat);
    document.getElementById('detailContent').innerHTML = `
    <div style="margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span class="mono card-num" style="font-size:12px;font-weight:700">#${idea.num || '—'}</span>
        <div class="section-label" style="margin:0;font-size:10.5px">JUDUL IDE</div>
      </div>
      <div class="detail-title" style="font-size:17px;font-weight:600;line-height:1.45;display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <span style="flex:1">${escHtml(idea.title)}</span>
        <button onclick="copyIdeaTitle('${id}', this)" style="background:none;border:none;cursor:pointer;color:#94A3B8;padding:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0" title="Salin Judul">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
      </div>
    </div>
    <div class="detail-grid">
      <div class="detail-box">
        <div class="section-label" style="margin-bottom:6px;font-size:10.5px">KATEGORI</div>
        <div class="cat-chip" style="background:${c.bg};color:${c.color};display:inline-flex;align-items:center;gap:5px">
          <span class="dot" style="background:${c.color}"></span>${escHtml(c.label)}
        </div>
      </div>
      <div class="detail-box">
        <div class="section-label" style="margin-bottom:6px;font-size:10.5px">WAKTU (WIB)</div>
        <div class="mono card-date" style="font-size:11.5px">${idea.display}</div>
      </div>
    </div>
    <div style="margin-bottom:16px">
      <div class="section-label" style="margin-bottom:10px;font-size:10.5px">UBAH STATUS</div>
      <div style="display:flex;gap:7px;flex-wrap:wrap">
        ${STATUS.map(s => `<button class="btn pill detail-status-btn" onclick="updateStatus('${id}','${s.id}')" data-active="${idea.status === s.id}"
          style="${idea.status === s.id ? `background:${s.dot};color:#fff;border-color:${s.dot}` : `background:${s.bg};border-color:transparent`}">
          <span class="dot" style="background:${idea.status === s.id ? 'rgba(255,255,255,.7)' : s.dot}"></span>${s.label}
        </button>`).join('')}
      </div>
    </div>
    <hr class="divider"/>
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
      <button class="btn btn-light" onclick="closeModal('detailModal')" style="font-size:12px">Tutup</button>
      <button class="btn btn-danger" onclick="deleteIdea('${id}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
        Hapus Ide
      </button>
    </div>`;
    document.getElementById('detailModal').classList.add('open');
}

async function copyIdeaTitle(id, btn) {
    const idea = ideas.find(i => i.id === id); if (!idea) return;
    try {
        await navigator.clipboard.writeText(idea.title);
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        showToast('Judul ide disalin!', false, true);
        setTimeout(() => btn.innerHTML = originalHtml, 2000);
    } catch (err) {
        showToast('Gagal menyalin', true);
    }
}

async function updateStatus(id, status) {
    ideas = ideas.map(i => i.id === id ? { ...i, status } : i);
    await saveToCloud(activeProf, 'ideas', ideas);
    renderStats(); renderCatFilterPills(); renderIdeas(); updateActiveFiltersBar(); openDetail(id);

    const statusLabel = STATUS.find(s => s.id === status)?.label || status;
    showToast(`Status diubah ke ${statusLabel}`, false, true);
}

async function deleteIdea(id) {
    ideas = ideas.filter(i => i.id !== id);
    await saveToCloud(activeProf, 'ideas', ideas);
    closeModal('detailModal'); renderStats(); renderCatFilterPills(); renderIdeas(); updateActiveFiltersBar();
    showToast('Ide dihapus', true);
}

// ─── CATEGORY MANAGER ─────────────────────────────────────
function openCatManager() { renderCatList(); document.getElementById('catModal').classList.add('open'); }

function renderCatList() {
    const el = document.getElementById('catList'); if (!el) return;
    el.innerHTML = cats.map(c => {
        const ideaCount = ideas.filter(i => i.cat === c.id).length;
        return `<div class="cat-item">
      <div style="position:relative">
        <div class="color-swatch" style="background:${c.color}" onclick="document.getElementById('swatch_${c.id}').click()"></div>
        <input type="color" id="swatch_${c.id}" value="${c.color}" oninput="updateCatColor('${c.id}',this.value)"/>
      </div>
      <div style="flex:1;min-width:0">
        <div class="cat-item-name" style="font-size:14px;font-weight:500">${escHtml(c.label)}</div>
        <div class="cat-item-count" style="font-size:11px">${ideaCount} ide</div>
      </div>
      ${cats.length > 1 ? `<button class="btn" style="background:none;color:#EF4444;padding:4px 6px" onclick="removeCategory('${c.id}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`: '<span class="cat-item-count" style="font-size:10px">Min.</span>'}
    </div>`;
    }).join('');
}

async function updateCatColor(id, color) {
    cats = cats.map(c => c.id === id ? { ...c, color, bg: hexToRgba(color, 0.1) } : c);
    await saveToCloud(activeProf, 'categories', cats);
    renderCatList(); buildCatSelect(); renderCatFilterPills(); renderIdeas();
}

async function addCategory() {
    const nameEl = document.getElementById('newCatName');
    const name = nameEl.value.trim(); if (!name) return;
    const color = document.getElementById('newCatColor').value;
    const id = 'cat_' + Date.now();
    cats.push({ id, label: name, color, bg: hexToRgba(color, 0.1) });
    await saveToCloud(activeProf, 'categories', cats);
    nameEl.value = ''; buildCatSelect(); renderCatList(); renderCatFilterPills(); renderIdeas();
    showToast('Kategori ditambahkan', false, true);
}

async function removeCategory(id) {
    cats = cats.filter(c => c.id !== id);
    ideas = ideas.map(i => i.cat === id ? { ...i, cat: cats.length ? cats[0].id : '' } : i);
    await Promise.all([saveToCloud(activeProf, 'categories', cats), saveToCloud(activeProf, 'ideas', ideas)]);
    if (activeCatFilter === id) activeCatFilter = 'all';
    buildCatSelect(); renderCatList(); renderCatFilterPills(); renderIdeas(); updateActiveFiltersBar();
    showToast('Kategori dihapus');
}

// ─── MODAL UTILS ──────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('open') }
function closeModal(id) { document.getElementById(id).classList.remove('open') }
function closeModalBg(e, id) { if (e.target === e.currentTarget) closeModal(id) }

// ─── EXPORT / IMPORT ──────────────────────────────────────
function exportData() {
    const profName = profiles.find(p => p.id === activeProf)?.name || activeProf;
    const blob = new Blob([JSON.stringify({ version: 2, profile: profName, exportedAt: new Date().toISOString(), ideas, categories: cats }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `ideaspace-${profName}-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    showToast(`Ekspor berhasil — ${ideas.length} ide`, false, true);
}

async function importData(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => {
        try {
            const data = JSON.parse(ev.target.result);
            const importedIdeas = Array.isArray(data) ? data : (data.ideas || []);
            const importedCats = data.categories || [];
            if (!confirm(`Import akan mengganti data saat ini.\n\n${importedIdeas.length} ide & ${importedCats.length} kategori.\n\nLanjutkan?`)) return;
            ideas = importedIdeas.map((i, idx) => ({ ...i, status: migrateStatus(i.status || 'muncul'), num: i.num || (importedIdeas.length - idx) }));
            cats = importedCats;
            await Promise.all([saveToCloud(activeProf, 'ideas', ideas), saveToCloud(activeProf, 'categories', cats)]);
            activeCatFilter = 'all'; activeStatusFilter = 'semua';
            buildCatSelect(); renderStats(); renderCatFilterPills(); renderStatusPills(); renderIdeas(); updateActiveFiltersBar();
            showToast(`${ideas.length} ide & ${cats.length} kategori diimpor ✓`, false, true);
        } catch { showToast('Format file tidak valid', true); }
    };
    reader.readAsText(file); e.target.value = '';
}

// ─── PROFILES ─────────────────────────────────────────────
function renderProfileBar() {
    const bar = document.getElementById('profileBar'); if (!bar) return;
    bar.innerHTML = profiles.map(p => {
        const isActive = p.id === activeProf;
        return `<button class="pp ${isActive ? 'active' : 'inactive'}" onclick="${isActive ? `openManageProfile()` : `switchProfile('${p.id}')`}">
      ${isActive ? '<span style="font-size:10px;opacity:.6">✓</span>' : ''}${escHtml(p.name)}
    </button>`;
    }).join('') + `<button class="pp inactive" onclick="openNewProfile()" style="opacity:.6">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Profil Baru
  </button>`;
    const profName = profiles.find(p => p.id === activeProf)?.name || 'Profil';
    const lbl = document.getElementById('bnavProfileLbl');
    if (lbl) lbl.textContent = profName.length > 8 ? profName.slice(0, 7) + '…' : profName;
}

async function reloadProfileData() {
    [ideas, cats] = await Promise.all([
        loadFromCloud(activeProf, 'ideas'),
        loadFromCloud(activeProf, 'categories')
    ]);
    ideas = ideas.map(i => ({ ...i, status: migrateStatus(i.status || 'muncul') }));
    activeCatFilter = 'all'; activeStatusFilter = 'semua';
    renderProfileBar(); buildCatSelect(); renderStats();
    renderCatFilterPills(); renderStatusPills(); renderIdeas(); updateActiveFiltersBar();
}

async function switchProfile(id) {
    if (id === activeProf) return;
    activeProf = id;
    localStorage.setItem(`is_${_uid}_active`, id);
    await reloadProfileData();
    showToast(`Pindah ke profil: ${profiles.find(p => p.id === id)?.name || id}`, false, true);
}

function openNewProfile() {
    document.getElementById('newProfileName').value = '';
    openModal('modalNewProfile');
    setTimeout(() => document.getElementById('newProfileName').focus(), 100);
}

function openManageProfile() {
    const prof = profiles.find(p => p.id === activeProf);
    document.getElementById('manageProfileTitle').textContent = 'Kelola Profil — ' + (prof?.name || '');
    document.getElementById('profileListManage').innerHTML = profiles.map(p => {
        const isA = p.id === activeProf;
        return `<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;border-radius:8px;margin-bottom:4px;background:${isA ? '#111' : '#F4F4F0'}">
      <span style="font-size:13px;font-weight:500;color:${isA ? '#fff' : '#333'}">${isA ? '✓ ' : ''}${escHtml(p.name)}</span>
      ${!isA ? `<button class="btn" style="background:none;color:#94A3B8;font-size:12px;padding:3px 6px" onclick="switchProfile('${p.id}');closeModal('modalManageProfile')">Pilih</button>` : '<span style="font-size:10px;color:#aaa">Aktif</span>'}
    </div>`;
    }).join('');
    openModal('modalManageProfile');
}

async function createProfile() {
    const name = document.getElementById('newProfileName').value.trim();
    if (!name) { showToast('Nama profil wajib diisi', true); return; }
    if (profiles.find(p => p.name.toLowerCase() === name.toLowerCase())) { showToast('Nama sudah dipakai', true); return; }
    const id = 'p_' + Date.now().toString(36);
    profiles.push({ id, name });
    await saveProfiles();
    activeProf = id;
    localStorage.setItem(`is_${_uid}_active`, id);
    closeModal('modalNewProfile');
    await reloadProfileData();
    showToast(`Profil "${name}" dibuat ✓`, false, true);
}

async function clearCurrentProfile() {
    const prof = profiles.find(p => p.id === activeProf);
    if (!confirm(`Hapus SEMUA ide & kategori di profil "${prof?.name}"?`)) return;
    ideas = []; cats = [];
    await Promise.all([saveToCloud(activeProf, 'ideas', ideas), saveToCloud(activeProf, 'categories', cats)]);
    closeModal('modalManageProfile'); await reloadProfileData();
    showToast('Data profil dikosongkan');
}

async function deleteCurrentProfile() {
    closeModal('modalManageProfile');
    if (profiles.length <= 1) { showToast('Minimal 1 profil', true); return; }
    const prof = profiles.find(p => p.id === activeProf);
    if (!confirm(`Hapus profil "${prof?.name}"?\nSemua data akan hilang.`)) return;
    profiles = profiles.filter(p => p.id !== activeProf);
    await saveProfiles();
    activeProf = profiles[0].id;
    localStorage.setItem(`is_${_uid}_active`, activeProf);
    await reloadProfileData();
    showToast(`Profil "${prof?.name}" dihapus`);
}

// ─── THEME ────────────────────────────────────────────────
function applyTheme(dark) {
    if (dark) {
        document.body.classList.add('dark');
        document.getElementById('themeIconSun').style.display = 'none';
        document.getElementById('themeIconMoon').style.display = 'block';
    } else {
        document.body.classList.remove('dark');
        document.getElementById('themeIconSun').style.display = 'block';
        document.getElementById('themeIconMoon').style.display = 'none';
    }
}
function toggleTheme() {
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('ideaspace_theme', isDark ? 'light' : 'dark');
    applyTheme(!isDark);
}
applyTheme(localStorage.getItem('ideaspace_theme') === 'dark');

// Memblokir klik kanan
document.addEventListener('contextmenu', event => event.preventDefault());

// Memblokir pintasan keyboard tertentu (Ctrl+U, F12, Ctrl+Shift+I)
document.onkeydown = function (e) {
    if (e.ctrlKey &&
        (e.keyCode === 67 || // Ctrl+C
            e.keyCode === 86 || // Ctrl+V
            e.keyCode === 85 || // Ctrl+U
            e.keyCode === 117)) { // F12
        return false;
    }
};
