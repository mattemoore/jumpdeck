import { SelfBuildingSquareSpinner } from 'react-epic-spinners';
import { PropsWithChildren } from 'react';

export default function PageLoadingIndicator({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <div
      className={`items-center justify-center h-screen w-screen flex flex-col space-y-4`}
    >
      <SelfBuildingSquareSpinner className={'fill-current'} />

      <p>{children}</p>
    </div>
  );
}
