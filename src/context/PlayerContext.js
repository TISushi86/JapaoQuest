import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { loadSave, writeSave, deleteSave, loadPreferences, savePreferences, SAVE_DEFAULTS } from '../utils/saveGame';
import { JLPT_ORDER } from '../utils/jlptLevels';
import { LESSONS } from '../data/lessons';

const XP_TO_NEXT = 100;
const RANKS = ['Aprendiz', 'Ronin', 'Goshis', 'Gokenin', 'Hatamoto', 'Shogun'];

const PlayerContext = createContext(null);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer deve ser usado dentro de PlayerProvider');
  return ctx;
};

export const PlayerProvider = ({ children }) => {
  // ── Estado do jogador ───────────────────────────────────────────────────────
  const [xp,         setXp]         = useState(0);
  const [hp,         setHp]         = useState(3);
  const [maxHp]                     = useState(3);
  const [jlptLevel,  setJlptLevel]  = useState('Iniciante');
  const [totalXp,    setTotalXp]    = useState(0);
  const [rankIndex,  setRankIndex]  = useState(0);
  const [gender,     setGender]     = useState('male');

  // ── Estado de progresso/save ────────────────────────────────────────────────
  const [lastScreen,       setLastScreen]       = useState(null);
  const [kanaPhase,        setKanaPhase]        = useState('lesson_h');
  const [kanaHGroupIdx,    setKanaHGroupIdx]    = useState(0);
  const [kanaKGroupIdx,    setKanaKGroupIdx]    = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [battlesWonByRegion, setBattlesWonByRegion] = useState({});
  const [knowKanaAsked, setKnowKanaAsked] = useState(false);
  const [devMode,           setDevMode]           = useState(false);
  const [conquestMessage,   setConquestMessage]   = useState(null);
  const [hasSave,          setHasSave]          = useState(false);
  const [saveLoaded,       setSaveLoaded]       = useState(false);

  // Ref sempre atualizado com o estado atual — evita closures desatualizadas
  const stateRef = useRef({});
  useEffect(() => {
    stateRef.current = {
      gender, jlptLevel, xp, totalXp, rankIndex, hp,
      lastScreen, kanaPhase, kanaHGroupIdx, kanaKGroupIdx, completedLessons, battlesWonByRegion, devMode, knowKanaAsked,
    };
  }, [gender, jlptLevel, xp, totalXp, rankIndex, hp,
      lastScreen, kanaPhase, kanaHGroupIdx, kanaKGroupIdx, completedLessons, battlesWonByRegion, devMode, knowKanaAsked]);

  // ── Carregar save ao iniciar (prefs → devMode → save correto) ─────────────────
  useEffect(() => {
    (async () => {
      const prefs = await loadPreferences();
      const isDev = prefs.devMode ?? false;
      setDevMode(isDev);
      const save = await loadSave(isDev);
      if (save) {
        setXp(save.xp ?? 0);
        setHp(save.hp ?? 3);
        setTotalXp(save.totalXp ?? 0);
        setRankIndex(save.rankIndex ?? 0);
        setGender(save.gender ?? 'male');
        setJlptLevel(save.jlptLevel ?? (isDev ? 'N1' : 'Iniciante'));
        setLastScreen(save.lastScreen ?? null);
        setKanaPhase(save.kanaPhase ?? (isDev ? 'done' : 'lesson_h'));
        setKanaHGroupIdx(save.kanaHGroupIdx ?? 0);
        setKanaKGroupIdx(save.kanaKGroupIdx ?? 0);
        setCompletedLessons(save.completedLessons ?? []);
        setBattlesWonByRegion(save.battlesWonByRegion ?? {});
        setKnowKanaAsked(save.knowKanaAsked ?? false);
        setHasSave(true);
      }
      setSaveLoaded(true);
    })();
  }, []);

  // ── Salvar progresso (aceita override parcial) — grava no save do modo atual ─
  const saveProgress = useCallback(async (partial = {}) => {
    const isDev = stateRef.current.devMode ?? false;
    const data = { ...stateRef.current, ...partial };

    // Aplica os overrides no estado local também
    if (partial.lastScreen      !== undefined) setLastScreen(partial.lastScreen);
    if (partial.kanaPhase       !== undefined) setKanaPhase(partial.kanaPhase);
    if (partial.kanaHGroupIdx   !== undefined) setKanaHGroupIdx(partial.kanaHGroupIdx);
    if (partial.kanaKGroupIdx   !== undefined) setKanaKGroupIdx(partial.kanaKGroupIdx);
    if (partial.gender          !== undefined) setGender(partial.gender);
    if (partial.jlptLevel       !== undefined) setJlptLevel(partial.jlptLevel);
    if (partial.completedLessons !== undefined) setCompletedLessons(partial.completedLessons);
    if (partial.battlesWonByRegion !== undefined) setBattlesWonByRegion(partial.battlesWonByRegion);
    if (partial.knowKanaAsked !== undefined) setKnowKanaAsked(partial.knowKanaAsked);

    await writeSave(data, isDev);
    setHasSave(true);
  }, []);

  // ── Resetar progresso (nova jornada) — apaga save da história e volta ao modo história ─
  const resetProgress = useCallback(async () => {
    await deleteSave(false);
    await savePreferences({ devMode: false });
    setDevMode(false);
    const d = SAVE_DEFAULTS;
    setXp(d.xp);
    setHp(d.hp);
    setTotalXp(d.totalXp);
    setRankIndex(d.rankIndex);
    setGender(d.gender);
    setJlptLevel(d.jlptLevel);
    setLastScreen(d.lastScreen);
    setKanaPhase(d.kanaPhase);
    setKanaHGroupIdx(d.kanaHGroupIdx);
    setKanaKGroupIdx(d.kanaKGroupIdx);
    setCompletedLessons(d.completedLessons);
    setBattlesWonByRegion(d.battlesWonByRegion ?? {});
    setKnowKanaAsked(d.knowKanaAsked ?? false);
    setConquestMessage(null);
    setHasSave(false);
  }, []);

  // ── Completar lição ─────────────────────────────────────────────────────────
  const completeLesson = useCallback(async (lessonId) => {
    const current = stateRef.current.completedLessons ?? [];
    if (current.includes(lessonId)) return;
    const updated = [...current, lessonId];
    setCompletedLessons(updated);
        await writeSave({ ...stateRef.current, completedLessons: updated }, stateRef.current.devMode ?? false);
    setHasSave(true);
    checkAndAdvanceJlptLevel(updated, stateRef.current.battlesWonByRegion ?? {}, stateRef.current.jlptLevel);
  }, []);

  // ── Verifica se o jogador pode avançar de nível JLPT ─────────────────────────
  // Para desbloquear o próximo nível: completar TODAS as lições do nível ATUAL.
  // N5+ também exige 1 vitória na batalha da região.
  const checkAndAdvanceJlptLevel = useCallback((completed, battles, currentLevel) => {
    const levelIdx = JLPT_ORDER.indexOf(currentLevel);
    if (levelIdx < 0 || levelIdx >= JLPT_ORDER.length - 1) return;
    const nextLevel = JLPT_ORDER[levelIdx + 1];
    const lessonsForCurrent = LESSONS.filter(l => l.jlptLevel === currentLevel);
    const allCurrentLessonsDone = lessonsForCurrent.length > 0 && lessonsForCurrent.every(l => completed?.includes(l.id));
    const battlesWon = currentLevel === 'Iniciante' ? true : (battles[currentLevel] ?? 0) >= 1;
    const canAdvance = currentLevel === 'Iniciante'
      ? allCurrentLessonsDone
      : (allCurrentLessonsDone && battlesWon);
    if (canAdvance) {
      setJlptLevel(nextLevel);
      writeSave({ ...stateRef.current, jlptLevel: nextLevel }, stateRef.current.devMode ?? false);
      setHasSave(true);
      setConquestMessage(`level_unlocked:${nextLevel}`);
    }
  }, []);

  // ── Registrar vitória em batalha (modo história) ────────────────────────────
  const recordBattleVictory = useCallback(async (regionLevel) => {
    if (!regionLevel || !['N5','N4','N3','N2','N1'].includes(regionLevel)) return;
    const current = stateRef.current.battlesWonByRegion ?? {};
    const updated = { ...current, [regionLevel]: (current[regionLevel] ?? 0) + 1 };
    setBattlesWonByRegion(updated);
    await writeSave({ ...stateRef.current, battlesWonByRegion: updated }, stateRef.current.devMode ?? false);
    setHasSave(true);
    checkAndAdvanceJlptLevel(stateRef.current.completedLessons ?? [], updated, stateRef.current.jlptLevel);
  }, [checkAndAdvanceJlptLevel]);

  // ── Ganhar XP ────────────────────────────────────────────────────────────────
  // onRankUp(newRank) é chamado após ganhar XP — newRank quando sobe de rank, null quando não
  const gainXP = useCallback((amount, onRankUp) => {
    setXp(prev => {
      const newXp = prev + amount;
      setTotalXp(t => {
        const newTotal = t + amount;
        setRankIndex(r => {
          const newRank = newXp >= XP_TO_NEXT ? Math.min(r + 1, RANKS.length - 1) : r;
          const rankedUp = newXp >= XP_TO_NEXT && r < RANKS.length - 1;
          if (typeof onRankUp === 'function') {
            setTimeout(() => onRankUp(rankedUp ? RANKS[newRank] : null), 0);
          }
          // Auto-save após ganhar XP
          writeSave({ ...stateRef.current, xp: newXp >= XP_TO_NEXT ? newXp - XP_TO_NEXT : newXp, totalXp: newTotal, rankIndex: newRank }, stateRef.current.devMode ?? false);
          return newRank;
        });
        return newTotal;
      });
      if (newXp >= XP_TO_NEXT) return newXp - XP_TO_NEXT;
      return newXp;
    });
  }, []);

  const loseHP = useCallback((amount = 1) => {
    setHp(prev => Math.max(0, prev - amount));
  }, []);

  const restoreHP = useCallback(() => {
    setHp(3);
  }, []);

  /** Alterna modo desenvolvedor — salva em prefs e recarrega o save correspondente */
  const toggleDevMode = useCallback(async (newDevMode) => {
    await savePreferences({ devMode: newDevMode });
    setDevMode(newDevMode);
    const save = await loadSave(newDevMode);
    if (save) {
      setXp(save.xp ?? 0);
      setHp(save.hp ?? 3);
      setTotalXp(save.totalXp ?? 0);
      setRankIndex(save.rankIndex ?? 0);
      setGender(save.gender ?? 'male');
      setJlptLevel(save.jlptLevel ?? (newDevMode ? 'N1' : 'Iniciante'));
      setLastScreen(save.lastScreen ?? null);
      setKanaPhase(save.kanaPhase ?? (newDevMode ? 'done' : 'lesson_h'));
      setKanaHGroupIdx(save.kanaHGroupIdx ?? 0);
      setKanaKGroupIdx(save.kanaKGroupIdx ?? 0);
      setCompletedLessons(save.completedLessons ?? []);
      setBattlesWonByRegion(save.battlesWonByRegion ?? {});
      setKnowKanaAsked(save.knowKanaAsked ?? false);
      setHasSave(true);
    } else {
      setXp(0);
      setHp(3);
      setTotalXp(0);
      setRankIndex(0);
      setJlptLevel(newDevMode ? 'N1' : 'Iniciante');
      setLastScreen(newDevMode ? 'Map' : null);
      setKanaPhase(newDevMode ? 'done' : 'lesson_h');
      setKanaHGroupIdx(0);
      setKanaKGroupIdx(0);
      setCompletedLessons([]);
      setBattlesWonByRegion({});
      setKnowKanaAsked(false);
      setHasSave(false);
    }
    setConquestMessage(null);
  }, []);

  const xpPercent = Math.min((xp / XP_TO_NEXT) * 100, 100);

  return (
    <PlayerContext.Provider value={{
      // Estatísticas
      xp, hp, maxHp, jlptLevel, totalXp,
      rank: RANKS[rankIndex],
      rankIndex,
      xpPercent,
      // Personagem
      gender, setGender,
      // Progresso / save
      lastScreen,
      kanaPhase,
      kanaHGroupIdx,
      kanaKGroupIdx,
      completedLessons,
      knowKanaAsked,
      devMode,
      conquestMessage,
      clearConquest: () => setConquestMessage(null),
      hasSave,
      saveLoaded,
      // Ações
      gainXP, loseHP, restoreHP, setJlptLevel,
      saveProgress,
      resetProgress,
      toggleDevMode,
      completeLesson,
      recordBattleVictory,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
