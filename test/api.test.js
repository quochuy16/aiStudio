// Kiểm thử API với file dữ liệu tạm + mật khẩu giả, không đụng data/ thật
const test = require('node:test');
const assert = require('node:assert');
const os = require('os');
const path = require('path');
const fs = require('fs');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'web-video-'));
process.env.DATA_FILE = path.join(tmp, 'don.json');
process.env.ADMIN_PASSWORD = 'mat-khau-test';
const server = require('../server');

let base;
test.before(() => new Promise(r => server.listen(0, () => { base = 'http://127.0.0.1:' + server.address().port; r(); })));
test.after(() => { server.close(); fs.rmSync(tmp, { recursive: true, force: true }); });

const donMau = { ten: 'Khách Thử', loaiVideo: 'TikTok / Reels', moTa: 'Video quảng cáo trà sữa 30 giây', sdt: '0900000000' };
const post = b => fetch(base + '/api/don', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) });
const admin = (url, opt = {}) => fetch(base + url, { ...opt, headers: { 'Content-Type': 'application/json', 'x-admin-password': 'mat-khau-test' } });

test('tạo đơn hợp lệ trả mã đơn', async () => {
  const r = await post(donMau);
  assert.strictEqual(r.status, 201);
  assert.match((await r.json()).ma, /^VD\d{6}[0-9A-F]{4}$/);
});

test('thiếu SĐT / mô tả ngắn bị từ chối', async () => {
  const r = await post({ ...donMau, sdt: 'abc', moTa: 'ngắn' });
  assert.strictEqual(r.status, 400);
  assert.strictEqual((await r.json()).loi.length, 2);
});

test('ô bẫy bot không lưu đơn', async () => {
  const truoc = (await (await admin('/api/admin/don')).json()).length;
  await post({ ...donMau, website: 'spam' });
  const sau = (await (await admin('/api/admin/don')).json()).length;
  assert.strictEqual(sau, truoc);
});

test('admin cần đúng mật khẩu', async () => {
  const r = await fetch(base + '/api/admin/don', { headers: { 'x-admin-password': 'sai' } });
  assert.strictEqual(r.status, 401);
});

test('admin đổi trạng thái, ghi chú và xoá đơn', async () => {
  const { ma } = await (await post(donMau)).json();
  const r = await admin('/api/admin/don/' + ma, { method: 'PATCH', body: JSON.stringify({ trangThai: 'da-lien-he', ghiChu: 'đã gọi' }) });
  const d = await r.json();
  assert.strictEqual(d.trangThai, 'da-lien-he');
  assert.strictEqual(d.ghiChu, 'đã gọi');
  const sai = await admin('/api/admin/don/' + ma, { method: 'PATCH', body: JSON.stringify({ trangThai: 'bay-ba' }) });
  assert.strictEqual(sai.status, 400);
  assert.strictEqual((await admin('/api/admin/don/' + ma, { method: 'DELETE' })).status, 200);
  assert.strictEqual((await admin('/api/admin/don/' + ma, { method: 'DELETE' })).status, 404);
});

test('không đọc được file ngoài public', async () => {
  const r = await fetch(base + '/..%2Fserver.js');
  assert.notStrictEqual(r.status, 200);
});
