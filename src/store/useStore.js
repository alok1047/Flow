import { create } from 'zustand';

const loadState = () => {
  try {
    const saved = localStorage.getItem('flow-state');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveState = (state) => {
  try {
    const toSave = {
      xp: state.xp,
      level: state.level,
      progress: state.progress,
      completedLessons: state.completedLessons,
      completedChallenges: state.completedChallenges,
      unlockedAchievements: state.unlockedAchievements,
      streak: state.streak,
      lastVisit: state.lastVisit,
      lessonStars: state.lessonStars,
    };
    localStorage.setItem('flow-state', JSON.stringify(toSave));
  } catch {
    // localStorage might be full or disabled
  }
};

const defaults = {
  xp: 0,
  level: 1,
  progress: {
    javascript: { lessons: 0, history: 0, playground: 0, challenges: 0 },
    react: { lessons: 0, history: 0, playground: 0, challenges: 0 },
    backend: { lessons: 0, history: 0, playground: 0, challenges: 0 },
    'system-design': { lessons: 0, history: 0, playground: 0, challenges: 0 },
    cloud: { lessons: 0, history: 0, playground: 0, challenges: 0 },
  },
  completedLessons: [],
  completedChallenges: [],
  unlockedAchievements: [],
  streak: 0,
  lastVisit: null,
  lessonStars: {},
};

const saved = loadState() || {};
if (saved.completedLessons && !saved.lessonStars) {
  saved.lessonStars = {};
  saved.completedLessons.forEach((lessonId) => {
    saved.lessonStars[lessonId] = { stars: 1, bestScore: 1, attempts: 1 };
  });
}

export const useStore = create((set, get) => ({
  // --- State ---
  ...defaults,
  ...saved,

  // --- Settings ---
  soundEnabled: true,
  showParticles: true,
  isLoading: true,

  // --- Actions ---
  addXP: (amount) => {
    set((state) => {
      const newXP = state.xp + amount;
      const newLevel = Math.floor(newXP / 500) + 1;
      const newState = { xp: newXP, level: newLevel };
      setTimeout(() => saveState({ ...state, ...newState }), 0);
      return newState;
    });
  },

  completeLesson: (lessonId) => {
    set((state) => {
      if (state.completedLessons.includes(lessonId)) return {};
      const newCompleted = [...state.completedLessons, lessonId];
      const newState = { completedLessons: newCompleted };
      setTimeout(() => saveState({ ...state, ...newState }), 0);
      return newState;
    });
  },

  updateLessonStars: (lessonId, stars, score) => {
    set((state) => {
      const current = state.lessonStars[lessonId] || { stars: 0, bestScore: 0, attempts: 0 };
      const newStars = Math.max(current.stars, stars);
      const newBestScore = Math.max(current.bestScore, score);
      const newAttempts = current.attempts + 1;
      
      const newLessonStars = {
        ...state.lessonStars,
        [lessonId]: {
          stars: newStars,
          bestScore: newBestScore,
          attempts: newAttempts,
          lastAttempt: Date.now(),
        }
      };

      // Mark as completed if stars >= 1, and add to completedLessons if not there
      let newCompleted = state.completedLessons;
      if (stars >= 1 && !state.completedLessons.includes(lessonId)) {
        newCompleted = [...state.completedLessons, lessonId];
      }

      const newState = {
        lessonStars: newLessonStars,
        completedLessons: newCompleted,
      };

      setTimeout(() => saveState({ ...state, ...newState }), 0);
      return newState;
    });
  },

  completeChallenge: (challengeId) => {
    set((state) => {
      if (state.completedChallenges.includes(challengeId)) return {};
      const newCompleted = [...state.completedChallenges, challengeId];
      const newState = { completedChallenges: newCompleted };
      setTimeout(() => saveState({ ...state, ...newState }), 0);
      return newState;
    });
  },

  unlockAchievement: (achievementId) => {
    set((state) => {
      if (state.unlockedAchievements.includes(achievementId)) return {};
      const newUnlocked = [...state.unlockedAchievements, achievementId];
      const newState = { unlockedAchievements: newUnlocked };
      setTimeout(() => saveState({ ...state, ...newState }), 0);
      return newState;
    });
  },

  updateProgress: (world, category, value) => {
    set((state) => {
      const newProgress = {
        ...state.progress,
        [world]: { ...state.progress[world], [category]: value },
      };
      const newState = { progress: newProgress };
      setTimeout(() => saveState({ ...state, ...newState }), 0);
      return newState;
    });
  },

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleParticles: () => set((state) => ({ showParticles: !state.showParticles })),
  setLoading: (isLoading) => set({ isLoading }),

  updateStreak: () => {
    set((state) => {
      const today = new Date().toDateString();
      if (state.lastVisit === today) return {};
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = state.lastVisit === yesterday ? state.streak + 1 : 1;
      const newState = { streak: newStreak, lastVisit: today };
      setTimeout(() => saveState({ ...state, ...newState }), 0);
      return newState;
    });
  },
}));
