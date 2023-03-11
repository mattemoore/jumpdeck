import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  Bars3Icon,
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
import TextField from '~/core/ui/TextField';

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
            <div className="">
              <TextField>
                <TextField.Label htmlFor={props.id}>
                  {props.label}
                </TextField.Label>
                <div className="flex flex-row">
                  <div
                    className="mr-1 pt-2"
                    {...draggableProvided.dragHandleProps}
                  >
                    <Bars3Icon className="h-5" />
                  </div>
                  <TextField.Input
                    type="text"
                    id={props.id}
                    spellCheck="false"
                    value={props.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      props.onChange(props.id, e.currentTarget.value);
                    }}
                  />
                </div>
              </TextField>
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
      return <UserCircleIcon className="left-1 top-1.5 h-6 pb-1 opacity-90" />;
    }
    case 'title': {
      return (
        <BriefcaseIcon className="absolute top-1.5 left-1 h-6 pb-1 opacity-90" />
      );
    }
    case 'company': {
      return (
        <BuildingOfficeIcon className="absolute left-1 top-1.5 h-6 pb-1 opacity-90" />
      );
    }
    case 'phone': {
      return (
        <PhoneIcon className="absolute left-1 top-1.5 h-6 pb-1 opacity-90" />
      );
    }
    case 'website': {
      return (
        <GlobeAltIcon className="absolute left-1 top-1.5 h-6 pb-1 opacity-90" />
      );
    }
    case 'email': {
      return (
        <EnvelopeIcon className="absolute left-1 top-1.5 h-6 pb-1 opacity-90" />
      );
    }
    default: {
      return (
        <TableCellsIcon className="absolute left-1 top-1.5 h-6 pb-1 opacity-90" />
      );
    }
  }
}

export default SignatureDetailListItem;
