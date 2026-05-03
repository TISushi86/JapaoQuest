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
 * Renderiza texto japonês com furigana (leitura em hiragana) acima de cada
 * kanji. Suporta múltiplas linhas separadas por `\n` (linhas em branco viram
 * espaço extra entre parágrafos).
 *
 * Cada linha é uma row com flexWrap; o container externo é uma coluna,
 * permitindo que parágrafos fluam verticalmente sem depender da heurística
 * do flexWrap.
 *
 * Props:
 *  text           – String com marcação {kanji|furigana} e/ou texto puro
 *  fontSize       – Tamanho da fonte principal (padrão: 22)
 *  color          – Cor do texto principal (padrão: '#ffffff')
 *  furiganaColor  – Cor do furigana (padrão: '#90caf9')
 *  highlight      – Texto/partícula a destacar em amarelo (ex.: 'は')
 *  highlightColor – Cor do destaque (padrão: '#ffd700')
 *  align          – 'left' | 'center' | 'right' (alinhamento horizontal das linhas)
 *  style          – Estilo extra para o contêiner externo
 */
export default function FuriganaText({
  text = '',
  fontSize = 22,
  color = '#ffffff',
  furiganaColor = '#90caf9',
  highlight = null,
  highlightColor = '#ffd700',
  align = 'left',
  style,
}) {
  const furiSize = Math.max(9, Math.round(fontSize * 0.42));

  // Divide o texto em linhas. Linhas vazias (decorrentes de \n\n) são
  // preservadas como espaçadores verticais para separar parágrafos.
  const lines = String(text).split('\n');

  const renderTextSegment = (content, key) => {
    if (!highlight || !content.includes(highlight)) {
      return (
        <Text key={key} style={{ fontSize, color, lineHeight: fontSize * 1.5 }}>
          {content}
        </Text>
      );
    }
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

  const renderLine = (lineText, lineIdx) => {
    // Linha vazia = espaçamento entre parágrafos
    if (lineText.length === 0) {
      return <View key={`empty-${lineIdx}`} style={{ height: furiSize * 0.8, width: '100%' }} />;
    }
    const parts = parseFurigana(lineText);
    const justify =
      align === 'center' ? 'center' :
      align === 'right'  ? 'flex-end' :
      'flex-start';
    return (
      <View
        key={`line-${lineIdx}`}
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: justify,
          width: '100%',
          marginBottom: 2,
        }}
      >
        {parts.map((part, i) => {
          if (part.type === 'text') {
            return renderTextSegment(part.content, `${lineIdx}-${i}`);
          }
          const isHighlighted = highlight && part.kanji === highlight;
          return (
            <View key={`${lineIdx}-${i}`} style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
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
  };

  return (
    <View style={[{ flexDirection: 'column', alignItems: 'stretch' }, style]}>
      {lines.map((line, i) => renderLine(line, i))}
    </View>
  );
}
