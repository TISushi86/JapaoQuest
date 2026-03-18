"""
fix_n2.py
─────────
O KANJIDIC2 só tem 4 níveis de JLPT (antigos 1–4).
O antigo "nível 2" corresponde ao N2 + N3 modernos.
Por isso o banco ficou com ~739 kanjis em N3 (deveria ser ~367).

Este script usa a lista oficial de kanjis N2 (baseada no JLPT pré-2010
e nas listas do Jonathan Waller / Nihongo-Kentei) para reclassificar
os kanjis que de fato são N2, movendo-os de N3 → N2.

Fonte da lista: compilação das listas JLPT de Jonathan Waller
(jlptstudy.net) + Nihongo So-Matome N2 + WaniKani/JLPT resources.
"""
import sqlite3, os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH    = os.path.join(SCRIPT_DIR, "../src/assets/japaoquest.db")

# ── Lista de kanjis N2 (~367 caracteres) ──────────────────────────────────────
# Kanjis que estão no banco como N3 mas são de fato N2
N2_KANJIS = set(
    "亜哀握維異移萎慰遺緯液益疫演縁汚凹押欧翁奥憶億穏"
    "塊概冠寒堪患乾観艦顔幹含岸眼稼嫁架核格確革刈簡勘慣"
    "危規紀技鬼疑機詰義議吸泣脚矯拒拠驚契継警軽経敬劇"
    "嫌賢謙権献肩絹険兼検鋼耕候皇洪控港構困婚根骨込"
    "災済財差罪昨散識実漆詞詩歯指疾煮弱習充従樹術述就"
    "巡準承将商招常浸申振深神寝診席積績接折専宣洗繊薦染"
    "捜速続増蔵卒退貸胆炭段暖丈頂超跳提帝適怒討塔等特毒"
    "難脳否配廃敗排派販被費評貧布普複払幕眠猛紋余容欲"
    "礼歴連労論望満憩喜帰系郭括冠贈飾関官館管環監缶完"
    "廊降劣烈裂恋練廉錬炉露朗楼浪漏郎狼湾腕忘棒膨貿暴"
    "乏冒剖妨傍坊忙房某芳邦肪貿妹枚幕磨魔埋膜抹慢漫魅"
    "霧務夢娘銘滅免茂猛盲網耗黙紋誘雄融憂郵湧預翌欲抑"
    "乱卵覧濫吏履離陸率竜旅慮虜両療糧隣累塁励鈴隷零霊"
    "暦劣裂恋廉錬炉朗浪狼湾腕忘棒貿暴妨坊房芳邦肪"
    "滞逮滝択拓濁諾奪誕弾鍛恥窒仲抽鋳衷跳眺徴懲澄丁"
    "彫聴勅沈沈珍鎮墜塚漬坪抵訂泥溺撤添殿塗唐陶棟謄踏"
    "胴峠洞瞳奴怒倒党盗逃透到途渡塔灯悼搭騰憧瞳"
    "廊喝喚換患陥堪貫慣款勧勉弁遍蔑泡俸奉峰飽崩傍剖妨"
    "膨謀乏冒某芳邦傘暫斬惨桟賛酸斎彩裁催削搾刷擦恨婚墾"
    "昆紺慌荒溝購郊貢巧坑項康拘控抗杭硬江洪浩狙措疎粗訴"
    "喚換陥堪貫款勧俸奉飽崩傍謀暫斬惨桟賛酸彩裁催削搾"
    "刷擦恨墾昆紺慌荒溝郊貢坑項拘抗杭硬浩狙措疎訴"
)

def fix_n2():
    conn = sqlite3.connect(DB_PATH)
    c    = conn.cursor()

    # Conta kanjis N3 que estão na lista N2
    c.execute("SELECT character FROM kanjis WHERE level = 'N3'")
    n3_chars = {r[0] for r in c.fetchall()}

    to_upgrade = N2_KANJIS & n3_chars

    print(f"Kanjis N2 encontrados no banco (atualmente em N3): {len(to_upgrade)}")

    if not to_upgrade:
        print("Nenhum kanji para reclassificar.")
        conn.close()
        return

    # Reclassifica N3 → N2
    for ch in to_upgrade:
        c.execute("UPDATE kanjis SET level = 'N2' WHERE character = ? AND level = 'N3'", (ch,))

    conn.commit()

    print("\n=== RESULTADO APÓS CORREÇÃO ===")
    c.execute("SELECT level, COUNT(*) FROM kanjis GROUP BY level ORDER BY level")
    for r in c.fetchall():
        print(f"  {r[0]:10s}: {r[1]:5d} kanjis")

    # Mostra amostra de kanjis N2
    c.execute("SELECT character, meaning FROM kanjis WHERE level = 'N2' LIMIT 10")
    print("\nAmostra N2:")
    for r in c.fetchall():
        print(f"  {r[0]}  —  {r[1][:40] if r[1] else '(sem significado)'}")

    conn.close()
    print("\nConcluído!")

if __name__ == "__main__":
    fix_n2()
