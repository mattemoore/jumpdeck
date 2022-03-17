const DraftBadge: React.FC = ({ children }) => {
  return (
    <span className="py-2 px-4 bg-yellow-200 dark:text-black-400 rounded-md font-semibold">
      {children}
    </span>
  );
};

export default DraftBadge;
