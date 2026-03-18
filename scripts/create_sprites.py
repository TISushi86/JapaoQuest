from PIL import Image, ImageDraw
import os

OUTPUT_DIR = "src/assets"
FRAME_W = 48
FRAME_H = 64
COLS = 4  # 4 frames por direção
ROWS = 4  # down, up, left, right

def draw_ronin_frame(draw, ox, oy, direction, frame, is_female=False):
    """
    Desenha um frame do personagem Ronin em pixel art.
    ox, oy = offset X e Y na imagem final
    direction = 'down'|'up'|'left'|'right'
    frame = 0..3 (frame de animação)
    """
    # Cores
    SKIN   = (220, 170, 130, 255)
    HAIR   = (40,  30,  20,  255)
    ROBE   = (50,  60,  90,  255)  # Azul escuro
    BELT   = (30,  30,  30,  255)
    SWORD  = (160, 160, 180, 255)
    SHEATH = (80,  50,  20,  255)
    EYE    = (30,  20,  10,  255)
    FOOT   = (80,  60,  40,  255)

    if is_female:
        ROBE = (140, 30, 30, 255)  # Vermelho para feminino

    # Animação de andar: mover pernas
    walk_offset = [0, 2, 0, -2][frame]

    # Centro base do personagem
    cx = ox + FRAME_W // 2
    cy = oy + FRAME_H // 2

    def px(x, y, color):
        draw.rectangle([ox + x, oy + y, ox + x, oy + y], fill=color)

    def rect(x1, y1, x2, y2, color):
        draw.rectangle([ox + x1, oy + y1, ox + x2, oy + y2], fill=color)

    if direction == 'down':
        # Cabeca
        rect(18, 8,  30, 22, SKIN)
        # Cabelo
        rect(18, 6,  30, 10, HAIR)
        rect(17, 10, 18, 14, HAIR)  # lateral esq
        rect(30, 10, 31, 14, HAIR)  # lateral dir
        # Olhos
        rect(20, 15, 21, 16, EYE)
        rect(27, 15, 28, 16, EYE)
        # Corpo / Kimono
        rect(16, 23, 32, 40, ROBE)
        # Cinto
        rect(16, 37, 32, 40, BELT)
        # Espada (no lado)
        rect(32, 30, 35, 44, SHEATH)
        rect(32, 28, 35, 30, SWORD)
        # Braços
        rect(13, 24, 16, 36, ROBE)
        rect(32, 24, 35, 36, ROBE)
        # Pernas (com animação)
        rect(17, 41, 23, 56 + walk_offset,     ROBE)
        rect(25, 41, 31, 56 - walk_offset,     ROBE)
        # Pés
        rect(16, 55 + walk_offset,  24, 58 + walk_offset,  FOOT)
        rect(24, 55 - walk_offset,  32, 58 - walk_offset,  FOOT)

    elif direction == 'up':
        # Cabeca (vista de costas)
        rect(18, 8,  30, 22, SKIN)
        rect(18, 6,  30, 12, HAIR)
        rect(17, 12, 18, 18, HAIR)
        rect(30, 12, 31, 18, HAIR)
        # Corpo
        rect(16, 23, 32, 40, ROBE)
        rect(16, 37, 32, 40, BELT)
        # Espada (nas costas)
        rect(14, 24, 17, 44, SHEATH)
        rect(14, 22, 17, 24, SWORD)
        # Braços
        rect(13, 24, 16, 36, ROBE)
        rect(32, 24, 35, 36, ROBE)
        # Pernas
        rect(17, 41, 23, 56 + walk_offset,     ROBE)
        rect(25, 41, 31, 56 - walk_offset,     ROBE)
        rect(16, 55 + walk_offset,  24, 58 + walk_offset,  FOOT)
        rect(24, 55 - walk_offset,  32, 58 - walk_offset,  FOOT)

    elif direction == 'right':
        # Cabeca
        rect(16, 8,  28, 22, SKIN)
        rect(14, 6,  28, 11, HAIR)
        rect(14, 11, 16, 20, HAIR)
        # Olho
        rect(26, 15, 27, 16, EYE)
        # Corpo
        rect(14, 23, 30, 40, ROBE)
        rect(14, 37, 30, 40, BELT)
        # Espada
        rect(30, 28, 36, 44, SHEATH)
        rect(30, 26, 36, 29, SWORD)
        # Braço frente
        rect(30, 25, 34, 36, ROBE)
        # Pernas
        rect(15, 41, 21, 56 + walk_offset,     ROBE)
        rect(22, 41, 28, 56 - walk_offset,     ROBE)
        rect(14, 55 + walk_offset,  22, 58 + walk_offset,  FOOT)
        rect(21, 55 - walk_offset,  29, 58 - walk_offset,  FOOT)

    elif direction == 'left':
        # Cabeca (espelhada)
        rect(20, 8,  32, 22, SKIN)
        rect(20, 6,  34, 11, HAIR)
        rect(32, 11, 34, 20, HAIR)
        # Olho
        rect(21, 15, 22, 16, EYE)
        # Corpo
        rect(18, 23, 34, 40, ROBE)
        rect(18, 37, 34, 40, BELT)
        # Espada
        rect(12, 28, 18, 44, SHEATH)
        rect(12, 26, 18, 29, SWORD)
        # Braço frente
        rect(14, 25, 18, 36, ROBE)
        # Pernas
        rect(19, 41, 25, 56 + walk_offset,     ROBE)
        rect(26, 41, 32, 56 - walk_offset,     ROBE)
        rect(18, 55 + walk_offset,  26, 58 + walk_offset,  FOOT)
        rect(25, 55 - walk_offset,  33, 58 - walk_offset,  FOOT)


def create_spritesheet(is_female=False):
    name = "ronin_female" if is_female else "ronin_male"
    total_w = FRAME_W * COLS
    total_h = FRAME_H * ROWS
    sheet = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(sheet)

    directions = ['down', 'up', 'right', 'left']

    for row_idx, direction in enumerate(directions):
        for col_idx in range(COLS):
            ox = col_idx * FRAME_W
            oy = row_idx * FRAME_H
            draw_ronin_frame(draw, ox, oy, direction, col_idx, is_female)

    path = os.path.join(OUTPUT_DIR, f"{name}_sprite.png")
    sheet.save(path, "PNG")
    print(f"Sprite sheet criado: {path} ({total_w}x{total_h}px)")
    return path

print("Criando sprites...")
create_spritesheet(is_female=False)
create_spritesheet(is_female=True)
print("Concluido!")
