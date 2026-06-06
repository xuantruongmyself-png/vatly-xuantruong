/* ═══════════════════════════════════════════
   AUTH MODULE — Vật Lý Xuân Trường
   Dùng chung cho tất cả các trang
═══════════════════════════════════════════ */
const VLXT_AUTH_KEY = 'vlxt_user_v2';
const VLXT_GAS = 'https://script.google.com/macros/s/AKfycbxJ8HMtU0d8PNGo9cPCat4GMGsd8FyXU_tKPyFot0EHStitH2Eyaefz8V39x9aeo2B_/exec';

function vlxtGetUser() {
  try { return JSON.parse(localStorage.getItem(VLXT_AUTH_KEY) || 'null'); } catch { return null; }
}

function vlxtSaveUser(user) {
  localStorage.setItem(VLXT_AUTH_KEY, JSON.stringify(user));
}

function vlxtLogout() {
  localStorage.removeItem(VLXT_AUTH_KEY);
  window.location.href = 'login.html';
}

// Bảo vệ trang — gọi ở đầu mỗi trang cần đăng nhập
function vlxtRequireAuth() {
  const user = vlxtGetUser();
  if (!user) {
    window.location.href = 'login.html?from=' + encodeURIComponent(window.location.pathname + window.location.search);
    return null;
  }
  return user;
}

// Tạo widget user góc phải
function vlxtRenderWidget(user) {
  if (!user) return;
  const existing = document.getElementById('vlxt-user-widget');
  if (existing) existing.remove();

  const initials = (user.hoten || 'HS').split(' ').map(w=>w[0]).slice(-2).join('').toUpperCase();
  const widget = document.createElement('div');
  widget.id = 'vlxt-user-widget';
  widget.innerHTML = `
    <style>
      #vlxt-user-widget {
        position: fixed; top: 12px; right: 12px; z-index: 99999;
        font-family: 'Inter', system-ui, sans-serif;
      }
      #vlxt-avatar-btn {
        width: 40px; height: 40px; border-radius: 50%;
        background: linear-gradient(135deg, #0072ff, #00f0ff);
        border: 2px solid rgba(0,240,255,0.4);
        color: #fff; font-size: 14px; font-weight: 700;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 12px rgba(0,114,255,0.4);
        transition: transform 0.15s;
        user-select: none;
      }
      #vlxt-avatar-btn:hover { transform: scale(1.08); }
      #vlxt-dropdown {
        display: none; position: absolute; top: 48px; right: 0;
        background: #0d1117; border: 1px solid rgba(0,240,255,0.2);
        border-radius: 14px; padding: 12px; min-width: 220px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.7);
        animation: dropIn 0.15s ease-out;
      }
      @keyframes dropIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:none } }
      #vlxt-dropdown.open { display: block; }
      .vlxt-user-name { font-size: 14px; font-weight: 700; color: #e6edf3; margin-bottom: 2px; }
      .vlxt-user-meta { font-size: 12px; color: #8b949e; margin-bottom: 10px; }
      .vlxt-stats { display: flex; gap: 8px; margin-bottom: 10px; }
      .vlxt-stat { flex: 1; background: rgba(0,240,255,0.07); border: 1px solid rgba(0,240,255,0.15);
        border-radius: 8px; padding: 6px 8px; text-align: center; }
      .vlxt-stat-val { font-size: 15px; font-weight: 800; color: #00f0ff; }
      .vlxt-stat-label { font-size: 10px; color: #8b949e; margin-top: 1px; }
      .vlxt-nav-links { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
      .vlxt-nav-link { display: block; padding: 7px 10px; border-radius: 8px; font-size: 13px;
        color: #c9d1d9; text-decoration: none; transition: background 0.1s; }
      .vlxt-nav-link:hover { background: rgba(255,255,255,0.07); color: #fff; }
      .vlxt-divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 8px 0; }
      .vlxt-logout-btn { width: 100%; padding: 7px 10px; border-radius: 8px; border: none;
        background: rgba(239,68,68,0.12); color: #f87171; font-size: 13px; font-weight: 600;
        cursor: pointer; text-align: left; transition: background 0.1s; font-family: inherit; }
      .vlxt-logout-btn:hover { background: rgba(239,68,68,0.22); }
    </style>
    <div id="vlxt-avatar-btn" onclick="vlxtToggleDropdown()" title="${user.hoten}">${initials}</div>
    <div id="vlxt-dropdown">
      <div class="vlxt-user-name">${user.hoten}</div>
      <div class="vlxt-user-meta">Lớp ${user.lop} · ${user.sdt}</div>
      <div class="vlxt-stats">
        <div class="vlxt-stat">
          <div class="vlxt-stat-val" id="vlxt-lp">${user.lpTotal || 0}</div>
          <div class="vlxt-stat-label">⚡ LP</div>
        </div>
        <div class="vlxt-stat">
          <div class="vlxt-stat-val" id="vlxt-done">...</div>
          <div class="vlxt-stat-label">📚 Bài học</div>
        </div>
      </div>
      <div class="vlxt-nav-links">
        <a href="index.html" class="vlxt-nav-link">🏠 Trang chủ</a>
        <a href="baihoc.html" class="vlxt-nav-link">📚 Bài học</a>
        <a href="danhsach-ly12.html" class="vlxt-nav-link">📝 Đề thi</a>
        <a href="trochoi.html" class="vlxt-nav-link">🎮 Trò chơi</a>
        <a href="hoso.html" class="vlxt-nav-link">👤 Hồ sơ & Xếp hạng</a>
      </div>
      <hr class="vlxt-divider">
      <button class="vlxt-logout-btn" onclick="vlxtLogout()">↩ Đăng xuất</button>
    </div>
  `;
  document.body.appendChild(widget);

  // Load tiến độ thực tế
  fetch(VLXT_GAS + '?type=profile&hs=' + encodeURIComponent(user.sdt))
    .then(r => r.json()).then(d => {
      if (d.ok) {
        document.getElementById('vlxt-lp').textContent = d.user.lpTotal || 0;
        document.getElementById('vlxt-done').textContent = (d.tiendo || []).length;
        // Cập nhật user cache
        const updated = {...user, lpTotal: d.user.lpTotal, tiendoCount: (d.tiendo||[]).length};
        vlxtSaveUser(updated);
      }
    }).catch(() => {});
}

function vlxtToggleDropdown() {
  const dd = document.getElementById('vlxt-dropdown');
  if (dd) dd.classList.toggle('open');
}

// Đóng dropdown khi click ra ngoài
document.addEventListener('click', e => {
  const w = document.getElementById('vlxt-user-widget');
  if (w && !w.contains(e.target)) {
    const dd = document.getElementById('vlxt-dropdown');
    if (dd) dd.classList.remove('open');
  }
});

// Tự động hiện widget khi trang load (không cần gọi thủ công từng trang)
document.addEventListener('DOMContentLoaded', () => {
  const user = vlxtGetUser();
  if (user && !document.getElementById('vlxt-user-widget')) {
    vlxtRenderWidget(user);
  }
});
