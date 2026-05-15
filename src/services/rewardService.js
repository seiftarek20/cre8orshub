import { requireSupabaseClient } from '../lib/supabaseClient.js';
import { CACHE_TTL, getCachedData, makeCacheKey } from '../utils/cache.js';

const REWARD_CACHE_PREFIX = 'rewards:';

function normalizeBadge(studentBadge) {
  const badge = Array.isArray(studentBadge.badges) ? studentBadge.badges[0] : studentBadge.badges;

  return {
    title: badge?.title || 'Creator Badge',
    detail: badge?.description || badge?.criteria || 'Unlocked through your creative progress.',
    state: 'Unlocked',
  };
}

function normalizeActivity(point) {
  const amount = point.points > 0 ? `+${point.points}` : point.points;
  return {
    title: point.note || `${point.source_type || 'Reward'} points`,
    points: `${amount} pts`,
    date: point.created_at ? new Date(point.created_at).toLocaleDateString() : 'Recent',
  };
}

export async function getStudentRewards(userId) {
  if (!userId) {
    return {
      points: [],
      badges: [],
      activity: [],
      totalPoints: 0,
    };
  }

  return getCachedData(makeCacheKey(REWARD_CACHE_PREFIX, userId), CACHE_TTL.standard, async () => {
    const supabase = requireSupabaseClient();

    const [pointsResponse, badgesResponse] = await Promise.all([
      supabase
        .from('reward_points')
        .select('id, points, note, source_type, created_at')
        .eq('student_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('student_badges')
        .select(`
          id,
          awarded_at,
          badges (
            title,
            description,
            criteria
          )
        `)
        .eq('student_id', userId)
        .order('awarded_at', { ascending: false }),
    ]);

    if (pointsResponse.error) throw pointsResponse.error;
    if (badgesResponse.error) throw badgesResponse.error;

    const points = pointsResponse.data || [];
    const badges = (badgesResponse.data || []).map(normalizeBadge);

    return {
      points,
      badges,
      activity: points.slice(0, 4).map(normalizeActivity),
      totalPoints: points.reduce((total, point) => total + (point.points || 0), 0),
    };
  });
}
