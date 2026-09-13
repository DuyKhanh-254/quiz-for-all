from PIL import Image

def create_reference_image():
    p22 = Image.open(r"d:\WEB_QUIZ\content\test-10-assets\raw\lwxv-page-22.jpg")
    p23 = Image.open(r"d:\WEB_QUIZ\content\test-10-assets\raw\lwxv-page-23.jpg")
    
    w, h = p22.size
    # Crop borders: left ~140, top ~180, right ~w-140, bottom ~h-120
    crop22 = p22.crop((140, 180, w - 140, h - 140))
    crop23 = p23.crop((140, 180, w - 140, h - 140))
    
    # Place side by side with small margin
    cw, ch = crop22.size
    combined = Image.new("RGB", (cw * 2 + 30, ch), (255, 255, 255))
    combined.paste(crop22, (0, 0))
    combined.paste(crop23, (cw + 30, 0))
    
    out_dir = r"d:\WEB_QUIZ\content\test-10-assets\images\listening"
    out_path = f"{out_dir}\\test10-reference.jpg"
    combined.save(out_path, quality=90)
    print("Saved combined reference image:", out_path, combined.size)

create_reference_image()
