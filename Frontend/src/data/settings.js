/* ══════════════════════════════════════════════════════════════
   Site Settings — Data Layer & Phone Number Helpers
   ══════════════════════════════════════════════════════════════
   Manages company contact info (phone, email, address, hours)
   with hybrid Supabase persistence + localStorage fallback.
   ════════════════════════════════════════════════════════════ */

import { supabase } from '../lib/supabase';

export const DEFAULT_SETTINGS = {
  phone: '0968 856 8983',
  email: 'vertex7.her@gmail.com',
  address: '43 Viola St., Santa Rita Matanda, San Miguel, Bulacan',
  business_hours: 'Mon - Sat: 8:00 AM - 5:00 PM',
};

const STORAGE_KEY = 'v7_site_settings';

/**
 * Generates an RFC 3966 compliant tel: href from any phone string.
 * Strips spaces, dashes, parentheses, dots.
 * Converts Philippine mobile numbers starting with '09' (11 digits) to '+639...',
 * while preserving existing international prefixes ('+...').
 *
 * Examples:
 *   "0968 856 8983"        -> "tel:+639688568983"
 *   "+63 968 856 8983"     -> "tel:+639688568983"
 *   "0968-856-8983"        -> "tel:+639688568983"
 *   "(044) 123 4567"       -> "tel:0441234567"
 *   "+1 (555) 123-4567"    -> "tel:+15551234567"
 */
export function formatTelHref(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') return 'tel:';

  const trimmed = rawPhone.trim();
  if (!trimmed) return 'tel:';

  // Strip all spaces, dashes, dots, parentheses
  const cleaned = trimmed.replace(/[\s\-\(\)\.]/g, '');

  // If already starts with '+', strip any remaining illegal characters
  if (cleaned.startsWith('+')) {
    const validChars = '+' + cleaned.slice(1).replace(/[^\d]/g, '');
    return `tel:${validChars}`;
  }

  // Philippine standard 11-digit mobile starting with 09
  if (/^09\d{9}$/.test(cleaned)) {
    return `tel:+63${cleaned.slice(1)}`;
  }

  // Philippine 10-digit without leading 0 (e.g. 9688568983)
  if (/^9\d{9}$/.test(cleaned)) {
    return `tel:+63${cleaned}`;
  }

  // General fallback: keep only digits
  const digitsOnly = cleaned.replace(/[^\d]/g, '');
  return digitsOnly ? `tel:${digitsOnly}` : 'tel:';
}

/**
 * Loads cached settings synchronously from localStorage, or defaults.
 */
export function getLocalSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // ignore parse/storage errors
  }
  return { ...DEFAULT_SETTINGS };
}

/**
 * Fetches settings from Supabase, falling back to localStorage / defaults.
 */
export async function fetchSiteSettings() {
  const local = getLocalSettings();

  if (!supabase) {
    return { settings: local, isCloudSynced: false };
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'general')
      .maybeSingle();

    if (error || !data) {
      // Table doesn't exist yet or no row found
      return { settings: local, isCloudSynced: false };
    }

    const merged = {
      phone: data.phone || local.phone || DEFAULT_SETTINGS.phone,
      email: data.email || local.email || DEFAULT_SETTINGS.email,
      address: data.address || local.address || DEFAULT_SETTINGS.address,
      business_hours: data.business_hours || local.business_hours || DEFAULT_SETTINGS.business_hours,
    };

    // Cache locally
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // storage quota / unavailable
    }

    return { settings: merged, isCloudSynced: true };
  } catch {
    return { settings: local, isCloudSynced: false };
  }
}

/**
 * Saves updated site settings to localStorage and attempts to upsert to Supabase.
 */
export async function saveSiteSettings(newSettings) {
  const cleanSettings = {
    phone: (newSettings.phone ?? DEFAULT_SETTINGS.phone).trim(),
    email: (newSettings.email ?? DEFAULT_SETTINGS.email).trim(),
    address: (newSettings.address ?? DEFAULT_SETTINGS.address).trim(),
    business_hours: (newSettings.business_hours ?? DEFAULT_SETTINGS.business_hours).trim(),
  };

  // Always save to localStorage first
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanSettings));
  } catch {
    // ignore localStorage failures
  }

  // Attempt Supabase upsert
  if (!supabase) {
    return {
      success: true,
      settings: cleanSettings,
      isCloudSynced: false,
      message: 'Saved locally (Supabase is not configured).',
    };
  }

  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 'general',
        ...cleanSettings,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('[SiteSettings] Supabase upsert error:', error.message);
      return {
        success: true,
        settings: cleanSettings,
        isCloudSynced: false,
        message: 'Saved locally. Supabase table not detected or permission error.',
        error: error.message,
      };
    }

    return {
      success: true,
      settings: cleanSettings,
      isCloudSynced: true,
      message: 'Saved and synchronized to database successfully.',
    };
  } catch (err) {
    return {
      success: true,
      settings: cleanSettings,
      isCloudSynced: false,
      message: 'Saved locally.',
      error: err?.message,
    };
  }
}
