import os
import urllib.request
import subprocess
from PIL import Image, ImageDraw

build_dir = "/home/fidai-work/scratch/claude-20261124-taste-personale/build"
img_dir = os.path.join(build_dir, "img")
os.makedirs(img_dir, exist_ok=True)

def download_image(url, path):
    print(f"Downloading {url}...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as response, open(path, "wb") as f:
        f.write(response.read())

# 1. Process f152671732 (Canottaggio sul Po)
url1 = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Torino_-_Comune_di_Torino_-_2024-09-15_18-19-38_001.jpg"
src1_path = "/tmp/f152671732.jpg"
if not os.path.exists(src1_path):
    download_image(url1, src1_path)

im1 = Image.open(src1_path).convert("RGB")
w, h = im1.size
target_ratio = 3/2
current_ratio = w / h
if current_ratio > target_ratio:
    new_w = int(h * target_ratio)
    left = (w - new_w) // 2
    top = 0
    right = left + new_w
    bottom = h
else:
    new_h = int(w / target_ratio)
    left = 0
    top = (h - new_h) // 2
    right = w
    bottom = top + new_h

im1_cropped = im1.crop((left, top, right, bottom))

for size, quality in [( (1920, 1280), 74 ), ( (960, 640), 76 ), ( (720, 480), 76 )]:
    im_resized = im1_cropped.resize(size, Image.Resampling.LANCZOS)
    suffix = str(size[0])
    out_p = os.path.join(img_dir, f"photo-f152671732-{suffix}.webp")
    im_resized.save(out_p, "WEBP", quality=quality)
    print(f"Saved {out_p} ({os.path.getsize(out_p)} bytes)")


# 2. Process f129314742 (Portici Rettorato UniTO)
url2 = "https://upload.wikimedia.org/wikipedia/commons/c/cd/Porticos_in_the_courtyard%2C_Palazzo_dell%27Universit%C3%A0%2C_Turin%2C_Italy.jpg"
src2_path = "/tmp/f129314742.jpg"
if not os.path.exists(src2_path):
    download_image(url2, src2_path)

im2 = Image.open(src2_path).convert("RGB")
w, h = im2.size
if w / h > target_ratio:
    new_w = int(h * target_ratio)
    left = (w - new_w) // 2
    top = 0
    right = left + new_w
    bottom = h
else:
    new_h = int(w / target_ratio)
    left = 0
    top = (h - new_h) // 2
    right = w
    bottom = top + new_h

im2_cropped = im2.crop((left, top, right, bottom))

for size, quality in [( (1920, 1280), 74 ), ( (960, 640), 76 ), ( (720, 480), 76 )]:
    im_resized = im2_cropped.resize(size, Image.Resampling.LANCZOS)
    suffix = str(size[0])
    out_p = os.path.join(img_dir, f"photo-f129314742-{suffix}.webp")
    im_resized.save(out_p, "WEBP", quality=quality)
    print(f"Saved {out_p} ({os.path.getsize(out_p)} bytes)")


# 3. Process fidai-stage (`fidai-stage-*.webp`)
canvas_1920 = Image.new("RGB", (1920, 1280), "#f3f0ea")

logo_path = "/srv/landing/fid.ai/images/logo-nome-azienda.png"
if os.path.exists(logo_path):
    logo_im = Image.open(logo_path).convert("RGBA")
    lw, lh = logo_im.size
    new_lw = 260
    new_lh = int(lh * (new_lw / lw))
    logo_im = logo_im.resize((new_lw, new_lh), Image.Resampling.LANCZOS)
    canvas_1920.paste(logo_im, (860, 405), logo_im)

bozze_path = "/srv/landing/fid.ai/images/app/bozze-desktop.png"
if os.path.exists(bozze_path):
    bozze_im = Image.open(bozze_path).convert("RGBA")
    
    # 1. Fascia intestazione Bozze AI: (20, 14, 720, 86)
    head_crop = bozze_im.crop((20, 14, 720, 86))
    hw, hh = head_crop.size
    new_hw = 460
    new_hh = int(hh * (new_hw / hw))
    head_resized = head_crop.resize((new_hw, new_hh), Image.Resampling.LANCZOS)
    
    # 2. Prima card reale: (44, 96, 1556, 212)
    card_crop = bozze_im.crop((44, 96, 1556, 212))
    cw, ch = card_crop.size
    new_cw = 900
    new_ch = int(ch * (new_cw / cw))
    card_resized = card_crop.resize((new_cw, new_ch), Image.Resampling.LANCZOS)
    
    # Riquadro bianco 940x236 con bordo 1px #dfd9ce, angoli arrotondati 14px
    box_w, box_h = 940, 236
    box_im = Image.new("RGBA", (box_w, box_h), (255, 255, 255, 255))
    
    d = ImageDraw.Draw(box_im)
    d.rounded_rectangle([0, 0, box_w - 1, box_h - 1], radius=14, outline="#dfd9ce", width=1, fill="#ffffff")
    
    # Inserisci fascia Bozze AI a (24, 16)
    box_im.paste(head_resized, (24, 16), head_resized)
    # Sotto la card Sara Belotti a (20, 96)
    box_im.paste(card_resized, (20, 96), card_resized)
    
    # Posiziona questo riquadro bianco a (860, 525) sul canvas #f3f0ea
    canvas_1920.paste(box_im, (860, 525), box_im)

for size, quality in [((1920, 1280), 82), ((960, 640), 82), ((720, 480), 82)]:
    im_resized = canvas_1920.resize(size, Image.Resampling.LANCZOS)
    suffix = str(size[0])
    out_p = os.path.join(img_dir, f"fidai-stage-{suffix}.webp")
    im_resized.save(out_p, "WEBP", quality=quality)
    print(f"Saved {out_p} ({os.path.getsize(out_p)} bytes)")

# Rimuovi i vecchi file fidai-collage-* se presenti
for old_s in [1920, 960, 720]:
    old_p = os.path.join(img_dir, f"fidai-collage-{old_s}.webp")
    if os.path.exists(old_p):
        os.remove(old_p)
        print(f"Removed old {old_p}")


# 4. Process DotSpace brand (`dotspace-brand-*.webp`)
pdf_path = "/home/fidai-root/personale/DotSpace - Progetto sito web.pdf"
tmp_png_prefix = "/tmp/ds_p1"
tmp_png_path = "/tmp/ds_p1-01.png"

if os.path.exists(pdf_path):
    subprocess.run(["pdftoppm", "-png", "-f", "1", "-l", "1", "-r", "144", pdf_path, tmp_png_prefix], check=True)
    
    if os.path.exists(tmp_png_path):
        page_im = Image.open(tmp_png_path).convert("RGB")
        pw, ph = page_im.size
        print(f"Rendered PDF page size: {pw}x{ph}")
        
        ds_canvas = Image.new("RGB", (1920, 1280), "#04070d")
        
        # Trama blu destra (SENZA testo): ritaglia x = 1960..3840, y = 180..2020
        pattern_crop = page_im.crop((1960, 180, 3840, 2020))
        pattern_resized = pattern_crop.resize((1040, 1280), Image.Resampling.LANCZOS)
        
        pattern_rgba = pattern_resized.convert("RGBA")
        mask = Image.new("L", (1040, 1280), 255)
        mask_draw = ImageDraw.Draw(mask)
        fade_w = 260
        for x in range(fade_w):
            alpha = int(255 * (x / fade_w))
            mask_draw.line([(x, 0), (x, 1280)], fill=alpha)
        
        pattern_rgba.putalpha(mask)
        ds_canvas.paste(pattern_rgba, (880, 0), pattern_rgba)
        
        # Logo ufficiale DotSpace: ritaglia (200, 100, 900, 320)
        logo_crop = page_im.crop((200, 100, 900, 320))
        gray_logo = logo_crop.convert("L")
        bin_logo = gray_logo.point(lambda p: 255 if p > 18 else 0)
        bbox = bin_logo.getbbox()
        if bbox:
            bx0, by0, bx1, by1 = bbox
            bx0 = max(0, bx0 - 12)
            by0 = max(0, by0 - 12)
            bx1 = min(logo_crop.width, bx1 + 12)
            by1 = min(logo_crop.height, by1 + 12)
            logo_crop = logo_crop.crop((bx0, by0, bx1, by1))
        
        lw, lh = logo_crop.size
        target_lw = 580
        target_lh = int(lh * (target_lw / lw))
        logo_resized = logo_crop.resize((target_lw, target_lh), Image.Resampling.LANCZOS)
        
        logo_x = 1260 - target_lw // 2
        logo_y = 540 - target_lh // 2
        
        logo_rgba = logo_resized.convert("RGBA")
        datas = logo_rgba.getdata()
        new_data = []
        for item in datas:
            if item[0] < 20 and item[1] < 20 and item[2] < 20:
                new_data.append((0, 0, 0, 0))
            else:
                new_data.append(item)
        logo_rgba.putdata(new_data)
        
        ds_canvas.paste(logo_rgba, (logo_x, logo_y), logo_rgba)
        
        for size, quality in [((1920, 1280), 82), ((960, 640), 82), ((720, 480), 82)]:
            im_resized = ds_canvas.resize(size, Image.Resampling.LANCZOS)
            suffix = str(size[0])
            out_p = os.path.join(img_dir, f"dotspace-brand-{suffix}.webp")
            im_resized.save(out_p, "WEBP", quality=quality)
            print(f"Saved {out_p} ({os.path.getsize(out_p)} bytes)")
            
        os.remove(tmp_png_path)
        print("Removed temporary PDF png")

print("Image generation complete!")
