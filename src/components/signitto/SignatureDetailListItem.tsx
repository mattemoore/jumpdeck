import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  ListBulletIcon,
  UserCircleIcon,
  TableCellsIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import * as Label from '@radix-ui/react-label';
import GridList from '../GridList';

interface SignatureDetailProps {
  label: string;
  id: string;
  index: number;
  value: string;
  onChange: (detailID: string, value: string) => void;
}

function SignatureDetailListItem(props: SignatureDetailProps): JSX.Element {
  const Icon = getIcon(props.id);
  return (
    <Draggable draggableId={props.id} index={props.index} key={props.index}>
      {(draggableProvided, draggableSnapshot) => (
        <>
          <div
            className="flex flex-col pb-4"
            ref={draggableProvided.innerRef}
            {...draggableProvided.draggableProps}
          >
            <Label.Root className="pl-8 text-sm" htmlFor={props.id}>
              {props.label}
            </Label.Root>
            <div className="flex flex-row">
              <div
                className="mr-1 pt-1.5"
                {...draggableProvided.dragHandleProps}
              >
                <ListBulletIcon className="opacity-80" />
              </div>
              <div className="relative rounded-sm border border-gray-300/70">
                <input
                  type="text"
                  id={props.id}
                  spellCheck="false"
                  className="h-8 w-full border-0 pl-8"
                  value={props.value}
                  onChange={(e) => {
                    props.onChange(props.id, e.currentTarget.value);
                  }}
                />
                {getIcon(props.id)}
              </div>
            </div>
          </div>
        </>
      )}
    </Draggable>
  );
}

function getIcon(inputId: string): JSX.Element {
  switch (inputId) {
    case 'name': {
      return (
        <UserCircleIcon className="absolute left-1 top-1.5 pb-1 opacity-90" />
      );
    }
    case 'title': {
      return (
        <BriefcaseIcon className="absolute left-1 top-1.5 pb-1 opacity-90" />
      );
    }
    case 'company': {
      return (
        <BuildingOfficeIcon className="absolute left-1 top-1.5 pb-1 opacity-90" />
      );
    }
    case 'phone': {
      return <PhoneIcon className="absolute left-1 top-1.5 pb-1 opacity-90" />;
    }
    case 'website': {
      return (
        <GlobeAltIcon className="absolute left-1 top-1.5 pb-1 opacity-90" />
      );
    }
    case 'email': {
      return (
        <EnvelopeIcon className="absolute left-1 top-1.5 pb-1 opacity-90" />
      );
    }
    default: {
      return (
        <TableCellsIcon className="absolute left-1 top-1.5 pb-1 opacity-90" />
      );
    }
  }
}

export default SignatureDetailListItem;
