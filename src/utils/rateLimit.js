const actionCooldowns = new Map();

function formatRemainingTime(milliseconds) {
  const seconds = Math.max(Math.ceil(milliseconds / 1000), 1);
  return `${seconds} second${seconds === 1 ? '' : 's'}`;
}

export function checkRateLimit(actionKey, cooldownMs) {
  const now = Date.now();
  const availableAt = actionCooldowns.get(actionKey) || 0;

  if (availableAt > now) {
    const remainingMs = availableAt - now;
    return {
      allowed: false,
      remainingMs,
      message: `Please wait ${formatRemainingTime(remainingMs)} before trying again.`,
    };
  }

  actionCooldowns.set(actionKey, now + cooldownMs);

  return {
    allowed: true,
    remainingMs: 0,
    message: '',
  };
}

export function clearRateLimit(actionKey) {
  actionCooldowns.delete(actionKey);
}

export function clearRateLimits(prefix = '') {
  for (const key of actionCooldowns.keys()) {
    if (!prefix || key.startsWith(prefix)) {
      actionCooldowns.delete(key);
    }
  }
}
