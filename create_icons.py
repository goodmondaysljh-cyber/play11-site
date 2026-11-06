from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
out=Path('/home/ubuntu/play11/public/icons')
out.mkdir(parents=True,exist_ok=True)
for size in (192,512):
    im=Image.new('RGB',(size,size),'#08111f')
    d=ImageDraw.Draw(im)
    d.rounded_rectangle((size*.12,size*.12,size*.88,size*.88),radius=size*.18,fill='#d6ff55')
    d.ellipse((size*.20,size*.20,size*.80,size*.80),fill='#10243b')
    font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',int(size*.25))
    text='11'
    box=d.textbbox((0,0),text,font=font)
    d.text(((size-(box[2]-box[0]))/2,-box[1]+size*.37),text,font=font,fill='#d6ff55')
    d.text((size*.16,size*.82),'PLAY',font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',int(size*.075)),fill='#08111f')
    im.save(out/f'icon-{size}.png')
