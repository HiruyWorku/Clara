import { computeStreaks, summarizeReasons, generateNudges } from '../lib/insights';

function assertEqual(actual: any, expected: any, message: string) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    console.error('FAIL:', message, '\n expected:', expected, '\n actual:', actual);
    process.exit(1);
  } else {
    console.log('OK:', message);
  }
}

// computeStreaks
{
  const res = computeStreaks([
    { date: '2025-01-01', isTidy: true },
    { date: '2025-01-02', isTidy: true },
    { date: '2025-01-03', isTidy: false },
    { date: '2025-01-04', isTidy: true },
    { date: '2025-01-05', isTidy: true },
  ]);
  assertEqual(res, { current: 2, best: 2 }, 'computeStreaks basic');
}

// summarizeReasons
{
  const res = summarizeReasons([
    { date: '2025-01-01', isTidy: false, reason: 'Busy day' },
    { date: '2025-01-02', isTidy: false, reason: 'busy day' },
    { date: '2025-01-03', isTidy: true },
  ]);
  assertEqual(res[0], { reason: 'busy day', count: 2 }, 'summarizeReasons tally');
}

// generateNudges
{
  const res = generateNudges([
    { roomName: 'Kitchen', trend7: 5, currentStreak: 4, topReason: 'busy day' },
  ]);
  if (!res.some((m) => m.includes('Kitchen'))) {
    console.error('FAIL: generateNudges should mention room');
    process.exit(1);
  } else {
    console.log('OK: generateNudges basic');
  }
}

console.log('All tests passed');


