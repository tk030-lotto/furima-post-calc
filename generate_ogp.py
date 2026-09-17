"""
FurimaPostCalc - OGP静止画サムネイル (1200x630 px) 生成スクリプト
SNS (X/Twitter, note, LINE, Facebook等) 最適化規格
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

W, H = 1200, 630
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

def main():
    print("[INFO] OGP画像の生成を開始...")
    im = Image.new('RGB', (W, H), C_BG)
    d = ImageDraw.Draw(im)

    # ヘッダー
    d.rectangle([0, 0, W, 52], fill=(13, 13, 16))
    d.line([0, 52, W, 52], fill=C_BORDER, width=1)
    d.text((40, 14), "FurimaPostCalc", font=get_font(22, True), fill=C_TEXT)
    d.rounded_rectangle([225, 14, 385, 38], radius=4, fill=(35, 25, 10), outline=C_AMBER, width=1)
    d.text((238, 16), "2026年10月改定対応", font=get_font(13, True), fill=C_AMBER)
    d.text((W - 320, 16), "メルカリ・フリマ専用：送料・梱包判定", font=get_font(14, False), fill=C_MUTED)

    # キャッチバナー
    d.rounded_rectangle([40, 64, W - 40, 98], radius=6, fill=(30, 25, 12), outline=(120, 80, 20), width=1)
    d.text((55, 72), "[2026年10月改定対応] 必須専用資材代(箱・封筒・シール)を含めた実質総額の最安順に自動判定！", font=get_font(14, True), fill=C_AMBER)

    # 左ペイン: 入力モック
    d.rounded_rectangle([40, 110, 470, 600], radius=10, fill=C_CARD, outline=C_BORDER, width=1)
    d.text((60, 126), "サイズ・重量入力 (向き不問)", font=get_font(16, True), fill=C_TEXT)

    fields = [
        ("縦 (cm)", "20.0 cm", 165),
        ("横 (cm)", "15.0 cm", 245),
        ("厚さ (cm)", "2.0 cm", 325),
        ("重量 (g)", "500 g", 405)
    ]
    for label, val, y in fields:
        d.text((60, y), label, font=get_font(13, True), fill=C_MUTED)
        d.rounded_rectangle([60, y + 20, 450, y + 58], radius=6, fill=(13, 13, 16), outline=C_BORDER, width=1)
        d.text((75, y + 26), val, font=get_font(17, True), fill=C_TEXT)

    # 3辺ソート
    d.rounded_rectangle([60, 485, 450, 545], radius=6, fill=(20, 30, 45), outline=C_BLUE, width=1)
    d.text((75, 495), "3辺自動回転ソート幾何判定:", font=get_font(12, True), fill=C_BLUE)
    d.text((75, 517), "長辺 20.0cm | 中辺 15.0cm | 厚さ 2.0cm", font=get_font(14, True), fill=C_TEXT)
    d.text((75, 562), "※入力順に関わらず最短辺を厚さに認識", font=get_font(12, False), fill=C_MUTED)

    # 右ペイン: 判定結果
    d.rounded_rectangle([495, 110, W - 40, 600], radius=10, fill=C_CARD, outline=C_BORDER, width=1)
    d.text((515, 126), "判定結果一覧 (必須資材込・実質最安順)", font=get_font(16, True), fill=C_TEXT)

    # ベストカード
    d.rounded_rectangle([515, 165, W - 60, 315], radius=8, fill=C_EMERALD_BG, outline=C_EMERALD, width=2)
    d.rounded_rectangle([530, 180, 650, 207], radius=4, fill=C_EMERALD)
    d.text((540, 183), "★ BEST CHOICE", font=get_font(12, True), fill=(0, 0, 0))
    d.text((665, 183), "日本郵便 (ゆうゆうメルカリ便)", font=get_font(13, False), fill=C_MUTED)

    d.text((530, 220), "ゆうパケットポストmini", font=get_font(24, True), fill=C_TEXT)
    d.text((W - 320, 220), "実質総額", font=get_font(14, False), fill=C_MUTED)
    d.text((W - 240, 205), "180円", font=get_font(34, True), fill=C_EMERALD)

    d.text((530, 270), "(基本送料 160円 + 必須専用封筒 20円)", font=get_font(13, True), fill=C_MUTED)

    tags = ["匿名配送", "追跡あり", "ポスト投函可"]
    x = 530
    for t in tags:
        d.rounded_rectangle([x, 288, x + 85, 308], radius=4, fill=(20, 40, 30), outline=(30, 80, 50))
        d.text((x + 8, 291), t, font=get_font(11, True), fill=C_EMERALD)
        x += 95

    # 比較リスト
    d.text((515, 335), "その他の利用可能サービス比較:", font=get_font(14, True), fill=C_MUTED)
    rows = [
        ("ネコポス (メルカリ便)", "210円", "210円 + 0円"),
        ("ゆうパケットポスト (シール)", "約223円", "215円 + 約8円"),
        ("クリックポスト (2026改定版)", "240円", "240円 + 0円")
    ]
    y = 365
    for name, total, sub in rows:
        d.rounded_rectangle([515, y, W - 60, y + 50], radius=6, fill=C_CARD_HL, outline=C_BORDER, width=1)
        d.text((535, y + 15), name, font=get_font(14, True), fill=C_TEXT)
        d.text((810, y + 15), sub, font=get_font(12, False), fill=C_MUTED)
        d.text((W - 170, y + 13), total, font=get_font(18, True), fill=C_TEXT)
        y += 58

    # フッター特徴
    d.rounded_rectangle([515, 545, W - 60, 588], radius=6, fill=(15, 25, 20), outline=C_EMERALD, width=1)
    d.text((535, 558), "✔ 完全オフライン動作  ✔ 登録不要  ✔ 2026年10月改定先行対応", font=get_font(13, True), fill=C_EMERALD)

    out_path = "ogp.png"
    im.save(out_path, format="PNG", optimize=True)
    print(f"[SUCCESS] OGP画像生成完了: {out_path} ({os.path.getsize(out_path)/1024:.1f} KB)")

if __name__ == '__main__':
    main()
