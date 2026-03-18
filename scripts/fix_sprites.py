from PIL import Image
import os

def clean_spritesheet(input_path, output_path):
    print(f"Processando: {input_path}")
    
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        # 1. Remover Fundo Branco (Tornar Transparente)
        new_data = []
        for item in datas:
            # Se o pixel for muito claro (branco ou quase branco), vira transparente
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)

        img.putdata(new_data)
        
        # 2. Fatiar e Reconstruir (Heurística baseada no layout padrão da IA)
        # A IA geralmente gera 4 linhas com texto em cima.
        # Vamos tentar identificar onde estão os pixels não-transparentes (os bonecos)
        # e criar uma nova grade limpa.
        
        # Para simplificar e garantir que funcione agora, vamos fazer um crop fixo estimado
        # ou redimensionar para garantir que o código React Native funcione.
        
        # Tamanho original da imagem gerada
        W, H = img.size
        print(f"Tamanho Original: {W}x{H}")
        
        # Criar uma nova imagem limpa (4 colunas x 4 linhas)
        # Vamos assumir que cada sprite deve ter ~64x64
        SPRITE_W, SPRITE_H = 64, 64
        new_sheet = Image.new("RGBA", (SPRITE_W * 4, SPRITE_H * 4))
        
        # A imagem da IA geralmente é bagunçada.
        # Vamos tentar apenas salvar a versão transparente primeiro para ver se melhora o visual,
        # mas o ideal seria 'recortar' cada boneco.
        
        # Como não consigo ver a imagem exata pixel a pixel aqui, vou aplicar a transparência
        # e salvar. O usuário vai ver o fundo transparente.
        # Para o "corte", vou pedir para o usuário me confirmar se a grade melhorou
        # ou vou tentar ajustar o Character.js para "adivinhar" melhor.
        
        # Salvar imagem transparente
        img.save(output_path, "PNG")
        print(f"Salvo em: {output_path}")
        
    except Exception as e:
        print(f"Erro: {e}")

# Caminhos
assets_dir = "src/assets"
input_ronin = os.path.join(assets_dir, "7994fd2e-2bc6-4e66-a686-f9435c5bdfc3.png")
output_ronin = os.path.join(assets_dir, "ronin_male_fixed.png")

clean_spritesheet(input_ronin, output_ronin)
