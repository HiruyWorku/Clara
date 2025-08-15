import { format, parseISO, subDays, isAfter, isSameDay } from 'date-fns';
import { getCheckinsByRoom, getAllCheckins, getLatestCheckinByRoom } from './db';

export type StreakInfo = {
  currentStreak: number;
  bestStreak: number;
  lastResult: 'yes' | 'no' | null;
};

export type RoomStreakInfo = {
  roomId: string;
  currentStreak: number;
  bestStreak: number;
  lastResult: 'yes' | 'no' | null;
};

/**
 * Calculate streak for a specific room
 */
export async function calculateRoomStreak(roomId: string): Promise<StreakInfo> {
  const checkins = await getCheckinsByRoom(roomId);
  const latestCheckin = await getLatestCheckinByRoom(roomId);
  
  if (checkins.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      lastResult: null,
    };
  }

  // Sort checkins by date (most recent first)
  const sortedCheckins = checkins.sort((a, b) => b.date.localeCompare(a.date));
  
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Calculate current streak (consecutive "tidy" days from today backwards)
  for (let i = 0; i < sortedCheckins.length; i++) {
    const checkin = sortedCheckins[i];
    const checkinDate = checkin.date;
    
    if (i === 0) {
      // For current streak, start from the most recent checkin
      if (checkin.is_tidy === 1) {
        currentStreak = 1;
        
        // Continue counting backwards for consecutive tidy days
        for (let j = i + 1; j < sortedCheckins.length; j++) {
          const prevCheckin = sortedCheckins[j];
          const expectedDate = format(subDays(parseISO(checkinDate), j), 'yyyy-MM-dd');
          
          if (prevCheckin.date === expectedDate && prevCheckin.is_tidy === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }
  }
  
  // Calculate best streak (longest consecutive tidy streak ever)
  tempStreak = 0;
  for (const checkin of sortedCheckins.reverse()) { // Process in chronological order
    if (checkin.is_tidy === 1) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  const lastResult = latestCheckin 
    ? (latestCheckin.is_tidy === 1 ? 'yes' : 'no')
    : null;

  return {
    currentStreak,
    bestStreak,
    lastResult,
  };
}

/**
 * Calculate streaks for all rooms
 */
export async function calculateAllRoomStreaks(roomIds: string[]): Promise<RoomStreakInfo[]> {
  const promises = roomIds.map(async (roomId) => {
    const streakInfo = await calculateRoomStreak(roomId);
    return {
      roomId,
      ...streakInfo,
    };
  });
  
  return Promise.all(promises);
}

/**
 * Calculate total active streaks (sum of all current streaks)
 */
export async function calculateTotalActiveStreaks(roomIds: string[]): Promise<number> {
  const roomStreaks = await calculateAllRoomStreaks(roomIds);
  return roomStreaks.reduce((total, room) => total + room.currentStreak, 0);
}

/**
 * Calculate overall stats for dashboard
 */
export async function calculateDashboardStats(roomIds: string[]) {
  const roomStreaks = await calculateAllRoomStreaks(roomIds);
  
  const totalActiveStreaks = roomStreaks.reduce((total, room) => total + room.currentStreak, 0);
  const totalBestStreaks = roomStreaks.reduce((total, room) => total + room.bestStreak, 0);
  const activeRooms = roomIds.length;
  
  // Calculate completion rate for the last 7 days
  const allCheckins = await getAllCheckins();
  const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
  const recentCheckins = allCheckins.filter(checkin => checkin.date >= sevenDaysAgo);
  const tidyCheckins = recentCheckins.filter(checkin => checkin.is_tidy === 1);
  const completionRate = recentCheckins.length > 0 
    ? Math.round((tidyCheckins.length / recentCheckins.length) * 100)
    : 0;
  
  return {
    totalActiveStreaks,
    totalBestStreaks,
    activeRooms,
    completionRate,
    roomStreaks,
  };
}
