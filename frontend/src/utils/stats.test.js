import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  totalMinutes,
  formatDuration,
  groupByDay,
  groupByActivity,
  buildConsistencyData,
  calculateStreak,
  sessionsThisWeek,
} from "./stats";


// Petit constructeur de session : évite de répéter les champs inutiles
// et rend chaque test lisible d'un coup d'œil.
function session({ date, duration = 30, activity = "reading" }) {
  return {
    session_date: `${date}T10:00:00.000Z`,
    duration,
    activity,
  };
}

// On fige la date du jour : sans ça, les tests de streak et de grille
// donneraient des résultats différents chaque jour.
const TODAY = "2026-07-15";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(`${TODAY}T12:00:00.000Z`));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("totalMinutes", () => {
  it("additionne les durées", () => {
    const sessions = [
      session({ date: "2026-07-15", duration: 30 }),
      session({ date: "2026-07-14", duration: 45 }),
    ];
    expect(totalMinutes(sessions)).toBe(75);
  });

  it("renvoie 0 pour une liste vide", () => {
    expect(totalMinutes([])).toBe(0);
  });
});

describe("formatDuration", () => {
  it("affiche les minutes seules sous une heure", () => {
    expect(formatDuration(45)).toBe("45m");
  });

  it("affiche heures et minutes", () => {
    expect(formatDuration(90)).toBe("1h 30m");
  });

  it("omet les minutes quand elles sont nulles", () => {
    expect(formatDuration(120)).toBe("2h");
  });

  it("gère zéro", () => {
    expect(formatDuration(0)).toBe("0m");
  });
});

describe("groupByDay", () => {
  it("renvoie toujours 7 jours", () => {
    expect(groupByDay([]).length).toBe(7);
  });

  it("met les jours sans session à zéro", () => {
    const result = groupByDay([]);
    expect(result.every((d) => d.minutes === 0)).toBe(true);
  });

  it("place les minutes sur le bon jour", () => {
    const sessions = [session({ date: TODAY, duration: 60 })];
    const result = groupByDay(sessions);
    // le dernier élément correspond à aujourd'hui
    expect(result[6].minutes).toBe(60);
  });

  it("additionne plusieurs sessions du même jour", () => {
    const sessions = [
      session({ date: TODAY, duration: 30 }),
      session({ date: TODAY, duration: 45 }),
    ];
    expect(groupByDay(sessions)[6].minutes).toBe(75);
  });

  it("ignore les sessions hors de la fenêtre de 7 jours", () => {
    const sessions = [session({ date: "2026-06-01", duration: 120 })];
    const result = groupByDay(sessions);
    expect(result.every((d) => d.minutes === 0)).toBe(true);
  });
});

describe("groupByActivity", () => {
  it("regroupe et traduit les activités", () => {
    const sessions = [
      session({ date: TODAY, duration: 30, activity: "reading" }),
      session({ date: TODAY, duration: 20, activity: "reading" }),
      session({ date: TODAY, duration: 60, activity: "listening" }),
    ];
    const result = groupByActivity(sessions);

    expect(result).toEqual([
      { activite: "Écoute", minutes: 60 },
      { activite: "Lecture", minutes: 50 },
    ]);
  });

  it("trie du plus grand au plus petit", () => {
    const sessions = [
      session({ date: TODAY, duration: 10, activity: "writing" }),
      session({ date: TODAY, duration: 90, activity: "speaking" }),
      session({ date: TODAY, duration: 50, activity: "review" }),
    ];
    const minutes = groupByActivity(sessions).map((a) => a.minutes);
    expect(minutes).toEqual([90, 50, 10]);
  });

  it("conserve la valeur brute d'une activité inconnue", () => {
    const sessions = [session({ date: TODAY, activity: "singing" })];
    expect(groupByActivity(sessions)[0].activite).toBe("singing");
  });

  it("renvoie un tableau vide sans session", () => {
    expect(groupByActivity([])).toEqual([]);
  });
});

describe("buildConsistencyData", () => {
  it("renvoie 84 jours par défaut", () => {
    expect(buildConsistencyData([]).length).toBe(84);
  });

  it("inclut tous les jours, même vides", () => {
    // c'est ce qui garantit l'alignement des colonnes dans la grille
    const result = buildConsistencyData([], 7);
    expect(result.length).toBe(7);
    expect(result.every((d) => d.minutes === 0)).toBe(true);
  });

  it("ordonne du plus ancien au plus récent", () => {
    const result = buildConsistencyData([], 3);
    expect(result[0].date).toBe("2026-07-13");
    expect(result[2].date).toBe(TODAY);
  });

  it("cumule les minutes d'un même jour", () => {
    const sessions = [
      session({ date: TODAY, duration: 25 }),
      session({ date: TODAY, duration: 35 }),
    ];
    const result = buildConsistencyData(sessions, 3);
    expect(result[2].minutes).toBe(60);
  });
});

describe("calculateStreak", () => {
  it("renvoie 0 sans session", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it("compte 1 pour une session aujourd'hui seulement", () => {
    expect(calculateStreak([session({ date: TODAY })])).toBe(1);
  });

  it("compte les jours consécutifs jusqu'à aujourd'hui", () => {
    const sessions = [
      session({ date: "2026-07-15" }),
      session({ date: "2026-07-14" }),
      session({ date: "2026-07-13" }),
    ];
    expect(calculateStreak(sessions)).toBe(3);
  });

  it("reste valide si la dernière session date d'hier", () => {
    // la série n'est pas cassée tant que la journée n'est pas finie
    const sessions = [
      session({ date: "2026-07-14" }),
      session({ date: "2026-07-13" }),
    ];
    expect(calculateStreak(sessions)).toBe(2);
  });

  it("renvoie 0 si la dernière session date d'avant-hier", () => {
    const sessions = [session({ date: "2026-07-13" })];
    expect(calculateStreak(sessions)).toBe(0);
  });

  it("s'arrête au premier jour manquant", () => {
    const sessions = [
      session({ date: "2026-07-15" }),
      session({ date: "2026-07-14" }),
      // 13 juillet manquant
      session({ date: "2026-07-12" }),
      session({ date: "2026-07-11" }),
    ];
    expect(calculateStreak(sessions)).toBe(2);
  });

  it("ne compte qu'une fois plusieurs sessions du même jour", () => {
    const sessions = [
      session({ date: TODAY, duration: 30 }),
      session({ date: TODAY, duration: 60 }),
      session({ date: "2026-07-14" }),
    ];
    expect(calculateStreak(sessions)).toBe(2);
  });

  it("ignore l'ordre des sessions dans la liste", () => {
    const sessions = [
      session({ date: "2026-07-13" }),
      session({ date: "2026-07-15" }),
      session({ date: "2026-07-14" }),
    ];
    expect(calculateStreak(sessions)).toBe(3);
  });
});

describe("sessionsThisWeek", () => {
  it("garde les sessions des 7 derniers jours", () => {
    const sessions = [
      session({ date: TODAY }),
      session({ date: "2026-07-10" }),
      session({ date: "2026-06-20" }),
    ];
    expect(sessionsThisWeek(sessions).length).toBe(2);
  });

  it("renvoie un tableau vide sans session récente", () => {
    const sessions = [session({ date: "2026-01-01" })];
    expect(sessionsThisWeek(sessions)).toEqual([]);
  });
});