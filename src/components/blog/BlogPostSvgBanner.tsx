type ImageProps =
  | {
      imageData?: string;
    }
  | {
      imageUrl?: string;
    }
  | {
      emoji?: string;
    };

const BlogPostSvgBanner: React.FCC<
  {
    title: string;
    width?: string;
    height?: string;
    fontSize?: string;
    className?: string;
    color?: string;
    injectStyle?: boolean;
  } & ImageProps
> = (props) => {
  const { color, title, height, width, fontSize, className, injectStyle } =
    props;

  const Spans = getTitleSpans(title);

  const useWidth = width ?? `100%`;
  const useHeight = height ?? `415`;
  const useFontSize = fontSize ?? '4.2rem';

  return (
    <svg
      width={useWidth}
      height={useHeight}
      viewBox="0 0 800 415"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      className={`BlogPostBannerSvg rounded-md ${className ?? ''}`}
    >
      {injectStyle ? <style>{getMedia()}</style> : null}
      <rect width={useWidth} height={useHeight} fill="transparent" />

      <text
        y="25%"
        fontFamily={'Inter, Helvetica, sans-serif'}
        fontWeight={'800'}
        fontSize={useFontSize}
        className={'text-current'}
      >
        {Spans.map((item, idx) => {
          return (
            <tspan key={idx} x="5%" dy="1.2em">
              {item}
            </tspan>
          );
        })}
      </text>

      {'imageUrl' in props ? (
        <image
          x={'50%'}
          y={'15%'}
          width="60%"
          height="60%"
          href={props.imageUrl}
          preserveAspectRatio="xMidYMid"
          opacity={0.15}
        />
      ) : null}

      {'imageData' in props && props.imageData ? (
        <image
          x={'50%'}
          y={'15%'}
          width="60%"
          height="60%"
          href={`data:image/png;charset=utf-8;base64,${props.imageData}`}
          preserveAspectRatio="xMidYMid"
          opacity={0.15}
        />
      ) : null}

      {'emoji' in props ? (
        <text x={'70%'} y={'70%'} fontSize={'13rem'} opacity={0.3}>
          {props.emoji}
        </text>
      ) : null}

      <rect width="100%" height="15" fill={color} />
    </svg>
  );
};

function getMedia() {
  return `
    @media (max-width: 768px) {
      .BlogPostBannerSvg text tspan {
        font-size: 50px;
      }
    }
    
    @media (max-width: 500px) {
      .BlogPostBannerSvg text tspan {
        font-size: 60px;
      }
    }
    
    @media (max-width: 300px) {
      .BlogPostBannerSvg text tspan {
        font-size: 32px;
      }
    }
   `;
}

function getTitleSpans(title: string, maxWords = 3, maxLetters = 22) {
  const words = title.split(' ');
  const spans: string[] = [];

  let index = 0;

  while (spans.join(' ').length < title.length) {
    const end = index + maxWords;

    let span = words.slice(index, end).join(' ');

    if (span.length >= maxLetters) {
      span = words.slice(index, end - 1).join(' ');
      index--;
    }

    index += maxWords;
    spans.push(span);
  }

  return spans;
}

export default BlogPostSvgBanner;
