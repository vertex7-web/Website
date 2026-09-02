import { useEffect } from 'react';

/**
 * Updates the document title and meta description for the current page.
 * Call this at the top of each page component for per-page SEO.
 *
 * @param {{ title: string, description?: string }} options
 */
export default function useDocumentMeta({ title, description }) {
  useEffect(() => {
    // Update the page title
    document.title = title;

    // Update the meta description
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', description);
      } else {
        meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }

    // Update the OG title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    // Update the OG description
    if (description) {
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', description);
      }
    }
  }, [title, description]);
}
