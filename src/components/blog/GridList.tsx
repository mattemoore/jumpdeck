const GridList: React.FC = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8 lg:gap-x-12 gap-y-8 md:gap-y-12 mb-16">
      {children}
    </div>
  );
};

export default GridList;
