"""
FurimaPostCalc - プロモーション用アニメーションGIF生成スクリプト
note見出し・本文およびX（Twitter）投稿兼用の1200x675 (16:9) アニメーションGIFを生成
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont

# Windowsコンソール文字化け防止
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

W, H = 1200, 675
FONT_B = 'C:/Windows/Fonts/meiryob.ttc' if os.path.exists('C:/Windows/Fonts/meiryob.ttc') else None
FONT_R = 'C:/Windows/Fonts/meiryo.ttc' if os.path.exists('C:/Windows/Fonts/meiryo.ttc') else None

def get_font(size, bold=False):
    path = FONT_B if bold else FONT_R
    if path:
        return ImageFont.truetype(path, size)
    return ImageFont.load_default()

C_BG = (9, 9, 11)
C_CARD = (18, 18, 21)
C_CARD_HL = (24, 24, 28)
C_BORDER = (39, 39, 42)
C_BORDER_HL = (59, 130, 246)
C_TEXT = (250, 250, 250)
C_MUTED = (161, 161, 170)
C_DIM = (113, 113, 122)
C_EMERALD = (16, 185, 129)
C_EMERALD_BG = (16, 45, 35)
C_BLUE = (59, 130, 246)
C_AMBER = (245, 158, 11)

def draw_header(d):
    d.rectangle([0, 0, W, 50], fill=(13, 13, 16))
    d.line([0, 50, W, 50], fill=C_BORDER, width=1)
    f_logo = get_font(20, True)
    f_sub = get_font(13, True)
    d.text((40, 14), "FurimaPostCalc", font=f_logo, fill=C_TEXT)
    d.rounded_rectangle([210, 13, 355, 37], radius=4, fill=(35, 25, 10), outline=C_AMBER, width=1)
    d.text((220, 15), "2026年10月改定対応", font=f_sub, fill=C_AMBER)
    d.text((W - 250, 16), "完全オフライン ・ 登録不要", font=get_font(13, False), fill=C_MUTED)

def draw_base_ui():
    im = Image.new('RGB', (W, H), C_BG)
    d = ImageDraw.Draw(im)
    draw_header(d)
    
    # バナー
    d.rounded_rectangle([40, 62, W - 40, 94], radius=6, fill=(30, 25, 12), outline=(120, 80, 20), width=1)
    d.text((55, 69), "[重要] 2026年10月1日以降適用分基準 (クリックポスト改定・資材費込で最安判定)", font=get_font(13, True), fill=C_AMBER)
    
    # 左ペイン
    d.rounded_rectangle([40, 106, 470, 640], radius=10, fill=C_CARD, outline=C_BORDER, width=1)
    d.text((60, 122), "サイズ・重量入力 (向き不問)", font=get_font(16, True), fill=C_TEXT)
    
    # 右ペイン
    d.rounded_rectangle([495, 106, W - 40, 640], radius=10, fill=C_CARD, outline=C_BORDER, width=1)
    d.text((515, 122), "判定結果一覧 (必須資材込・実質最安順)", font=get_font(16, True), fill=C_TEXT)
    return im

def draw_input_box(d, y, label, val, active=False):
    d.text((60, y), label, font=get_font(13, True), fill=C_MUTED)
    border_c = C_BORDER_HL if active else C_BORDER
    bg_c = C_CARD_HL if active else (13, 13, 16)
    d.rounded_rectangle([60, y + 22, 450, y + 62], radius=6, fill=bg_c, outline=border_c, width=1 if not active else 2)
    if val:
        d.text((75, y + 30), str(val), font=get_font(18, True), fill=C_TEXT)

def draw_summary_box(d, l1, l2, l3, highlight=False):
    bg_c = (20, 30, 45) if highlight else (13, 13, 16)
    border_c = C_BLUE if highlight else C_BORDER
    d.rounded_rectangle([60, 480, 450, 545], radius=6, fill=bg_c, outline=border_c, width=1)
    d.text((75, 490), "3辺自動回転ソート幾何判定:", font=get_font(12, True), fill=C_BLUE if highlight else C_MUTED)
    text = f"長辺 {l1} cm  |  中辺 {l2} cm  |  厚さ {l3} cm" if l1 else "- cm  |  - cm  |  - cm"
    d.text((75, 512), text, font=get_font(14, True), fill=C_TEXT if highlight else C_DIM)

def draw_result_card(d, s_name, fee_total, fee_base, fee_mat, carrier, badge_text="BEST CHOICE"):
    # ベストカード
    d.rounded_rectangle([515, 160, W - 60, 310], radius=8, fill=C_EMERALD_BG, outline=C_EMERALD, width=2)
    d.rounded_rectangle([530, 175, 650, 202], radius=4, fill=C_EMERALD)
    d.text((540, 178), f"★ {badge_text}", font=get_font(12, True), fill=(0, 0, 0))
    d.text((660, 178), carrier, font=get_font(13, False), fill=C_MUTED)
    
    d.text((530, 215), s_name, font=get_font(24, True), fill=C_TEXT)
    d.text((W - 320, 215), "実質総額", font=get_font(14, False), fill=C_MUTED)
    d.text((W - 240, 200), f"{fee_total}円", font=get_font(34, True), fill=C_EMERALD)
    
    breakdown = f"(基本送料 {fee_base}円 + 必須専用資材 {fee_mat}円)" if fee_mat > 0 else f"(基本送料 {fee_total}円 / 資材代 0円)"
    d.text((530, 265), breakdown, font=get_font(13, True), fill=C_MUTED)
    
    # タグ
    tags = ["匿名配送", "追跡あり", "ポスト投函可"]
    x = 530
    for t in tags:
        d.rounded_rectangle([x, 285, x + 85, 305], radius=4, fill=(20, 40, 30), outline=(30, 80, 50))
        d.text((x + 8, 288), t, font=get_font(11, True), fill=C_EMERALD)
        x += 95

def draw_compare_table(d):
    # 他サービス比較リスト
    rows = [
        ("ネコポス (メルカリ便)", "210円", "210円 + 0円", "厚さ3cm制限"),
        ("ゆうパケットポスト (シール)", "約223円", "215円 + 約8円", "ポスト投函OK"),
        ("クリックポスト (2026改定版)", "240円", "240円 + 0円", "2kg・3辺60cm")
    ]
    d.text((515, 335), "その他の利用可能サービス比較:", font=get_font(14, True), fill=C_MUTED)
    y = 365
    for name, total, sub, note in rows:
        d.rounded_rectangle([515, y, W - 60, y + 55], radius=6, fill=C_CARD_HL, outline=C_BORDER, width=1)
        d.text((535, y + 16), name, font=get_font(14, True), fill=C_TEXT)
        d.text((820, y + 16), sub, font=get_font(12, False), fill=C_MUTED)
        d.text((W - 170, y + 14), total, font=get_font(18, True), fill=C_TEXT)
        y += 65

def create_frames():
    frames = []
    durations = []

    # ================= シーン1: タイトル・キャッチ (1.6s, 4フレーム) =================
    base = Image.new('RGB', (W, H), C_BG)
    d = ImageDraw.Draw(base)
    draw_header(d)
    # 中央ヒーローカード
    d.rounded_rectangle([150, 120, W - 150, 580], radius=16, fill=C_CARD, outline=C_BORDER, width=2)
    d.rounded_rectangle([W//2 - 130, 160, W//2 + 130, 195], radius=6, fill=C_EMERALD_BG, outline=C_EMERALD, width=1)
    d.text((W//2 - 110, 168), "メルカリ・フリマ出品者 必見！", font=get_font(14, True), fill=C_EMERALD)
    
    d.text((200, 220), "「送料が一番安い配送方法」\n資材代込みでパッと分かりますか？", font=get_font(30, True), fill=C_TEXT)
    d.line([200, 320, W - 200, 320], fill=C_BORDER, width=1)
    
    d.text((200, 350), "送料だけ見ると安くても... 専用箱やシール代を含めると逆転することも！", font=get_font(17, False), fill=C_MUTED)
    d.text((200, 390), "FurimaPostCalc なら「必須専用資材込みの実質総額」で即座に判定。", font=get_font(17, True), fill=C_TEXT)
    
    d.rounded_rectangle([200, 450, W - 200, 530], radius=8, fill=C_CARD_HL, outline=C_BLUE, width=1)
    d.text((240, 475), "★ 2026年10月改定対応  ★ 3辺自動回転判定  ★ 完全オフライン・登録不要", font=get_font(18, True), fill=C_BLUE)
    
    for _ in range(4):
        frames.append(base.copy())
        durations.append(400)

    # ================= シーン2: 入力アニメーション (2.1s, 7フレーム) =================
    inputs_steps = [
        (None, None, None, None, False, "未入力"),
        ("20.0 cm", None, None, None, False, "縦を入力..."),
        ("20.0 cm", "15.0 cm", None, None, False, "横を入力..."),
        ("20.0 cm", "15.0 cm", "2.0 cm", None, False, "厚さを入力..."),
        ("20.0 cm", "15.0 cm", "2.0 cm", "500 g", False, "重量を入力..."),
        ("20.0 cm", "15.0 cm", "2.0 cm", "500 g", True, "3辺自動回転ソート実行中..."),
        ("20.0 cm", "15.0 cm", "2.0 cm", "500 g", True, "向き不問で最短辺を『厚さ』に自動認識！")
    ]
    for h, w, d_val, wt, hl, note in inputs_steps:
        f = draw_base_ui()
        df = ImageDraw.Draw(f)
        draw_input_box(df, 160, "縦 (cm)", h, active=(h is not None and w is None))
        draw_input_box(df, 240, "横 (cm)", w, active=(w is not None and d_val is None))
        draw_input_box(df, 320, "厚さ (cm)", d_val, active=(d_val is not None and wt is None))
        draw_input_box(df, 400, "重量 (g)", wt, active=(wt is not None and not hl))
        
        if hl:
            draw_summary_box(df, "20.0", "15.0", "2.0", highlight=True)
            df.rounded_rectangle([100, 570, 410, 615], radius=6, fill=(10, 35, 60), outline=C_BLUE, width=1)
            df.text((115, 582), "荷物の向きを気にせず判定OK！", font=get_font(13, True), fill=(100, 200, 255))
        else:
            draw_summary_box(df, None, None, None, highlight=False)
            
        # 右ペイン待機表示
        df.text((630, 340), "← サイズ・重量を入力すると自動判定", font=get_font(18, True), fill=C_DIM)
        frames.append(f)
        durations.append(300)

    # ================= シーン3: 最安判定結果 & 比較 (2.5s, 5フレーム) =================
    for i in range(5):
        f = draw_base_ui()
        df = ImageDraw.Draw(f)
        draw_input_box(df, 160, "縦 (cm)", "20.0 cm")
        draw_input_box(df, 240, "横 (cm)", "15.0 cm")
        draw_input_box(df, 320, "厚さ (cm)", "2.0 cm")
        draw_input_box(df, 400, "重量 (g)", "500 g")
        draw_summary_box(df, "20.0", "15.0", "2.0", highlight=True)
        
        # 判定結果
        draw_result_card(df, "ゆうパケットポストmini", 180, 160, 20, "日本郵便 (ゆうゆうメルカリ便)")
        draw_compare_table(df)
        
        # 強調ポップアップ
        badge_border = C_EMERALD if i % 2 == 0 else (255, 255, 255)
        df.rounded_rectangle([W - 380, 115, W - 50, 155], radius=6, fill=(10, 40, 25), outline=badge_border, width=2)
        df.text((W - 365, 126), "専用封筒代(20円)込みで最安！", font=get_font(13, True), fill=C_EMERALD)
        
        frames.append(f)
        durations.append(500)

    # ================= シーン4: まとめ・CTA (1.8s, 4フレーム) =================
    f_final = Image.new('RGB', (W, H), C_BG)
    df = ImageDraw.Draw(f_final)
    draw_header(df)
    df.rounded_rectangle([150, 110, W - 150, 600], radius=16, fill=C_CARD, outline=C_EMERALD, width=2)
    
    df.text((W//2 - 220, 140), "出品前の「送料モヤモヤ」をゼロに。", font=get_font(26, True), fill=C_TEXT)
    
    features = [
        ("1. 必須専用資材込みの「実質総額」で最安比較", "専用箱・封筒・シール代を自動合算して判定"),
        ("2. 2026年10月1日改定先行対応", "クリックポスト240円・2kg化などの未来改定を網羅"),
        ("3. 向き不問の3辺自動ソート & 段階的警告", "一番薄い辺を厚さに自動認識・ポスト口の厚さ限界を警告"),
        ("4. 完全オフライン動作 & 登録不要", "サーバー通信なし・ブラウザを開くだけで即座に動作")
    ]
    
    y = 205
    for title, desc in features:
        df.rounded_rectangle([200, y, W - 200, y + 60], radius=8, fill=C_CARD_HL, outline=C_BORDER, width=1)
        df.text((225, y + 10), title, font=get_font(16, True), fill=C_EMERALD)
        df.text((225, y + 34), desc, font=get_font(13, False), fill=C_MUTED)
        y += 75
        
    df.rounded_rectangle([W//2 - 180, 525, W//2 + 180, 575], radius=25, fill=C_EMERALD)
    df.text((W//2 - 140, 538), "FurimaPostCalc を今すぐ体験！", font=get_font(16, True), fill=(0, 0, 0))
    
    for _ in range(4):
        frames.append(f_final.copy())
        durations.append(450)

    return frames, durations

def main():
    print("[INFO] プロモーションGIFのフレーム生成を開始...")
    frames, durations = create_frames()
    print(f"[INFO] 合計フレーム数: {len(frames)}")
    
    out_path = "furima_calc_promo.gif"
    print(f"[INFO] GIF保存中: {out_path} ...")
    
    # 256色パレットに最適化して保存
    p_frames = [f.quantize(colors=256, method=Image.Resampling.LANCZOS) for f in frames]
    p_frames[0].save(
        out_path,
        save_all=True,
        append_images=p_frames[1:],
        duration=durations,
        loop=0,
        optimize=True
    )
    
    size_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f"[SUCCESS] 生成完了: {out_path} ({size_mb:.2f} MB)")

if __name__ == '__main__':
    main()
