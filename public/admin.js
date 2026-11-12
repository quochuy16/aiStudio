// Trang quản lý đơn: đăng nhập bằng mật khẩu, xem / lọc / đổi trạng thái / ghi chú / xoá đơn
(function () {
  const $ = s => document.querySelector(s);
  const TT = { moi: 'Mới', 'da-lien-he': 'Đã liên hệ', 'dang-lam': 'Đang làm', 'hoan-thanh': 'Hoàn thành', huy: 'Huỷ' };
  let pw = sessionStorage.getItem('adminPw') || '';
  let dsDon = [];

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const soDt = s => String(s).replace(/[^0-9+]/g, '');

  async function api(url, opt = {}) {
    const r = await fetch(url, { ...opt, headers: { 'Content-Type': 'application/json', 'x-admin-password': pw } });
    if (r.status === 401) { dangXuat(); throw new Error('401'); }
    const kq = await r.json();
    if (!r.ok) { alert((kq.loi || ['Lỗi']).join('\n')); throw new Error(r.status); }
    return kq;
  }

  function dangXuat() {
    pw = ''; sessionStorage.removeItem('adminPw');
    $('#ad').hidden = true; $('#f-login').hidden = false;
  }

  async function taiDon() {
    dsDon = await api('/api/admin/don');
    $('#f-login').hidden = true; $('#ad').hidden = false;
    ve();
  }

  function linkFb(fb) {
    return /^https?:\/\//i.test(fb) ? fb : 'https://www.facebook.com/search/top?q=' + encodeURIComponent(fb);
  }

  function ve() {
    const tim = $('#tim').value.trim().toLowerCase(), loc = $('#loc').value;
    const dem = {}; dsDon.forEach(d => { dem[d.trangThai] = (dem[d.trangThai] || 0) + 1; });
    $('#tk').innerHTML = `<span>Tổng: <b>${dsDon.length}</b></span>` + Object.keys(TT).map(k => `<span>${TT[k]}: <b>${dem[k] || 0}</b></span>`).join('');

    const loc2 = dsDon.filter(d => (!loc || d.trangThai === loc) &&
      (!tim || [d.ma, d.ten, d.sdt, d.zalo, d.facebook, d.email].join(' ').toLowerCase().includes(tim)));
    if (!loc2.length) { $('#ds').innerHTML = '<div class="rong">Chưa có đơn nào.</div>'; return; }

    $('#ds').innerHTML = loc2.map(d => `
      <div class="don ${d.trangThai === 'moi' ? 'moi' : ''}" data-ma="${esc(d.ma)}">
        <div class="don-h"><b>${esc(d.ten)}</b><span class="ma">${esc(d.ma)}</span>
          <time>${new Date(d.taoLuc).toLocaleString('vi-VN')}</time></div>
        <div class="meta">${esc(d.loaiVideo)}${d.thoiLuong ? ' · ' + esc(d.thoiLuong) : ''}${d.nganSach ? ' · Gói: ' + esc(d.nganSach) : ''}${d.hanChot ? ' · Cần trước: ' + esc(d.hanChot) : ''}</div>
        <div class="mota">${esc(d.moTa)}</div>
        <div class="lh">
          <a href="tel:${esc(soDt(d.sdt))}">📞 ${esc(d.sdt)}</a>
          <a href="https://zalo.me/${esc(soDt(d.zalo || d.sdt))}" target="_blank" rel="noopener">💬 Zalo ${esc(d.zalo || d.sdt)}</a>
          ${d.facebook ? `<a href="${esc(linkFb(d.facebook))}" target="_blank" rel="noopener">📘 ${esc(d.facebook)}</a>` : ''}
          ${d.email ? `<a href="mailto:${esc(d.email)}">✉️ ${esc(d.email)}</a>` : ''}
        </div>
        <div class="ctl">
          <select class="tt">${Object.keys(TT).map(k => `<option value="${k}" ${k === d.trangThai ? 'selected' : ''}>${TT[k]}</option>`).join('')}</select>
          <input class="gc" placeholder="Ghi chú (đã gọi, báo giá...)" value="${esc(d.ghiChu)}">
          <button class="btn luu">Lưu</button>
          <button class="btn xoa">Xoá</button>
        </div>
      </div>`).join('');
  }

  $('#ds').addEventListener('click', async e => {
    const box = e.target.closest('.don'); if (!box) return;
    const ma = box.dataset.ma;
    if (e.target.classList.contains('luu')) {
      const moi = await api('/api/admin/don/' + ma, { method: 'PATCH', body: JSON.stringify({ trangThai: box.querySelector('.tt').value, ghiChu: box.querySelector('.gc').value }) });
      dsDon = dsDon.map(d => d.ma === ma ? moi : d); ve();
    }
    if (e.target.classList.contains('xoa') && confirm('Xoá vĩnh viễn đơn ' + ma + '?')) {
      await api('/api/admin/don/' + ma, { method: 'DELETE' });
      dsDon = dsDon.filter(d => d.ma !== ma); ve();
    }
  });

  $('#f-login').addEventListener('submit', async e => {
    e.preventDefault();
    pw = $('#pw').value;
    $('#loi-login').hidden = true;
    try { await taiDon(); sessionStorage.setItem('adminPw', pw); }
    catch { $('#loi-login').textContent = 'Sai mật khẩu'; $('#loi-login').hidden = false; }
  });
  $('#tim').addEventListener('input', ve);
  $('#loc').addEventListener('change', ve);
  $('#tai-lai').onclick = () => taiDon().catch(() => {});
  $('#thoat').onclick = dangXuat;

  if (pw) taiDon().catch(() => {}); else $('#f-login').hidden = false;
})();
