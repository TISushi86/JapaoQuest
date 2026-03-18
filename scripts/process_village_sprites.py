from PIL import Image, ImageDraw
import numpy as np
import os

ASSETS_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'assets')

# Config dos sprites gerados
MALE_COLS = 8
MALE_ROWS = 4
FEMALE_COLS = 4
FEMALE_ROWS = 4

# Frame final unificado para o jogo
FINAL_COLS = 4
FINAL_ROWS = 4
FINAL_FRAME_W = 80
FINAL_FRAME_H = 96

def remove_white_background(img, threshold=230):
    """Remove fundo branco usando flood fill a partir das bordas."""
    img = img.convert('RGBA')
    data = np.array(img)
    h, w = data.shape[:2]

    # Máscara de pixels "brancos" (R>threshold, G>threshold, B>threshold)
    white_mask = (data[:,:,0] > threshold) & (data[:,:,1] > threshold) & (data[:,:,2] > threshold)

    # Flood fill a partir das bordas
    from collections import deque
    visited = np.zeros((h, w), dtype=bool)
    queue = deque()

    # Adicionar todas as bordas à fila
    for x in range(w):
        if white_mask[0, x]: queue.append((0, x))
        if white_mask[h-1, x]: queue.append((h-1, x))
    for y in range(h):
        if white_mask[y, 0]: queue.append((y, 0))
        if white_mask[y, w-1]: queue.append((y, w-1))

    while queue:
        y, x = queue.popleft()
        if y < 0 or y >= h or x < 0 or x >= w: continue
        if visited[y, x]: continue
        if not white_mask[y, x]: continue
        visited[y, x] = True
        for dy, dx in [(-1,0),(1,0),(0,-1),(0,1)]:
            queue.append((y+dy, x+dx))

    # Tornar pixels visitados transparentes
    data[visited, 3] = 0
    return Image.fromarray(data, 'RGBA')

def extract_frames(img, cols, rows):
    """Extrai todos os frames de um sprite sheet."""
    w, h = img.size
    fw = w // cols
    fh = h // rows
    frames = []
    for row in range(rows):
        row_frames = []
        for col in range(cols):
            x = col * fw
            y = row * fh
            frame = img.crop((x, y, x + fw, y + fh))
            row_frames.append(frame)
        frames.append(row_frames)
    return frames, fw, fh

def fit_frame_in_canvas(frame, target_w, target_h):
    """Escala o frame para caber em target_w x target_h mantendo proporção."""
    frame = frame.convert('RGBA')
    arr = np.array(frame)

    # Encontrar bounding box do conteúdo não-transparente
    alpha = arr[:,:,3]
    rows_with_content = np.any(alpha > 10, axis=1)
    cols_with_content = np.any(alpha > 10, axis=0)

    if not np.any(rows_with_content) or not np.any(cols_with_content):
        # Frame vazio - retornar canvas transparente
        return Image.new('RGBA', (target_w, target_h), (0, 0, 0, 0))

    row_min, row_max = np.where(rows_with_content)[0][[0, -1]]
    col_min, col_max = np.where(cols_with_content)[0][[0, -1]]

    # Adicionar padding
    padding = 4
    row_min = max(0, row_min - padding)
    row_max = min(frame.height - 1, row_max + padding)
    col_min = max(0, col_min - padding)
    col_max = min(frame.width - 1, col_max + padding)

    cropped = frame.crop((col_min, row_min, col_max + 1, row_max + 1))
    cw, ch = cropped.size

    # Escalar mantendo proporção para caber no canvas
    scale = min((target_w - 4) / cw, (target_h - 4) / ch)
    new_w = int(cw * scale)
    new_h = int(ch * scale)
    resized = cropped.resize((new_w, new_h), Image.LANCZOS)

    # Centralizar no canvas
    canvas = Image.new('RGBA', (target_w, target_h), (0, 0, 0, 0))
    offset_x = (target_w - new_w) // 2
    offset_y = (target_h - new_h) // 2
    canvas.paste(resized, (offset_x, offset_y), resized)
    return canvas

def build_spritesheet(all_row_frames, target_cols, target_rows, frame_w, frame_h):
    """Monta um sprite sheet final a partir dos frames processados."""
    sheet = Image.new('RGBA', (target_cols * frame_w, target_rows * frame_h), (0, 0, 0, 0))
    for row_idx in range(target_rows):
        frames_in_row = all_row_frames[row_idx]
        # Pegar apenas target_cols frames (ou menos se não houver)
        for col_idx in range(target_cols):
            if col_idx < len(frames_in_row):
                frame = frames_in_row[col_idx]
            else:
                # Repetir último frame
                frame = frames_in_row[-1]
            fitted = fit_frame_in_canvas(frame, frame_w, frame_h)
            x = col_idx * frame_w
            y = row_idx * frame_h
            sheet.paste(fitted, (x, y), fitted)
    return sheet

def process_male_sprite():
    print("Processando sprite masculino...")
    src = os.path.join(ASSETS_DIR, 'ronin_male_village_style.png')
    img = Image.open(src)

    # Remover fundo branco
    img_no_bg = remove_white_background(img, threshold=220)

    # Extrair frames (8 cols x 4 rows)
    frames, fw, fh = extract_frames(img_no_bg, MALE_COLS, MALE_ROWS)
    print(f"  Male: {MALE_COLS}x{MALE_ROWS} frames de {fw}x{fh}px")

    # Pegar apenas os 4 primeiros frames de cada direção
    cropped_frames = [row[:4] for row in frames]

    # Montar sprite sheet final
    sheet = build_spritesheet(cropped_frames, FINAL_COLS, FINAL_ROWS, FINAL_FRAME_W, FINAL_FRAME_H)

    out = os.path.join(ASSETS_DIR, 'ronin_male_ready.png')
    sheet.save(out)
    print(f"  Salvo: {out} ({sheet.size[0]}x{sheet.size[1]}px)")
    return sheet

def process_female_sprite():
    print("Processando sprite feminino...")
    src = os.path.join(ASSETS_DIR, 'ronin_female_village_style.png')
    img = Image.open(src).convert('RGBA')

    # Extrair frames (4 cols x 4 rows)
    frames, fw, fh = extract_frames(img, FEMALE_COLS, FEMALE_ROWS)
    print(f"  Female: {FEMALE_COLS}x{FEMALE_ROWS} frames de {fw}x{fh}px")

    # Montar sprite sheet final (4 cols x 4 rows)
    sheet = build_spritesheet(frames, FINAL_COLS, FINAL_ROWS, FINAL_FRAME_W, FINAL_FRAME_H)

    out = os.path.join(ASSETS_DIR, 'ronin_female_ready.png')
    sheet.save(out)
    print(f"  Salvo: {out} ({sheet.size[0]}x{sheet.size[1]}px)")
    return sheet

if __name__ == '__main__':
    process_male_sprite()
    process_female_sprite()
    print("\nSprites prontos!")
    print(f"Frame final: {FINAL_FRAME_W}x{FINAL_FRAME_H}px, grid {FINAL_COLS}x{FINAL_ROWS}")
