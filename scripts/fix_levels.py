"""
Script para corrigir os níveis JLPT no banco japaoquest.db.

Problema: o build_db.py usou 'N5' como padrão para todos os kanjis SEM
tag JLPT no KANJIDIC2. Isso resultou em 10.000+ kanjis raros/obscuros
rotulados como N5, quando o N5 real tem apenas ~80 kanjis.

Correção:
  1. Relê o kanjidic2.xml.gz e re-mapeia os níveis corretamente.
  2. Kanjis SEM tag JLPT recebem level = 'unlisted'.
  3. Mapeamento do sistema antigo para o novo:
       Antigo 4 → N5  (~80 kanjis)
       Antigo 3 → N4  (~166 kanjis)
       Antigo 2 → N3  (~739 kanjis)
       Antigo 1 → N1  (~1207 kanjis)
  4. Corrige o separador de meanings: ', ' → '; '
"""

import gzip
import os
import sqlite3

from lxml import etree

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH    = os.path.join(SCRIPT_DIR, "../src/assets/japaoquest.db")
KANJIDIC   = os.path.join(SCRIPT_DIR, "temp/kanjidic2.xml.gz")

LEVEL_MAP = {'4': 'N5', '3': 'N4', '2': 'N3', '1': 'N1'}


def fix_levels():
    print("Conectando ao banco de dados...")
    conn = sqlite3.connect(DB_PATH)
    c    = conn.cursor()

    # ── 1. Marcar tudo como 'unlisted' antes de relabeling ─────────────────
    print("Marcando todos os kanjis como 'unlisted'...")
    c.execute("UPDATE kanjis SET level = 'unlisted'")
    conn.commit()

    # ── 2. Relê o KANJIDIC2 e aplica os níveis corretos ─────────────────────
    print("Relendo kanjidic2.xml.gz...")
    labeled = 0
    total   = 0

    with gzip.open(KANJIDIC, 'rb') as f:
        context = etree.iterparse(f, events=('end',), tag='character')

        for _, elem in context:
            total += 1
            literal = elem.find('literal').text
            misc    = elem.find('misc')

            jlpt_old = None
            if misc is not None:
                jlpt_tag = misc.find('jlpt')
                if jlpt_tag is not None:
                    jlpt_old = jlpt_tag.text

            if jlpt_old is not None:
                level = LEVEL_MAP.get(jlpt_old, 'unlisted')
                c.execute("UPDATE kanjis SET level = ? WHERE character = ?",
                          (level, literal))
                labeled += 1

            elem.clear()
            while elem.getprevious() is not None:
                del elem.getparent()[0]

    conn.commit()

    # ── 3. Corrige o separador de meanings: ', ' → '; ' ─────────────────────
    print("Corrigindo separador de significados...")
    c.execute("""
        UPDATE kanjis
        SET meaning = replace(meaning, ', ', '; ')
        WHERE meaning LIKE '%, %'
    """)
    conn.commit()

    # ── 4. Relatório final ───────────────────────────────────────────────────
    print("\n=== RESULTADO ===")
    c.execute("SELECT level, COUNT(*) FROM kanjis GROUP BY level ORDER BY level")
    for row in c.fetchall():
        print(f"  {row[0]:10s}: {row[1]:5d} kanjis")

    print(f"\nTotal no XML: {total}")
    print(f"Com nível JLPT: {labeled}")
    print(f"Sem nível (unlisted): {total - labeled}")

    conn.close()
    print("\nConcluído! Banco de dados corrigido.")


if __name__ == "__main__":
    fix_levels()
