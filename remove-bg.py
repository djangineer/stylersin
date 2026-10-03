from PIL import Image

src = r'c:\Projects\Website\assets\phone.PNG'
out = r'c:\Projects\Website\assets\phone-clean.png'

img = Image.open(src).convert('RGBA')
width, height = img.size
pixels = img.getdata()

new_pixels = []
for r, g, b, a in pixels:
    if a < 20:
        new_pixels.append((255, 255, 255, 0))
        continue

    brightness = (r + g + b) / 3
    # Remove plain light/neutral background while preserving the dark phone body and content.
    if brightness > 245 and abs(r - g) < 18 and abs(g - b) < 18:
        new_pixels.append((255, 255, 255, 0))
    else:
        new_pixels.append((r, g, b, a))

img.putdata(new_pixels)
img.save(out)
print(f'Saved transparent version to {out}')
