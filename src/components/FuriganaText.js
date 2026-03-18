import React from 'react';
import { View, Text } from 'react-native';

/**
 * Parseia texto com marcação de furigana no formato {kanji|furigana}.
 * Texto puro (sem marcação) é retornado como segmento do tipo 'text'.
 *
 * Exemplo de entrada: "{私|わたし}は{学生|がくせい}です。"
 */
function parseFurigana(text) {
  const parts = [];
  const regex = /\{([^|{}]+)\|([^|{}]+)\}/g;
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push({ type: 'text', content: text.slice(lastIdx, match.index) });
    }
    parts.push({ type: 'ruby', kanji: match[1], furigana: match[2] });
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIdx) });
  }

  return parts;
}

/**
 * Renderiza texto japonês com furigana (leitura em hiragana) acima de cada kanji.
 *
 * Props:
 *  text          – String com marcação {kanji|furigana} e/ou texto puro
 *  fontSize      – Tamanho da fonte principal (padrão: 22)
 *  color         – Cor do texto principal (padrão: '#ffffff')
 *  furiganaColor – Cor do furigana (padrão: '#90caf9')
 *  highlight     – Texto/partícula a destacar em amarelo (ex.: 'は')
 *  highlightColor – Cor do destaque (padrão: '#ffd700')
 *  style         – Estilo extra para o contêiner externo
 */
export default function FuriganaText({
  text = '',
  fontSize = 22,
  color = '#ffffff',
  furiganaColor = '#90caf9',
  highlight = null,
  highlightColor = '#ffd700',
  style,
}) {
  const parts = parseFurigana(text);
  const furiSize = Math.max(9, Math.round(fontSize * 0.42));

  const renderTextSegment = (content, key) => {
    if (!highlight || !content.includes(highlight)) {
      return (
        <Text key={key} style={{ fontSize, color, lineHeight: fontSize * 1.5 }}>
          {content}
        </Text>
      );
    }
    // Quebra o segmento no ponto de destaque
    const segments = content.split(highlight);
    return (
      <React.Fragment key={key}>
        {segments.map((seg, j) => (
          <React.Fragment key={j}>
            {seg.length > 0 && (
              <Text style={{ fontSize, color, lineHeight: fontSize * 1.5 }}>{seg}</Text>
            )}
            {j < segments.length - 1 && (
              <View style={{ alignItems: 'center' }}>
                {/* espaço reservado para alinhar com o furigana dos outros elementos */}
                <Text style={{ fontSize: furiSize, color: 'transparent', lineHeight: furiSize * 1.3 }}>
                  {'　'}
                </Text>
                <Text style={{ fontSize, color: highlightColor, lineHeight: fontSize * 1.5, fontWeight: 'bold' }}>
                  {highlight}
                </Text>
              </View>
            )}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  };

  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' }, style]}>
      {parts.map((part, i) => {
        if (part.type === 'text') {
          return renderTextSegment(part.content, i);
        }

        // Elemento ruby: furigana acima, kanji abaixo
        const isHighlighted = highlight && part.kanji === highlight;
        return (
          <View key={i} style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
            <Text
              style={{
                fontSize: furiSize,
                color: furiganaColor,
                textAlign: 'center',
                lineHeight: furiSize * 1.4,
                minWidth: fontSize,
              }}
            >
              {part.furigana}
            </Text>
            <Text
              style={{
                fontSize,
                color: isHighlighted ? highlightColor : color,
                lineHeight: fontSize * 1.5,
                fontWeight: isHighlighted ? 'bold' : 'normal',
              }}
            >
              {part.kanji}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
