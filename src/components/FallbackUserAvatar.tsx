const FallbackUserAvatar: React.FCC<{ text: string }> = ({ text }) => {
  return <span className={`FallbackUserAvatar`}>{text[0]}</span>;
};

export default FallbackUserAvatar;
