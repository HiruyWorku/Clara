import { differenceInCalendarDays, parseISO } from 'date-fns';

export type SimpleCheckin = { date: string; isTidy: boolean; reason?: string | null };

export function computeStreaks(checkins: SimpleCheckin[]): { current: number; best: number } {
  const sorted = [...checkins].sort((a, b) => (a.date < b.date ? -1 : 1));
  let best = 0;
  let cur = 0;
  let lastDate: Date | null = null;
  for (const c of sorted) {
    if (!c.isTidy) {
      best = Math.max(best, cur);
      cur = 0;
      lastDate = parseISO(c.date);
      continue;
    }
    const d = parseISO(c.date);
    if (lastDate) {
      const gap = differenceInCalendarDays(d, lastDate);
      if (gap === 1) {
        cur += 1;
      } else if (gap > 1) {
        best = Math.max(best, cur);
        cur = 1; // new streak starting at this day
      }
    } else {
      cur = c.isTidy ? 1 : 0;
    }
    best = Math.max(best, cur);
    lastDate = d;
  }
  return { current: cur, best };
}

export function summarizeReasons(checkins: SimpleCheckin[]): { reason: string; count: number }[] {
  const tally: Record<string, number> = {};
  for (const c of checkins) {
    if (!c.isTidy && c.reason) {
      const key = c.reason.trim().toLowerCase();
      tally[key] = (tally[key] ?? 0) + 1;
    }
  }
  return Object.entries(tally)
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count);
}

export function generateNudges(history: { roomName: string; trend7: number; currentStreak: number; topReason?: string }[]): string[] {
  const messages: string[] = [];
  for (const h of history) {
    if (h.currentStreak >= 3) {
      messages.push(`You’ve kept ${h.roomName} tidy ${h.currentStreak} days straight—nice momentum!`);
    }
    if (h.trend7 >= 5 && h.currentStreak < 3) {
      messages.push(`Strong week in ${h.roomName}. Let’s lock in a streak today.`);
    }
    if (h.topReason) {
      messages.push(`Last time in ${h.roomName} you said “${h.topReason}.” What would make it easier today?`);
    }
    if (messages.length === 0) {
      messages.push(`Quick tidy in ${h.roomName}? Two minutes counts.`);
    }
  }
  return messages;
}


