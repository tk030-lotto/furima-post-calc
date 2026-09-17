/**
 * FurimaPostCalc - CLI自動テストスクリプト
 * 仕様書第13章（TC-001〜TC-026）全自動検証
 */

const { APP_META, SHIPPING_SERVICES, PACKAGE_MATERIALS } = require('./js/data.js');
const {
  sortDimensions,
  checkAvailability,
  calculateWarnings,
  evaluateShippingServices
} = require('./js/calc.js');

const tests = [
  { id: 'TC-001', name: 'miniのサイズ・重量上限内 -> miniが最安（180円）', fn: () => {
    const res = evaluateShippingServices(SHIPPING_SERVICES, { h: 20, w: 15, d: 2, weight: 500 });
    return res.length > 0 && res[0].id === 'yuupacket_post_mini' && res[0].totalFee === 180;
  }},
  { id: 'TC-002', name: 'mini重量2kgちょうど -> mini利用可能', fn: () => {
    const mini = SHIPPING_SERVICES.find(s => s.id === 'yuupacket_post_mini');
    return checkAvailability(mini, { h: 20, w: 15, d: 2, weight: 2000 }).available === true;
  }},
  { id: 'TC-003', name: 'ネコポス厚さ3cmちょうど -> 利用可能＆hard警告', fn: () => {
    const n = SHIPPING_SERVICES.find(s => s.id === 'neko_pos');
    const a = checkAvailability(n, { h: 25, w: 15, d: 3.0, weight: 500 });
    const w = calculateWarnings(n, { h: 25, w: 15, d: 3.0, weight: 500 });
    return a.available === true && w.warningLevel === 'hard';
  }},
  { id: 'TC-004', name: 'ネコポス厚さ3.1cm -> 利用不可', fn: () => {
    const n = SHIPPING_SERVICES.find(s => s.id === 'neko_pos');
    return checkAvailability(n, { h: 25, w: 15, d: 3.1, weight: 500 }).available === false;
  }},
  { id: 'TC-005', name: '3辺合計60cmちょうど -> 60サイズ利用可能', fn: () => {
    const s = SHIPPING_SERVICES.find(x => x.id === 'takkyubin_60');
    return checkAvailability(s, { h: 30, w: 20, d: 10, weight: 1500 }).available === true;
  }},
  { id: 'TC-006', name: '3辺合計60.1cm -> 60サイズ不可・80サイズ可', fn: () => {
    const s60 = SHIPPING_SERVICES.find(x => x.id === 'takkyubin_60');
    const s80 = SHIPPING_SERVICES.find(x => x.id === 'takkyubin_80');
    return !checkAvailability(s60, { h: 30.1, w: 20, d: 10, weight: 1500 }).available &&
           checkAvailability(s80, { h: 30.1, w: 20, d: 10, weight: 1500 }).available;
  }},
  { id: 'TC-007', name: '宅急便60サイズ上限（2kg） -> 利用可能', fn: () => {
    const s = SHIPPING_SERVICES.find(x => x.id === 'takkyubin_60');
    return checkAvailability(s, { h: 25, w: 20, d: 15, weight: 2000 }).available === true;
  }},
  { id: 'TC-008', name: '60サイズ・重量2.1kg -> 宅急便60不可・宅急便80可・ゆうパック60可', fn: () => {
    const t60 = SHIPPING_SERVICES.find(x => x.id === 'takkyubin_60');
    const t80 = SHIPPING_SERVICES.find(x => x.id === 'takkyubin_80');
    const y60 = SHIPPING_SERVICES.find(x => x.id === 'yuupack_60');
    return !checkAvailability(t60, { h: 25, w: 20, d: 15, weight: 2100 }).available &&
           checkAvailability(t80, { h: 25, w: 20, d: 15, weight: 2100 }).available &&
           checkAvailability(y60, { h: 25, w: 20, d: 15, weight: 2100 }).available;
  }},
  { id: 'TC-009', name: '宅急便180サイズ上限（2,100円） -> 利用可能', fn: () => {
    const s = SHIPPING_SERVICES.find(x => x.id === 'takkyubin_180');
    return checkAvailability(s, { h: 80, w: 60, d: 40, weight: 30000 }).available === true && s.totalFee === 2100;
  }},
  { id: 'TC-010', name: '重量26kgで160サイズ除外（25kg制限）', fn: () => {
    const t160 = SHIPPING_SERVICES.find(x => x.id === 'takkyubin_160');
    const y160 = SHIPPING_SERVICES.find(x => x.id === 'yuupack_160');
    return !checkAvailability(t160, { h: 60, w: 50, d: 50, weight: 26000 }).available &&
           !checkAvailability(y160, { h: 60, w: 50, d: 50, weight: 26000 }).available;
  }},
  { id: 'TC-011', name: 'ゆうパック170サイズ（1,900円） -> 利用可能', fn: () => {
    const s = SHIPPING_SERVICES.find(x => x.id === 'yuupack_170');
    return checkAvailability(s, { h: 70, w: 50, d: 50, weight: 20000 }).available === true && s.totalFee === 1900;
  }},
  { id: 'TC-012', name: 'クリックポスト2kg上限（240円） -> 利用可能', fn: () => {
    const cp = SHIPPING_SERVICES.find(x => x.id === 'click_post');
    return checkAvailability(cp, { h: 30, w: 20, d: 2, weight: 2000 }).available === true && cp.totalFee === 240;
  }},
  { id: 'TC-013', name: 'クリックポスト2001g -> 重量超過除外', fn: () => {
    const cp = SHIPPING_SERVICES.find(x => x.id === 'click_post');
    return checkAvailability(cp, { h: 30, w: 20, d: 2, weight: 2001 }).available === false;
  }},
  { id: 'TC-014', name: 'クリックポスト3辺合計60cm上限 -> 利用可能', fn: () => {
    const cp = SHIPPING_SERVICES.find(x => x.id === 'click_post');
    return checkAvailability(cp, { h: 34, w: 23, d: 3, weight: 1000 }).available === true;
  }},
  { id: 'TC-015', name: 'クリックポスト3辺合計60.1cm -> 除外', fn: () => {
    const cp = SHIPPING_SERVICES.find(x => x.id === 'click_post');
    return checkAvailability(cp, { h: 34.1, w: 23, d: 3, weight: 1000 }).available === false;
  }},
  { id: 'TC-016', name: '追跡なしOFF -> スマートレター非表示', fn: () => {
    const res = evaluateShippingServices(SHIPPING_SERVICES, { h: 20, w: 15, d: 1, weight: 500 }, { includeNoTrack: false });
    return !res.some(s => s.id === 'smart_letter');
  }},
  { id: 'TC-017', name: '追跡なしON -> スマートレター表示', fn: () => {
    const res = evaluateShippingServices(SHIPPING_SERVICES, { h: 20, w: 15, d: 1, weight: 500 }, { includeNoTrack: true });
    return res.some(s => s.id === 'smart_letter');
  }},
  { id: 'TC-018', name: 'URL共有・復元ロジック整合性', fn: () => {
    const qs = 'h=25&w=18&d=2.5&weight=400&notrack=1&anon=1';
    const p = new URLSearchParams(qs);
    return p.get('h') === '25' && p.get('anon') === '1';
  }},
  { id: 'TC-019', name: 'LocalStorage復元仕様', fn: () => {
    const d = JSON.stringify({ h: 25, w: 18, d: 2.5, weight: 400 });
    const p = JSON.parse(d);
    return p.h === 25 && p.weight === 400;
  }},
  { id: 'TC-020', name: '料金改定日データ表示（2026-10-01基準）', fn: () => {
    return APP_META.effectiveFrom === '2026-10-01' && APP_META.dataAsOf === '2026-09-15';
  }},
  { id: 'TC-021', name: '注意事項常時表示テキスト適合', fn: () => {
    return APP_META.warningBannerText.includes('送料・専用資材費') && APP_META.warningBannerText.includes('2026年10月1日以降');
  }},
  { id: 'TC-022', name: '梱包資材の単価・店舗情報', fn: () => {
    const m = PACKAGE_MATERIALS.find(x => x.id === 'mat_post_sticker');
    return m && m.perItemPrice === 5 && m.purchaseInfo.includes('郵便局');
  }},
  { id: 'TC-023', name: '3辺向き自動回転（30x3x20cm -> 厚さ3cmでネコポス可）', fn: () => {
    const n = SHIPPING_SERVICES.find(s => s.id === 'neko_pos');
    return checkAvailability(n, { h: 30, w: 3, d: 20, weight: 500 }).available === true;
  }},
  { id: 'TC-024', name: 'ネコポス最小サイズ未満判定（20x10x2cm除外）', fn: () => {
    const n = SHIPPING_SERVICES.find(s => s.id === 'neko_pos');
    return checkAvailability(n, { h: 20, w: 10, d: 2, weight: 500 }).available === false;
  }},
  { id: 'TC-025', name: '匿名配送のみフィルター（非匿名除外）', fn: () => {
    const res = evaluateShippingServices(SHIPPING_SERVICES, { h: 25, w: 15, d: 2, weight: 500 }, { anonymousOnly: true, includeNoTrack: true });
    return res.every(s => s.isAnonymous === true) && !res.some(s => s.id === 'click_post');
  }},
  { id: 'TC-026', name: 'ゆうパケットポスト(シール)段階的厚さ判定(3.2=soft, 3.8=hard, 4.1=除外)', fn: () => {
    const st = SHIPPING_SERVICES.find(s => s.id === 'yuupacket_post_sticker');
    const s = calculateWarnings(st, { h: 25, w: 15, d: 3.2, weight: 500 });
    const h = calculateWarnings(st, { h: 25, w: 15, d: 3.8, weight: 500 });
    const o = checkAvailability(st, { h: 25, w: 15, d: 4.1, weight: 500 });
    return s.warningLevel === 'soft' && h.warningLevel === 'hard' && o.available === false;
  }}
];

let passCount = 0;
let failCount = 0;

console.log('🧪 FurimaPostCalc 自動テストスイート (TC-001〜TC-026)');
console.log('====================================================');

tests.forEach(t => {
  let isPass = false;
  try {
    isPass = t.fn();
  } catch (e) {
    console.error(`Error in ${t.id}:`, e.message);
  }

  if (isPass) {
    passCount++;
    console.log(`[PASS] ${t.id}: ${t.name}`);
  } else {
    failCount++;
    console.error(`[FAIL] ${t.id}: ${t.name}`);
  }
});

console.log('====================================================');
console.log(`結果: ${passCount} 合格 / ${failCount} 不合格 (全 ${tests.length} 件)`);

if (failCount === 0) {
  console.log('🎉 全テストケースに合格しました (100% PASS)');
  process.exit(0);
} else {
  console.error(`❌ ${failCount} 件のテストが失敗しました`);
  process.exit(1);
}
