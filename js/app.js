/**
 * FurimaPostCalc - アプリケーション制御・UIレンダリング
 * Zero-Dependency / 安全なDOM構築（XSS対策・プロトコル17条300行制限準拠）
 */

document.addEventListener('DOMContentLoaded', () => {
  const inputH = document.getElementById('inputHeight');
  const inputW = document.getElementById('inputWidth');
  const inputD = document.getElementById('inputDepth');
  const inputWeight = document.getElementById('inputWeight');
  const filterAnon = document.getElementById('filterAnonymous');
  const filterNoTrack = document.getElementById('filterNoTrack');
  const resetBtn = document.getElementById('resetBtn');
  const themeBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const copyUrlBtn = document.getElementById('copyUrlBtn');

  const valL1 = document.getElementById('valL1');
  const valL2 = document.getElementById('valL2');
  const valL3 = document.getElementById('valL3');
  const valSum = document.getElementById('valSum');

  const bestChoiceContainer = document.getElementById('bestChoiceContainer');
  const resultsList = document.getElementById('resultsList');
  const presetButtons = document.querySelectorAll('.btn-preset');

  let copyToastTimer = null;

  function el(tag, className, text, css) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = text;
    if (css) element.style.cssText = css;
    return element;
  }

  function initTheme() {
    const saved = localStorage.getItem('furima_post_calc_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    themeIcon.textContent = saved === 'dark' ? '☀️' : '🌙';
  }

  themeBtn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('furima_post_calc_theme', next);
    themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
  });

  function loadInitialState() {
    const params = new URLSearchParams(window.location.search);
    let h = params.get('h'), w = params.get('w'), d = params.get('d'), weight = params.get('weight');
    let anon = params.get('anon'), noTrack = params.get('notrack');

    if (!h && !w && !d && !weight) {
      const saved = localStorage.getItem('furima_post_calc_inputs');
      if (saved) {
        try {
          const p = JSON.parse(saved);
          h = p.h; w = p.w; d = p.d; weight = p.weight;
        } catch (e) { console.error(e); }
      }
      if (anon === null) anon = localStorage.getItem('furima_post_calc_anonymous_only');
      if (noTrack === null) noTrack = localStorage.getItem('furima_post_calc_include_notrack');
    }

    if (h) inputH.value = h;
    if (w) inputW.value = w;
    if (d) inputD.value = d;
    if (weight) inputWeight.value = weight;
    if (anon !== null) filterAnon.checked = anon === '1' || anon === 'true';
    if (noTrack !== null) filterNoTrack.checked = noTrack === '1' || noTrack === 'true';
    updateCalculations();
  }

  function persistState(input, anon, noTrack) {
    localStorage.setItem('furima_post_calc_inputs', JSON.stringify(input));
    localStorage.setItem('furima_post_calc_anonymous_only', String(anon));
    localStorage.setItem('furima_post_calc_include_notrack', String(noTrack));

    const p = new URLSearchParams();
    if (input.h) p.set('h', input.h);
    if (input.w) p.set('w', input.w);
    if (input.d) p.set('d', input.d);
    if (input.weight) p.set('weight', input.weight);
    if (anon) p.set('anon', '1');
    if (noTrack) p.set('notrack', '1');
    window.history.replaceState(null, '', p.toString() ? `?${p.toString()}` : window.location.pathname);
  }

  function updateCalculations() {
    const h = parseFloat(inputH.value), w = parseFloat(inputW.value), d = parseFloat(inputDepth.value);
    const weight = parseInt(inputWeight.value, 10);
    const anonOnly = filterAnon.checked, includeNoTrack = filterNoTrack.checked;

    if (isNaN(h) || isNaN(w) || isNaN(d) || isNaN(weight) || h <= 0 || w <= 0 || d <= 0 || weight <= 0) {
      valL1.textContent = '-'; valL2.textContent = '-'; valL3.textContent = '-'; valSum.textContent = '-';
      bestChoiceContainer.replaceChildren();
      const empty = el('div', 'card', null, 'text-align: center; padding: 3rem 1rem; color: var(--text-muted);');
      empty.append(el('div', null, '📐', 'font-size: 2.5rem; margin-bottom: 0.5rem;'), el('p', null, '左側のフォームにサイズと重量を入力するか、定番プリセットを選択してください。'));
      resultsList.replaceChildren(empty);
      return;
    }

    const inputData = { h, w, d, weight };
    const dims = sortDimensions(h, w, d);
    valL1.textContent = `${dims.l1}cm`; valL2.textContent = `${dims.l2}cm`;
    valL3.textContent = `${dims.l3}cm`; valSum.textContent = `${dims.sum}cm`;

    persistState(inputData, anonOnly, includeNoTrack);
    const res = evaluateShippingServices(SHIPPING_SERVICES, inputData, { anonymousOnly: anonOnly, includeNoTrack });
    renderResults(res);
  }

  function renderResults(services) {
    bestChoiceContainer.replaceChildren();
    resultsList.replaceChildren();

    if (!services || services.length === 0) {
      const empty = el('div', 'card', null, 'text-align: center; padding: 2.5rem 1.5rem; color: var(--text-secondary);');
      empty.append(
        el('div', null, '🚫', 'font-size: 2rem; margin-bottom: 0.5rem;'),
        el('h3', null, '利用可能な配送方法が見つかりませんでした', 'color: var(--text-primary); margin-bottom: 0.5rem;'),
        el('p', null, 'サイズまたは重量が上限を超えているか、フィルター条件に合致しません。', 'font-size: 0.85rem; color: var(--text-muted);')
      );
      resultsList.appendChild(empty);
      return;
    }

    const best = services[0];
    const bestBanner = el('div', 'best-choice-banner');
    const left = el('div');
    left.append(
      el('span', 'best-tag', '🏆 最安発送おすすめ'),
      el('div', 'best-title', best.name),
      el('div', null, `${best.carrier} ・ ${best.isAnonymous ? '匿名配送対応' : '宛名記入必要'}`, 'font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;')
    );
    const right = el('div', null, null, 'text-align: right;');
    right.append(
      el('div', 'best-price', `¥${best.totalFee.toLocaleString()}`),
      el('div', null, `送料 ¥${best.baseFee} ${best.materialFee > 0 ? `+ 資材目安 ¥${best.materialFee}` : ''}`, 'font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);')
    );
    bestBanner.append(left, right);
    bestChoiceContainer.appendChild(bestBanner);

    services.forEach((s, idx) => {
      const isBest = idx === 0;
      const card = el('div', `result-card ${isBest ? 'is-best' : ''}`);

      const top = el('div', 'card-top');
      const info = el('div');
      info.append(
        el('span', isBest ? 'rank-badge rank-1' : 'rank-badge', `第 ${idx + 1} 位`),
        el('div', 'service-title', s.name),
        el('div', 'service-carrier', s.carrier)
      );
      const priceBox = el('div', 'price-box');
      priceBox.append(
        el('div', 'total-price', `¥${s.totalFee.toLocaleString()}`),
        el('div', 'price-breakdown', `送料 ¥${s.baseFee} ${s.materialFee > 0 ? `+ 資材 ¥${s.materialFee}` : '(資材代0円)'}`)
      );
      top.append(info, priceBox);

      const badges = el('div', 'badges-wrap');
      badges.appendChild(el('span', s.isAnonymous ? 'badge-pill badge-anon' : 'badge-pill badge-noanon', s.isAnonymous ? '🔒 匿名配送' : '✉️ 宛名必要'));
      if (s.postDrop) badges.appendChild(el('span', 'badge-pill badge-post', '📮 ポスト投函可'));
      if (s.hasTracking) badges.appendChild(el('span', 'badge-pill badge-track', '🔍 追跡あり'));
      if (s.hasInsurance) badges.appendChild(el('span', 'badge-pill badge-track', '🛡️ 補償あり'));

      card.append(top, badges);

      if (s.warnings?.length) {
        s.warnings.forEach(w => {
          const a = el('div', s.warningLevel === 'hard' ? 'card-alert card-alert-hard' : 'card-alert card-alert-soft');
          a.append(el('span', null, s.warningLevel === 'hard' ? '⛔' : '⚠️'), el('span', null, w));
          card.appendChild(a);
        });
      }

      const note = el('div', 'service-note', s.notes);
      if (s.materialFee > 0) {
        note.appendChild(el('div', null, '※資材代は購入店舗やセット数により異なる場合があります。', 'color: var(--text-muted); font-size: 0.75rem; margin-top: 0.2rem;'));
      }
      card.appendChild(note);
      resultsList.appendChild(card);
    });
  }

  [inputH, inputW, inputD, inputWeight].forEach(e => e.addEventListener('input', updateCalculations));
  filterAnon.addEventListener('change', updateCalculations);
  filterNoTrack.addEventListener('change', updateCalculations);

  presetButtons.forEach(btn => btn.addEventListener('click', () => {
    inputH.value = btn.dataset.h; inputW.value = btn.dataset.w;
    inputD.value = btn.dataset.d; inputWeight.value = btn.dataset.weight;
    updateCalculations();
  }));

  resetBtn.addEventListener('click', () => {
    inputH.value = ''; inputW.value = ''; inputD.value = ''; inputWeight.value = '';
    filterAnon.checked = false; filterNoTrack.checked = false;
    localStorage.removeItem('furima_post_calc_inputs');
    window.history.replaceState(null, '', window.location.pathname);
    updateCalculations();
  });

  copyUrlBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (copyToastTimer) clearTimeout(copyToastTimer);
      copyUrlBtn.textContent = '✅ URLをコピー完了！';
      copyToastTimer = setTimeout(() => {
        copyUrlBtn.textContent = '🔗 条件を共有';
        copyToastTimer = null;
      }, 2000);
    } catch (e) { alert('URLのコピーに失敗しました: ' + window.location.href); }
  });

  initTheme();
  loadInitialState();
});
