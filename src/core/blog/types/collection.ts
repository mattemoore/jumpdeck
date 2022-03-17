interface WithEmoji {
  emoji?: string;
}

interface WithLogo {
  logo?: string;
}

interface Collection extends WithEmoji, WithLogo {
  name: string;
  slug: string;
}

export default Collection;
