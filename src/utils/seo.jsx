import { useEffect } from 'react';

export const siteUrl = 'https://cre8orshub.vercel.app';

export function usePageMeta({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');

      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }

      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);
}

export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function buildCourseJsonLd({ name, description, url, image }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url,
    image,
    provider: {
      '@type': 'Organization',
      name: 'Cre8ors Hub',
      sameAs: siteUrl,
    },
  };
}

export function buildFaqJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
