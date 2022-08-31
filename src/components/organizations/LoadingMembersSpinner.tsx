import { SpringSpinner } from 'react-epic-spinners';

const LoadingMembersSpinner: React.FCC = ({ children }) => {
  return (
    <div className={'flex flex-row items-center space-x-4'}>
      <SpringSpinner color={'currentColor'} size={32} />

      <span className={'text-sm'}>{children}</span>
    </div>
  );
};

export default LoadingMembersSpinner;
