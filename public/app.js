// Trang chủ: hiệu ứng prompt, khu trải nghiệm thử, gửi form đặt video, hiện QR
(function () {
  const $ = s => document.querySelector(s);
  $('#nam').textContent = new Date().getFullYear();

  // Hiệu ứng gõ prompt ở hero
  const prompts = [
    'Cô gái uống trà sữa dưới nắng hè, ánh sáng điện ảnh...',
    'Xe hơi lướt qua thành phố neon lúc nửa đêm...',
    'Chú mèo phi hành gia khám phá sao Hoả, phong cách 3D...'
  ];
  let pi = 0, ci = 0, xoa = false;
  (function go() {
    const t = prompts[pi];
    ci += xoa ? -1 : 1;
    $('#typing').textContent = t.slice(0, ci);
    let d = xoa ? 25 : 55;
    if (!xoa && ci === t.length) { xoa = true; d = 1600; }
    else if (xoa && ci === 0) { xoa = false; pi = (pi + 1) % prompts.length; d = 300; }
    setTimeout(go, d);
  })();

  // Nhân vật + icon 3D nghiêng / trôi theo chuột qua biến CSS --mx, --my
  addEventListener('pointermove', e => {
    const s = document.documentElement.style;
    s.setProperty('--mx', ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
    s.setProperty('--my', ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
  });
  // Bấm vào nhân vật → nhảy lên
  document.querySelectorAll('.nv').forEach(nv => nv.addEventListener('click', () => {
    nv.classList.remove('nhay'); void nv.offsetWidth; nv.classList.add('nhay');
  }));
  document.querySelectorAll('.nv').forEach(nv => nv.addEventListener('animationend', e => {
    if (e.animationName === 'nhay') nv.classList.remove('nhay');
  }));

  // Khu trải nghiệm thử
  const tenStyle = { 'dien-anh': 'điện ảnh', anime: 'anime', neon: 'neon', '3d': 'hoạt hình 3D' };
  let style = 'dien-anh', ratio = '16/9';
  function veDemo() {
    const y = $('#demo-y').value.trim() || 'Ý tưởng của bạn';
    $('#demo-title').textContent = y;
    $('#demo-sub').textContent = 'Phong cách ' + tenStyle[style] + ' · ' + ratio.replace('/', ':');
    const f = $('#demo-frame');
    f.className = 'frame s-' + style;
    f.style.aspectRatio = ratio;
  }
  function chonChip(boxSel, cb) {
    $(boxSel).addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      $(boxSel).querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
      cb(b); veDemo();
    });
  }
  chonChip('#demo-style', b => { style = b.dataset.s; });
  chonChip('#demo-ratio', b => { ratio = b.dataset.r; });
  $('#demo-y').addEventListener('input', veDemo);

  // Đưa ý tưởng trải nghiệm vào form
  $('#demo-dat').addEventListener('click', () => {
    const y = $('#demo-y').value.trim();
    if (y && !$('#moTa').value.trim()) {
      $('#moTa').value = y + ' — phong cách ' + tenStyle[style] + ', tỉ lệ ' + ratio.replace('/', ':') + '.';
    }
  });
  // Chọn gói ở bảng giá
  document.querySelectorAll('[data-goi]').forEach(a => a.addEventListener('click', () => { $('#nganSach').value = a.dataset.goi; }));

  // Gửi form
  const form = $('#form-dat'), loi = $('#loi'), nut = $('#nut-gui');
  function baoLoi(ds) { loi.innerHTML = ds.map(x => '• ' + x).join('<br>'); loi.hidden = false; }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    loi.hidden = true;
    const data = Object.fromEntries(new FormData(form));
    const ds = [];
    if (!data.ten.trim()) ds.push('Vui lòng nhập họ tên');
    if (!data.loaiVideo) ds.push('Vui lòng chọn loại video');
    if (data.moTa.trim().length < 10) ds.push('Mô tả yêu cầu cần ít nhất 10 ký tự');
    if (!/^[0-9+\s.-]{9,20}$/.test(data.sdt.trim())) ds.push('Số điện thoại không hợp lệ');
    if (ds.length) return baoLoi(ds);

    nut.disabled = true; nut.textContent = 'Đang gửi...';
    try {
      const r = await fetch('/api/don', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const kq = await r.json();
      if (!r.ok) return baoLoi(kq.loi || ['Gửi không thành công, thử lại sau']);
      $('#ma-don').textContent = kq.ma;
      $('#ma-don2').textContent = kq.ma;
      $('#modal').hidden = false;
      form.reset();
    } catch {
      baoLoi(['Không kết nối được máy chủ, thử lại sau']);
    } finally {
      nut.disabled = false; nut.textContent = 'Gửi yêu cầu';
    }
  });
  const dong = () => { $('#modal').hidden = true; };
  $('#dong').onclick = dong; $('#dong2').onclick = dong;
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') dong(); });
})();
