import React from 'react';
import SignatureDetailsListItem from './SignatureDetailListItem';
import { type SignatureDetailModel } from '~/core/signitto/types/SignatureDetailModel';
import SignatureLogoDetail from './SignatureLogoDetail';
import { DragDropContext, type DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable';
import { useRecoilState } from 'recoil';
import { signatureDetailsState } from '~/core/signitto/state/SignatureDetailsState';
import Divider from '~/core/ui/Divider';
import { Bars3Icon, HandRaisedIcon } from '@heroicons/react/24/outline';
import Button from '~/core/ui/Button';

function SignatureDetailsList(): JSX.Element {
  const [signatureDetails, setSignatureDetails] = useRecoilState(
    signatureDetailsState
  );

  function setDetailValue(detailID: string, value: string): void {
    const currentList: SignatureDetailModel[] = signatureDetails.slice();
    const detailToChange: number | undefined = currentList.findIndex(
      (detail) => {
        return detail.id === detailID;
      }
    );
    if (currentList[detailToChange] !== undefined) {
      const detail: SignatureDetailModel = { ...currentList[detailToChange] };
      detail.value = value;
      currentList[detailToChange] = detail;
      setSignatureDetails(currentList);
    } else {
      console.error(`detailID: ${detailID} not found in sig details list.`);
    }
  }

  function reorder(
    list: SignatureDetailModel[],
    startIndex: number,
    endIndex: number
  ): SignatureDetailModel[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  function onDragEnd(result: DropResult): void {
    const { source, destination } = result;

    if (destination == null) {
      return;
    }

    if (destination.index === source.index) {
      return;
    }

    const reorderedDetails = reorder(
      signatureDetails,
      source.index,
      destination.index
    );
    setSignatureDetails(reorderedDetails);
  }

  return (
    <>
      <div
        id="signatureDetailsList"
        className="mt-5 flex flex-col rounded-md bg-primary-50 p-5 dark:bg-primary-500"
      >
        <div className="flow-root py-2 font-medium text-gray-700">
          <div className="float-left pt-0.5 text-lg">Signature Details</div>
          <div className="float-right">
            <Button size="small" color="primary">
              <HandRaisedIcon className="float-left h-5 pr-2" /> I need help!
            </Button>
          </div>
        </div>
        <Divider />
        <div id="detailsListContainer" className="py-4">
          <div id="avatarContainer" className="flex flex-row">
            <SignatureLogoDetail />
          </div>
          <div id="detailsContainer" className="mt-8">
            <DragDropContext onDragEnd={onDragEnd}>
              <StrictModeDroppable droppableId="list">
                {(droppableProvided) => (
                  <>
                    <div
                      ref={droppableProvided.innerRef}
                      {...droppableProvided.droppableProps}
                    >
                      {signatureDetails.map(
                        (detail: SignatureDetailModel, index: number) => {
                          return (
                            <SignatureDetailsListItem
                              id={detail.id}
                              index={index}
                              label={detail.label}
                              value={detail.value}
                              key={detail.id}
                              onChange={setDetailValue}
                            />
                          );
                        }
                      )}
                    </div>
                    {droppableProvided.placeholder}
                  </>
                )}
              </StrictModeDroppable>
            </DragDropContext>
          </div>
          <div className="flex flex-row items-center space-x-1 pt-4 text-xs">
            <div>*Drag</div>
            <Bars3Icon className="float-left h-5" />
            <div>handles to change field order*</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignatureDetailsList;
