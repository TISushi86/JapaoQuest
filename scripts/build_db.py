import os
import gzip
import requests
import sqlite3
import xml.etree.ElementTree as ET
from lxml import etree

# URLs
JMDICT_URL = "http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz"
KANJIDIC_URL = "http://ftp.edrdg.org/pub/Nihongo/kanjidic2.xml.gz"

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(SCRIPT_DIR, "../src/assets/japaoquest.db")
TEMP_DIR = os.path.join(SCRIPT_DIR, "temp")

def download_file(url, dest_path):
    if os.path.exists(dest_path):
        print(f"Arquivo já existe: {dest_path}")
        return
    
    print(f"Baixando {url}...")
    response = requests.get(url, stream=True)
    with open(dest_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                f.write(chunk)
    print("Download concluído.")

def create_database():
    print("Criando banco de dados...")
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    # Tabela de Palavras
    c.execute('''CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kanji TEXT,
        kana TEXT,
        gloss TEXT,
        level TEXT
    )''')
    
    # Tabela de Kanji
    c.execute('''CREATE TABLE IF NOT EXISTS kanjis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character TEXT UNIQUE,
        stroke_count INTEGER,
        meaning TEXT,
        onyomi TEXT,
        kunyomi TEXT,
        level TEXT
    )''')
    
    conn.commit()
    return conn

def parse_jmdict(file_path, conn):
    print("Processando JMdict (Isso pode demorar)...")
    c = conn.cursor()
    
    # Usando iterparse para economizar memória
    # JMdict é grande (>100MB xml)
    
    # Mapeamento simples de prioridade para JLPT (aproximado se não tiver tag)
    # Na verdade, vamos pegar tudo e filtrar depois ou pegar as tags <re_pri>
    
    count = 0
    
    try:
        with gzip.open(file_path, 'rb') as f:
            context = etree.iterparse(f, events=('end',), tag='entry')
            
            for event, elem in context:
                # Extrair dados básicos
                
                # Kanji (k_ele)
                k_ele = elem.find('k_ele')
                kanji = k_ele.find('keb').text if k_ele is not None else ""
                
                # Kana (r_ele)
                r_ele = elem.find('r_ele')
                kana = r_ele.find('reb').text if r_ele is not None else ""
                
                if not kanji:
                    kanji = kana # Se não tem kanji, usa o kana
                
                # Significado (sense) -> gloss
                glosses = []
                for sense in elem.findall('sense'):
                    for gloss in sense.findall('gloss'):
                        glosses.append(gloss.text)
                    break # Pega apenas o primeiro sentido para economizar espaço no MVP
                
                gloss_text = ", ".join(glosses)
                
                # Tentar achar JLPT (muito raro no JMdict atual, mas vamos tentar)
                # Ou usar news1/ichi1 como proxy de N1/N2/N3
                level = "N5" # Default placeholder para MVP
                
                # Inserir
                c.execute("INSERT INTO words (kanji, kana, gloss, level) VALUES (?, ?, ?, ?)",
                          (kanji, kana, gloss_text, level))
                
                count += 1
                if count % 10000 == 0:
                    print(f"Processadas {count} palavras...")
                    conn.commit()
                
                # Limpar elemento da memória
                elem.clear()
                while elem.getprevious() is not None:
                    del elem.getparent()[0]
                    
    except Exception as e:
        print(f"Erro ao processar JMdict: {e}")

    conn.commit()
    print(f"Total palavras: {count}")

def parse_kanjidic(file_path, conn):
    print("Processando Kanjidic...")
    c = conn.cursor()
    
    count = 0
    try:
        with gzip.open(file_path, 'rb') as f:
            context = etree.iterparse(f, events=('end',), tag='character')
            
            for event, elem in context:
                literal = elem.find('literal').text
                
                # Strokes
                misc = elem.find('misc')
                stroke_count = 0
                if misc is not None:
                    sc = misc.find('stroke_count')
                    if sc is not None:
                        stroke_count = int(sc.text)
                
                # Readings
                reading_meaning = elem.find('reading_meaning')
                onyomi = []
                kunyomi = []
                meanings = []
                
                if reading_meaning is not None:
                    rmgroup = reading_meaning.find('rmgroup')
                    if rmgroup is not None:
                        for reading in rmgroup.findall('reading'):
                            r_type = reading.get('r_type')
                            if r_type == 'ja_on':
                                onyomi.append(reading.text)
                            elif r_type == 'ja_kun':
                                kunyomi.append(reading.text)
                        
                        for meaning in rmgroup.findall('meaning'):
                            if meaning.get('m_lang') is None: # English default
                                meanings.append(meaning.text)
                
                # JLPT Level (Kanjidic tem isso!)
                # Mas note que Kanjidic usa niveis antigos (1-4). 
                # Vamos mapear: 4->N5, 3->N4, 2->N3/N2, 1->N1
                jlpt_old = ""
                if misc is not None:
                    jlpt_tag = misc.find('jlpt')
                    if jlpt_tag is not None:
                        jlpt_old = jlpt_tag.text
                
                level = "N5" # Default
                if jlpt_old == '4': level = "N5"
                elif jlpt_old == '3': level = "N4"
                elif jlpt_old == '2': level = "N3" # Aproximacao
                elif jlpt_old == '1': level = "N1"
                
                c.execute("INSERT INTO kanjis (character, stroke_count, meaning, onyomi, kunyomi, level) VALUES (?, ?, ?, ?, ?, ?)",
                          (literal, stroke_count, ", ".join(meanings), ", ".join(onyomi), ", ".join(kunyomi), level))
                
                count += 1
                if count % 1000 == 0:
                    print(f"Processados {count} kanjis...")
                
                elem.clear()
                while elem.getprevious() is not None:
                    del elem.getparent()[0]

    except Exception as e:
        print(f"Erro ao processar Kanjidic: {e}")

    conn.commit()
    print(f"Total Kanjis: {count}")

def main():
    if not os.path.exists(TEMP_DIR):
        os.makedirs(TEMP_DIR)
        
    jmdict_path = os.path.join(TEMP_DIR, "JMdict_e.gz")
    kanjidic_path = os.path.join(TEMP_DIR, "kanjidic2.xml.gz")
    
    download_file(JMDICT_URL, jmdict_path)
    download_file(KANJIDIC_URL, kanjidic_path)
    
    conn = create_database()
    
    parse_kanjidic(kanjidic_path, conn)
    parse_jmdict(jmdict_path, conn)
    
    conn.close()
    print("✅ Banco de dados gerado com sucesso!")

if __name__ == "__main__":
    main()
