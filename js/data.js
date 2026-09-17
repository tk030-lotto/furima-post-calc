/**
 * FurimaPostCalc - マスターデータ定義
 * 料金基準: 2026年10月1日以降適用分（確認日: 2026-09-15）
 */

const APP_META = {
  version: '1.1.0',
  dataAsOf: '2026-09-15',
  effectiveFrom: '2026-10-01',
  warningBannerText: '送料・専用資材費・サイズ・重量などの配送条件は、予告なく変更される場合や購入店舗（コンビニ・郵便局・100均等）によって異なる場合があります。表示金額は2026年10月1日以降の料金・規格を基準とした参考目安です。発送および専用資材の購入前に、必ず各配送会社・メルカリ等の公式情報や店頭価格をご確認ください。'
};

const SHIPPING_SERVICES = [
  // 小型・ポスト投函系
  {
    id: 'yuupacket_post_mini', name: 'ゆうパケットポストmini', carrier: '日本郵便（ゆうゆうメルカリ便）', category: 'post',
    baseFee: 160, materialFee: 20, totalFee: 180, weightLimit: 2000,
    isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: true,
    customBox: { type: 'envelope', maxLongSide: 21.1, maxShortSide: 16.8, guideThickness: 3.0 },
    notes: '専用封筒（内寸21.1×16.8cm）必須。郵便ポスト投函（目安厚さ3cmまで）。資材代は郵便局等で1枚20円。'
  },
  {
    id: 'click_post', name: 'クリックポスト', carrier: '日本郵便', category: 'post',
    baseFee: 240, materialFee: 0, totalFee: 240, weightLimit: 2000, // 2026/10/1改定
    isAnonymous: false, hasTracking: true, hasInsurance: false, postDrop: true,
    sizeLimit: { sum: 60, maxSide: 34 }, thicknessLimit: 3.0,
    notes: '2026年10月1日改定対応（240円/2kg上限）。宛名ラベル印刷必須。郵便ポストへ投函。'
  },
  {
    id: 'smart_letter', name: 'スマートレター', carrier: '日本郵便', category: 'post',
    baseFee: 210, materialFee: 0, totalFee: 210, weightLimit: 1000,
    isAnonymous: false, hasTracking: false, hasInsurance: false, postDrop: true,
    sizeLimit: { sum: null, maxSide: 25, maxSecondSide: 17 }, thicknessLimit: 2.0,
    notes: '専用封筒（210円送料込）。追跡・補償なし。厚さ2cm以内。郵便ポスト投函可。宛名手書き。'
  },
  {
    id: 'neko_pos', name: 'ネコポス（らくらくメルカリ便）', carrier: 'ヤマト運輸（らくらくメルカリ便）', category: 'small',
    baseFee: 210, materialFee: 0, totalFee: 210, weightLimit: 1000,
    isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false,
    sizeLimit: { sum: 60, maxSide: 34, minLongSide: 23.0, minShortSide: 11.5 }, thicknessLimit: 3.0,
    notes: '角形A4サイズ以内。厚さ3cm以内。最小サイズ（23×11.5cm）に注意。'
  },
  {
    id: 'yuupacket_post_sticker', name: 'ゆうパケットポスト（発送用シール）', carrier: '日本郵便（ゆうゆうメルカリ便）', category: 'post',
    baseFee: 215, materialFee: 8, totalFee: 223, weightLimit: 2000,
    isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: true,
    sizeLimit: { sum: 60, maxSide: 34 }, thicknessLimit: 4.0, isPostSticker: true,
    notes: '専用シール（目安約8円/枚）を貼付しポスト投函。厚さ3.0〜3.5cmは新型ポスト推奨、3.5〜4.0cmは投函口ギリギリ。4.0cm超は不可。'
  },
  {
    id: 'yuupacket_post_box', name: 'ゆうパケットポスト（専用箱）', carrier: '日本郵便（ゆうゆうメルカリ便）', category: 'post',
    baseFee: 215, materialFee: 65, totalFee: 280, weightLimit: 2000,
    isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: true,
    customBox: { type: 'box', maxLongSide: 32.7, maxSecondSide: 22.8, maxThickness: 3.0 },
    notes: '専用箱（32.7×22.8×3cm・65円）使用。ポスト投函可能。'
  },
  {
    id: 'yuupacket_regular', name: 'ゆうパケット（ゆうゆうメルカリ便）', carrier: '日本郵便（ゆうゆうメルカリ便）', category: 'small',
    baseFee: 230, materialFee: 0, totalFee: 230, weightLimit: 1000,
    isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false,
    sizeLimit: { sum: 60, maxSide: 34 }, thicknessLimit: 3.0,
    notes: '3辺合計60cm以内、長辺34cm以内、厚さ3cm以内。郵便局窓口・ローソンで発送。'
  },
  {
    id: 'letterpack_light', name: 'レターパックライト', carrier: '日本郵便', category: 'post',
    baseFee: 430, materialFee: 0, totalFee: 430, weightLimit: 4000,
    isAnonymous: false, hasTracking: true, hasInsurance: false, postDrop: true,
    sizeLimit: { sum: null, maxSide: 34, maxSecondSide: 24.8 }, thicknessLimit: 3.0,
    notes: '専用封筒（430円送料込）。厚さ3cm以内。郵便ポスト投函可。宛名手書き。'
  },
  {
    id: 'letterpack_plus', name: 'レターパックプラス', carrier: '日本郵便', category: 'package',
    baseFee: 600, materialFee: 0, totalFee: 600, weightLimit: 4000,
    isAnonymous: false, hasTracking: true, hasInsurance: false, postDrop: true,
    sizeLimit: { sum: null, maxSide: 34, maxSecondSide: 24.8 }, thicknessLimit: null,
    notes: '専用封筒（600円送料込）。専用封筒の封が閉まれば厚さ制限なし。対面受取。宛名手書き。'
  },

  // 専用BOX・厚物小型
  {
    id: 'takkyubin_compact', name: '宅急便コンパクト（らくらくメルカリ便）', carrier: 'ヤマト運輸（らくらくメルカリ便）', category: 'box',
    baseFee: 450, materialFee: 70, totalFee: 520, weightLimit: null,
    isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false,
    customBox: {
      type: 'compact',
      box: { l1: 25.0, l2: 20.0, l3: 5.0 },
      thin: { l1: 34.0, l2: 24.8, l3: 1.0 }
    },
    notes: '専用BOX（25×20×厚さ5cm）または薄型BOX（34×24.8cm）必須（1枚70円）。重量制限なし。'
  },
  {
    id: 'yuupacket_plus', name: 'ゆうパケットプラス（ゆうゆうメルカリ便）', carrier: '日本郵便（ゆうゆうメルカリ便）', category: 'box',
    baseFee: 455, materialFee: 65, totalFee: 520, weightLimit: 2000,
    isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false,
    customBox: { type: 'box', maxLongSide: 24.0, maxSecondSide: 17.0, maxThickness: 7.0 },
    notes: '専用箱（24×17×厚さ7cm・65円）必須。重量2kg以内。ローソン・郵便局窓口で発送。'
  },

  // 宅配便（らくらくメルカリ便・ヤマト宅急便）
  { id: 'takkyubin_60', name: '宅急便 60サイズ', carrier: 'ヤマト運輸（らくらくメルカリ便）', category: 'courier', baseFee: 750, materialFee: 0, totalFee: 750, weightLimit: 2000, isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false, sizeLimit: { sum: 60 } },
  { id: 'takkyubin_80', name: '宅急便 80サイズ', carrier: 'ヤマト運輸（らくらくメルカリ便）', category: 'courier', baseFee: 850, materialFee: 0, totalFee: 850, weightLimit: 5000, isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false, sizeLimit: { sum: 80 } },
  { id: 'takkyubin_100', name: '宅急便 100サイズ', carrier: 'ヤマト運輸（らくらくメルカリ便）', category: 'courier', baseFee: 1050, materialFee: 0, totalFee: 1050, weightLimit: 10000, isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false, sizeLimit: { sum: 100 } },
  { id: 'takkyubin_120', name: '宅急便 120サイズ', carrier: 'ヤマト運輸（らくらくメルカリ便）', category: 'courier', baseFee: 1200, materialFee: 0, totalFee: 1200, weightLimit: 15000, isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false, sizeLimit: { sum: 120 } },
  { id: 'takkyubin_140', name: '宅急便 140サイズ', carrier: 'ヤマト運輸（らくらくメルカリ便）', category: 'courier', baseFee: 1450, materialFee: 0, totalFee: 1450, weightLimit: 20000, isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false, sizeLimit: { sum: 140 } },
  { id: 'takkyubin_160', name: '宅急便 160サイズ', carrier: 'ヤマト運輸（らくらくメルカリ便）', category: 'courier', baseFee: 1700, materialFee: 0, totalFee: 1700, weightLimit: 25000, isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false, sizeLimit: { sum: 160 } },
  { id: 'takkyubin_180', name: '宅急便 180サイズ', carrier: 'ヤマト運輸（らくらくメルカリ便）', category: 'courier', baseFee: 2100, materialFee: 0, totalFee: 2100, weightLimit: 30000, isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false, sizeLimit: { sum: 180 } },

  // ゆうパック（ゆうゆうメルカリ便）
  { id: 'yuupack_60', name: 'ゆうパック 60サイズ', carrier: '日本郵便（ゆうゆうメルカリ便）', category: 'courier', baseFee: 750, materialFee: 0, totalFee: 750, weightLimit: 25000, isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false, sizeLimit: { sum: 60 } },
  { id: 'yuupack_80', name: 'ゆうパック 80サイズ', carrier: '日本郵便（ゆうゆうメルカリ便）', category: 'courier', baseFee: 870, materialFee: 0, totalFee: 870, weightLimit: 25000, isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false, sizeLimit: { sum: 80 } },
  { id: 'yuupack_100', name: 'ゆうパック 100サイズ', carrier: '日本郵便（ゆうゆうメルカリ便）', category: 'courier', baseFee: 1070, materialFee: 0, totalFee: 1070, weightLimit: 25000, isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false, sizeLimit: { sum: 100 } },
  { id: 'yuupack_120', name: 'ゆうパック 120サイズ', carrier: '日本郵便（ゆうゆうメルカリ便）', category: 'courier', baseFee: 1200, materialFee: 0, totalFee: 1200, weightLimit: 25000, isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false, sizeLimit: { sum: 120 } },
  { id: 'yuupack_140', name: 'ゆうパック 140サイズ', carrier: '日本郵便（ゆうゆうメルカリ便）', category: 'courier', baseFee: 1450, materialFee: 0, totalFee: 1450, weightLimit: 25000, isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false, sizeLimit: { sum: 140 } },
  { id: 'yuupack_160', name: 'ゆうパック 160サイズ', carrier: '日本郵便（ゆうゆうメルカリ便）', category: 'courier', baseFee: 1700, materialFee: 0, totalFee: 1700, weightLimit: 25000, isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false, sizeLimit: { sum: 160 } },
  { id: 'yuupack_170', name: 'ゆうパック 170サイズ', carrier: '日本郵便（ゆうゆうメルカリ便）', category: 'courier', baseFee: 1900, materialFee: 0, totalFee: 1900, weightLimit: 25000, isAnonymous: true, hasTracking: true, hasInsurance: true, postDrop: false, sizeLimit: { sum: 170 } }
];

const PACKAGE_MATERIALS = [
  { id: 'mat_mini_envelope', name: 'ゆうパケットポストmini 専用封筒', innerSize: { w: 21.1, h: 16.8, d: 3.0 }, price: 20, priceUnit: 'each', fitsServices: ['yuupacket_post_mini'], store: 'post-office', purchaseInfo: '郵便局窓口にて購入可能（1枚20円）。一部コンビニでも取扱いあり。' },
  { id: 'mat_post_sticker', name: 'ゆうパケットポスト 発送用シール', innerSize: { w: 34.0, h: 26.0, d: 4.0 }, price: 100, priceUnit: 'pack', perItemPrice: 5, fitsServices: ['yuupacket_post_sticker'], store: 'post-office', purchaseInfo: '郵便局（20枚入100円/1枚5円）、ローソン・イトーヨーカドー（10枚入75円/1枚7.5円）等で販売。' },
  { id: 'mat_yuupacket_post_box', name: 'ゆうパケットポスト 専用箱', innerSize: { w: 32.7, h: 22.8, d: 3.0 }, price: 65, priceUnit: 'each', fitsServices: ['yuupacket_post_box'], store: 'post-office', purchaseInfo: '郵便局・ローソン・セリア・ダイソー等で販売（1枚65円）。' },
  { id: 'mat_takkyubin_compact_box', name: '宅急便コンパクト 専用BOX', innerSize: { w: 25.0, h: 20.0, d: 5.0 }, price: 70, priceUnit: 'each', fitsServices: ['takkyubin_compact'], store: 'convenience', purchaseInfo: 'ヤマト営業所・ファミリーマート・セブンイレブン等で販売（1枚70円）。' },
  { id: 'mat_takkyubin_compact_thin', name: '宅急便コンパクト 薄型専用BOX', innerSize: { w: 34.0, h: 24.8, d: 1.0 }, price: 70, priceUnit: 'each', fitsServices: ['takkyubin_compact'], store: 'convenience', purchaseInfo: 'ヤマト営業所・ファミリーマート・セブンイレブン等で販売（1枚70円）。薄手の書類・衣類向け。' },
  { id: 'mat_yuupacket_plus_box', name: 'ゆうパケットプラス 専用箱', innerSize: { w: 24.0, h: 17.0, d: 7.0 }, price: 65, priceUnit: 'each', fitsServices: ['yuupacket_plus'], store: 'post-office', purchaseInfo: '郵便局・ローソンで販売（1枚65円）。' }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APP_META, SHIPPING_SERVICES, PACKAGE_MATERIALS };
}
