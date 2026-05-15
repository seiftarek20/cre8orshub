const HTML_BRACKETS = /[<>]/g;

function replaceControlChars(value) {
  return Array.from(value, (char) => {
    const code = char.charCodeAt(0);
    return code <= 31 || code === 127 ? ' ' : char;
  }).join('');
}

export function sanitizeText(value, { maxLength = 500, required = false, label = 'This field' } = {}) {
  const text = replaceControlChars(String(value ?? ''))
    .replace(HTML_BRACKETS, '')
    .trim()
    .replace(/\s+/g, ' ');

  if (required && !text) {
    throw new Error(`${label} is required.`);
  }

  if (text.length > maxLength) {
    throw new Error(`${label} is too long.`);
  }

  return text;
}

export function sanitizeLongText(value, { maxLength = 2000, required = false, label = 'This field' } = {}) {
  const text = replaceControlChars(String(value ?? ''))
    .replace(HTML_BRACKETS, '')
    .trim();

  if (required && !text) {
    throw new Error(`${label} is required.`);
  }

  if (text.length > maxLength) {
    throw new Error(`${label} is too long.`);
  }

  return text;
}

export function sanitizeOptionalUrl(value, { label = 'Link' } = {}) {
  const url = sanitizeText(value, { maxLength: 500, required: false, label });

  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error();
    }
  } catch {
    throw new Error(`${label} must be a valid http or https URL.`);
  }

  return url;
}

export function sanitizeEmail(value) {
  const email = sanitizeText(value, { maxLength: 254, required: true, label: 'Email' }).toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.');
  }

  return email;
}

export function validateChoice(value, allowedValues, { label = 'Value', fallback = null } = {}) {
  const normalized = sanitizeText(value || fallback, { maxLength: 50, required: true, label });

  if (!allowedValues.includes(normalized)) {
    throw new Error(`${label} is not valid.`);
  }

  return normalized;
}

export function sanitizeScore(value) {
  if (value === '' || value === null || value === undefined) return null;

  const score = Number(value);
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw new Error('Score must be between 0 and 100.');
  }

  return score;
}

export function toSafeSupabaseError(error, fallbackMessage = 'Action could not be completed. Please try again.') {
  const status = error?.status;
  const code = error?.code;

  if (code === 'PGRST116') {
    return new Error('This item is no longer available.');
  }

  if (status === 401 || status === 403 || code === '42501') {
    return new Error('You do not have permission to complete this action.');
  }

  if (status === 409 || code === '23505') {
    return new Error('This item already exists.');
  }

  return new Error(fallbackMessage);
}
