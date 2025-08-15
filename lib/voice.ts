import * as Speech from 'expo-speech';
import Constants from 'expo-constants';

export async function speak(text: string): Promise<void> {
  return new Promise((resolve) => {
    Speech.speak(text, {
      onDone: resolve,
      onStopped: resolve,
      onError: () => resolve(),
    });
  });
}

export async function listenOnce(): Promise<{ intent?: 'yes' | 'no'; freeText?: string } | null> {
  // In Expo Go, native STT modules are unavailable. Gracefully fall back.
  if (Constants.appOwnership === 'expo') return null;
  try {
    const Voice = require('react-native-voice');
    return await new Promise((resolve) => {
      let resolved = false;
      const cleanup = () => {
        Voice.destroy().catch(() => undefined);
        Voice.removeAllListeners?.();
      };

      Voice.onSpeechResults = (e: any) => {
        if (resolved) return;
        const values: string[] = e?.value ?? [];
        const text = (values[0] || '').toLowerCase();
        let intent: 'yes' | 'no' | undefined;
        if (/(^|\b)(yes|yeah|yep|yup|sure|affirmative)($|\b)/.test(text)) intent = 'yes';
        if (/(^|\b)(no|nope|nah|negative)($|\b)/.test(text)) intent = 'no';
        resolved = true;
        cleanup();
        resolve({ intent, freeText: text });
      };

      Voice.onSpeechError = () => {
        if (resolved) return;
        resolved = true;
        cleanup();
        resolve(null);
      };

      Voice.start('en-US').catch(() => {
        resolved = true;
        cleanup();
        resolve(null);
      });
    });
  } catch {
    return null;
  }
}


