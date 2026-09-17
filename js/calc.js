/**
 * FurimaPostCalc - 幾何判定・警告算出・ソートロジック
 */

/**
 * 入力された3辺を降順ソートして [最長辺(l1), 中間辺(l2), 最短辺(l3/厚さ)] を算出
 */
function sortDimensions(h, w, d) {
  const sorted = [Number(h), Number(w), Number(d)].sort((a, b) => b - a);
  return {
    l1: Math.round(sorted[0] * 10) / 10,
    l2: Math.round(sorted[1] * 10) / 10,
    l3: Math.round(sorted[2] * 10) / 10,
    sum: Math.round((sorted[0] + sorted[1] + sorted[2]) * 10) / 10
  };
}

/**
 * 単一配送サービスの利用可否判定
 */
function checkAvailability(service, input) {
  const { weight } = input;
  const { l1, l2, l3, sum } = sortDimensions(input.h, input.w, input.d);

  // 1. 重量チェック
  if (service.weightLimit !== null && weight > service.weightLimit) {
    return {
      available: false,
      reason: `重量超過（${weight}g > 上限${service.weightLimit}g）`
    };
  }

  // 2. 特殊BOX・封筒判定
  if (service.customBox) {
    const cb = service.customBox;
    if (cb.type === 'envelope') {
      if (l1 > cb.maxLongSide || l2 > cb.maxShortSide || l3 > cb.guideThickness) {
        return {
          available: false,
          reason: `専用封筒の内寸（${cb.maxLongSide}×${cb.maxShortSide}×目安${cb.guideThickness}cm）超過`
        };
      }
      return { available: true };
    }
    if (cb.type === 'box') {
      if (l1 > cb.maxLongSide || l2 > cb.maxSecondSide || l3 > cb.maxThickness) {
        return {
          available: false,
          reason: `専用箱内寸（${cb.maxLongSide}×${cb.maxSecondSide}×${cb.maxThickness}cm）超過`
        };
      }
      return { available: true };
    }
    if (cb.type === 'compact') {
      const fitNormal = l1 <= cb.box.l1 && l2 <= cb.box.l2 && l3 <= cb.box.l3;
      const fitThin = l1 <= cb.thin.l1 && l2 <= cb.thin.l2 && l3 <= cb.thin.l3;
      if (!fitNormal && !fitThin) {
        return {
          available: false,
          reason: `専用BOX（25×20×5cm）または薄型BOX（34×24.8×1cm）のサイズ超過`
        };
      }
      return { available: true };
    }
  }

  // 3. ゆうパケットポスト（シール）の厚さ限界
  if (service.isPostSticker) {
    if (l3 > 4.0) {
      return {
        available: false,
        reason: `厚さ超過（${l3}cm > ポスト投函口上限4.0cm）`
      };
    }
  }

  // 4. 厚さ（最短辺）チェック
  if (service.thicknessLimit !== null && service.thicknessLimit !== undefined) {
    if (l3 > service.thicknessLimit) {
      return {
        available: false,
        reason: `厚さ超過（${l3}cm > 上限${service.thicknessLimit}cm）`
      };
    }
  }

  // 5. 3辺合計チェック
  if (service.sizeLimit?.sum && sum > service.sizeLimit.sum) {
    return {
      available: false,
      reason: `3辺合計超過（${sum}cm > 上限${service.sizeLimit.sum}cm）`
    };
  }

  // 6. 長辺チェック
  if (service.sizeLimit?.maxSide && l1 > service.sizeLimit.maxSide) {
    return {
      available: false,
      reason: `長辺超過（${l1}cm > 上限${service.sizeLimit.maxSide}cm）`
    };
  }

  // 7. 中間辺上限チェック
  if (service.sizeLimit?.maxSecondSide && l2 > service.sizeLimit.maxSecondSide) {
    return {
      available: false,
      reason: `短辺超過（${l2}cm > 上限${service.sizeLimit.maxSecondSide}cm）`
    };
  }

  // 8. 最小サイズチェック（ネコポス等）
  if (service.sizeLimit?.minLongSide && l1 < service.sizeLimit.minLongSide) {
    return {
      available: false,
      reason: `最小長辺未満（${l1}cm < 下限${service.sizeLimit.minLongSide}cm）`
    };
  }
  if (service.sizeLimit?.minShortSide && l2 < service.sizeLimit.minShortSide) {
    return {
      available: false,
      reason: `最小短辺未満（${l2}cm < 下限${service.sizeLimit.minShortSide}cm）`
    };
  }

  return { available: true };
}

/**
 * 境界値・警告レベルの判定
 */
function calculateWarnings(service, input) {
  const { l1, l2, l3, sum } = sortDimensions(input.h, input.w, input.d);
  let warningLevel = 'none';
  const warnings = [];

  // ゆうパケットポスト（シール）固有の段階警告
  if (service.isPostSticker) {
    if (l3 > 3.5 && l3 <= 4.0) {
      warningLevel = 'hard';
      warnings.push('厚さ3.5cm超：新型ポスト投函口（約4cm）ギリギリのため、無理に押し込むと破損・返送の恐れがあります。');
    } else if (l3 > 3.0 && l3 <= 3.5) {
      warningLevel = 'soft';
      warnings.push('厚さ3cm超：新型ポスト等の投函口なら発送可能ですが、ポストの種類にご注意ください。');
    }
    return { warningLevel, warnings };
  }

  // 厚さ警告（一般サービス）
  if (service.thicknessLimit) {
    const diff = Math.round((service.thicknessLimit - l3) * 10) / 10;
    if (diff < 0.2) {
      warningLevel = 'hard';
      warnings.push(`厚さ上限まで残り${diff.toFixed(1)}cm：受付時の膨らみ・計測差で返送となるリスク大`);
    } else if (diff < 0.5) {
      if (warningLevel !== 'hard') warningLevel = 'soft';
      warnings.push(`厚さ上限まで残り${diff.toFixed(1)}cm：テープ止めや衣類の膨らみにご注意ください`);
    }
  }

  // 3辺合計警告
  if (service.sizeLimit?.sum) {
    const sumDiff = Math.round((service.sizeLimit.sum - sum) * 10) / 10;
    if (sumDiff < 1.0) {
      if (warningLevel !== 'hard') warningLevel = 'soft';
      warnings.push(`3辺合計上限まで残り${sumDiff.toFixed(1)}cm：梱包材の巻き方によるサイズアップに注意`);
    }
  }

  return { warningLevel, warnings };
}

/**
 * 利用可能サービスの判定・フィルタ・ソート
 */
function evaluateShippingServices(services, input, options = {}) {
  const { anonymousOnly = false, includeNoTrack = false } = options;
  const results = [];

  for (const service of services) {
    // 追跡なしフィルタ
    if (!includeNoTrack && !service.hasTracking) {
      continue;
    }
    // 匿名配送のみフィルタ
    if (anonymousOnly && !service.isAnonymous) {
      continue;
    }

    const avail = checkAvailability(service, input);
    if (!avail.available) {
      continue;
    }

    const warn = calculateWarnings(service, input);

    results.push({
      ...service,
      warningLevel: warn.warningLevel,
      warnings: warn.warnings
    });
  }

  // ソート処理（仕様書第8章準拠）
  results.sort((a, b) => {
    // 1. 実質総額が安い順
    if (a.totalFee !== b.totalFee) return a.totalFee - b.totalFee;
    // 2. 匿名配送対応（メルカリ便）優先
    if (a.isAnonymous !== b.isAnonymous) return a.isAnonymous ? -1 : 1;
    // 3. 追跡あり優先
    if (a.hasTracking !== b.hasTracking) return a.hasTracking ? -1 : 1;
    // 4. 補償あり優先
    if (a.hasInsurance !== b.hasInsurance) return a.hasInsurance ? -1 : 1;
    // 5. ポスト投函可能優先
    if (a.postDrop !== b.postDrop) return a.postDrop ? -1 : 1;
    return 0;
  });

  return results;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sortDimensions,
    checkAvailability,
    calculateWarnings,
    evaluateShippingServices
  };
}
