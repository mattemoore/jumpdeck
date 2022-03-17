/**
 * @name getStructuredData
 * @description returns a Structured Data JSON. Use to personalize how your
 * web page looks on Search Engines and improve SEO
 */
export function getStructuredData(props: {
  type: string;
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imagePath: string;

  author: {
    name: string;
    url: string;
    type?: string;
  };
}) {
  const authorType = props.author.type ?? 'Person';

  return {
    '@context': 'https://schema.org/',
    '@type': props.type,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': props.id,
    },
    image: [props.imagePath],
    headline: props.title,
    description: props.excerpt,
    author: {
      '@type': authorType,
      name: props.author.name,
      url: props.author.url,
    },
    datePublished: props.date,
  };
}
