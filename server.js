// Server Node thuần (không cần cài thư viện): phục vụ web tĩnh + API lưu đơn đặt video
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data', 'don-hang.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.webp': 'image/webp', '.mp4': 'video/mp4', '.glb': 'model/gltf-binary'
};
const TRANG_THAI = ['moi', 'da-lien-he', 'dang-lam', 'hoan-thanh', 'huy'];

// ---- Lưu trữ file JSON ----
function docDon() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return []; }
}
function ghiDon(ds) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(ds, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}
function taoMa() {
  const d = new Date();
  const ngay = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  return 'VD' + ngay + crypto.randomBytes(2).toString('hex').toUpperCase();
}

// ---- Tiện ích HTTP ----
function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': MIME['.json'], 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}
function docBody(req) {
  return new Promise((resolve, reject) => {
    let s = '';
    req.on('data', c => { s += c; if (s.length > 50000) { reject(new Error('qua-lon')); req.destroy(); } });
    req.on('end', () => { try { resolve(s ? JSON.parse(s) : {}); } catch { reject(new Error('json-loi')); } });
  });
}
function laAdmin(req) {
  const pw = String(req.headers['x-admin-password'] || '');
  const a = Buffer.from(pw), b = Buffer.from(ADMIN_PASSWORD);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
const cat = (v, n) => String(v ?? '').trim().slice(0, n);

// ---- Kiểm tra đơn khách gửi ----
function kiemTraDon(b) {
  const don = {
    ten: cat(b.ten, 100),
    loaiVideo: cat(b.loaiVideo, 100),
    thoiLuong: cat(b.thoiLuong, 50),
    nganSach: cat(b.nganSach, 50),
    hanChot: cat(b.hanChot, 20),
    moTa: cat(b.moTa, 3000),
    sdt: cat(b.sdt, 20),
    zalo: cat(b.zalo, 50),
    facebook: cat(b.facebook, 200),
    email: cat(b.email, 100)
  };
  const loi = [];
  if (!don.ten) loi.push('Vui lòng nhập họ tên');
  if (!don.loaiVideo) loi.push('Vui lòng chọn loại video');
  if (don.moTa.length < 10) loi.push('Mô tả yêu cầu cần ít nhất 10 ký tự');
  if (!/^[0-9+\s.-]{9,20}$/.test(don.sdt)) loi.push('Số điện thoại không hợp lệ');
  if (don.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(don.email)) loi.push('Email không hợp lệ');
  return { don, loi };
}

// ---- API ----
async function xuLyApi(req, res, url) {
  if (url.pathname === '/api/don' && req.method === 'POST') {
    let body;
    try { body = await docBody(req); } catch { return json(res, 400, { loi: ['Dữ liệu gửi lên không hợp lệ'] }); }
    if (body.website) return json(res, 200, { ma: 'OK' }); // bẫy bot (ô ẩn)
    const { don, loi } = kiemTraDon(body);
    if (loi.length) return json(res, 400, { loi });
    const ds = docDon();
    const moi = { ma: taoMa(), ...don, trangThai: 'moi', ghiChu: '', taoLuc: new Date().toISOString() };
    ds.unshift(moi);
    ghiDon(ds);
    return json(res, 201, { ma: moi.ma });
  }

  if (url.pathname === '/api/admin/don') {
    if (!laAdmin(req)) return json(res, 401, { loi: ['Sai mật khẩu'] });
    if (req.method === 'GET') return json(res, 200, docDon());
  }

  const m = url.pathname.match(/^\/api\/admin\/don\/([A-Z0-9]+)$/);
  if (m) {
    if (!laAdmin(req)) return json(res, 401, { loi: ['Sai mật khẩu'] });
    const ds = docDon();
    const i = ds.findIndex(d => d.ma === m[1]);
    if (i < 0) return json(res, 404, { loi: ['Không tìm thấy đơn'] });
    if (req.method === 'PATCH') {
      let body;
      try { body = await docBody(req); } catch { return json(res, 400, { loi: ['Dữ liệu không hợp lệ'] }); }
      if (body.trangThai !== undefined) {
        if (!TRANG_THAI.includes(body.trangThai)) return json(res, 400, { loi: ['Trạng thái không hợp lệ'] });
        ds[i].trangThai = body.trangThai;
      }
      if (body.ghiChu !== undefined) ds[i].ghiChu = cat(body.ghiChu, 2000);
      ds[i].capNhatLuc = new Date().toISOString();
      ghiDon(ds);
      return json(res, 200, ds[i]);
    }
    if (req.method === 'DELETE') {
      ds.splice(i, 1);
      ghiDon(ds);
      return json(res, 200, { ok: true });
    }
  }
  return json(res, 404, { loi: ['Không tìm thấy'] });
}

// ---- File tĩnh ----
function phucVuTinh(req, res, url) {
  let p = decodeURIComponent(url.pathname);
  if (p === '/') p = '/index.html';
  if (p === '/admin') p = '/admin.html';
  const file = path.normalize(path.join(PUBLIC_DIR, p));
  if (!file.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': MIME['.html'] }); return res.end('<h1>404</h1>'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/api/')) {
    xuLyApi(req, res, url).catch(e => { console.error(e); json(res, 500, { loi: ['Lỗi máy chủ'] }); });
  } else {
    phucVuTinh(req, res, url);
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Web chạy tại http://localhost:${PORT}  |  Quản lý đơn: http://localhost:${PORT}/admin`);
    if (!process.env.ADMIN_PASSWORD) console.log('Cảnh báo: đang dùng mật khẩu admin mặc định, đặt biến ADMIN_PASSWORD khi chạy thật.');
  });
}
module.exports = server;
