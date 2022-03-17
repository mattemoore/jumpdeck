const FallbackUserAvatar: React.FC<{ text: string }> = ({ text }) => {
  return <span className={`FallbackUserAvatar`}>{text[0]}</span>;
};

export default FallbackUserAvatar;
