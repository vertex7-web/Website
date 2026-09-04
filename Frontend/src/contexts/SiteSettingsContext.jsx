/* ══════════════════════════════════════════════════════════════
   Site Settings Context
   ══════════════════════════════════════════════════════════════
   Provides dynamic contact info across all public pages and admin
   dashboard, including automated schema.org structured data update.
   ════════════════════════════════════════════════════════════ */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_SETTINGS,
  getLocalSettings,
  fetchSiteSettings,
  saveSiteSettings,
} from '../data/settings';

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => getLocalSettings());
  const [loading, setLoading] = useState(true);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // Sync schema.org JSON-LD in document head
  const updateJsonLdTelephone = useCallback((phone) => {
    try {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach((script) => {
        try {
          const json = JSON.parse(script.textContent);
          let changed = false;
          if (json && typeof json === 'object') {
            if ('telephone' in json) {
              json.telephone = phone;
              changed = true;
            }
            if (Array.isArray(json['@graph'])) {
              json['@graph'].forEach((node) => {
                if (node && 'telephone' in node) {
                  node.telephone = phone;
                  changed = true;
                }
              });
            }
          }
          if (changed) {
            script.textContent = JSON.stringify(json, null, 2);
          }
        } catch {
          // ignore non-JSON or unrelated LD+JSON scripts
        }
      });
    } catch {
      // DOM access failure
    }
  }, []);

  // Initial load
  useEffect(() => {
    let mounted = true;

    async function load() {
      const result = await fetchSiteSettings();
      if (mounted) {
        setSettings(result.settings);
        setIsCloudSynced(result.isCloudSynced);
        setLoading(false);
        updateJsonLdTelephone(result.settings.phone);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [updateJsonLdTelephone]);

  const updateSettings = useCallback(
    async (newSettings) => {
      // Optimistically update React state immediately
      setSettings((prev) => ({ ...prev, ...newSettings }));
      if (newSettings.phone) {
        updateJsonLdTelephone(newSettings.phone);
      }

      // Persist
      const res = await saveSiteSettings(newSettings);
      if (res.settings) {
        setSettings(res.settings);
      }
      setIsCloudSynced(res.isCloudSynced);
      return res;
    },
    [updateJsonLdTelephone]
  );

  const reloadSettings = useCallback(async () => {
    setLoading(true);
    const result = await fetchSiteSettings();
    setSettings(result.settings);
    setIsCloudSynced(result.isCloudSynced);
    setLoading(false);
    updateJsonLdTelephone(result.settings.phone);
  }, [updateJsonLdTelephone]);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        loading,
        isCloudSynced,
        reloadSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    return {
      settings: DEFAULT_SETTINGS,
      updateSettings: async () => ({ success: false }),
      loading: false,
      isCloudSynced: false,
      reloadSettings: async () => {},
    };
  }
  return context;
}
