import React from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import {
  ShareIcon,
  RectangleGroupIcon,
  NewspaperIcon,
  ListBulletIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

function SignatureSettingsMenuBar(): JSX.Element {
  return (
    <>
      <div className="flex w-full flex-row items-center justify-between px-4">
        <div>
          <img src="logo-signitto.svg" alt="Signitto logo"></img>
        </div>
        <div>
          <ToggleGroup.Root
            className="flex h-10 flex-wrap justify-center"
            type="single"
            defaultValue="details"
            aria-label="Signature Settings Menu"
          >
            <ToggleGroup.Item
              className="hover:border-b-black data-[state=on]:border-b-black mx-5 px-5 hover:border-b-4 data-[state=on]:border-b-4"
              value="details"
              aria-label="Details"
            >
              Details
              <ListBulletIcon
                className="text-gray-700-800 float-left mr-3 h-6 w-6"
                title="Design Settings Icon"
              />
            </ToggleGroup.Item>
            <ToggleGroup.Item
              className="hover:border-b-black data-[state=on]:border-b-black mx-5 px-5 hover:border-b-4 data-[state=on]:border-b-4"
              value="social"
              aria-label="Social Settings"
            >
              Social
              <ShareIcon
                className="text-gray-700-800 float-left mr-3 h-6 w-6"
                title="Social Settings Icon"
              />
            </ToggleGroup.Item>
            <ToggleGroup.Item
              className="hover:border-b-black data-[state=on]:border-b-black mx-5 px-5 hover:border-b-4 data-[state=on]:border-b-4"
              value="template"
              aria-label="Template Settings"
            >
              Template
              <RectangleGroupIcon
                className="text-gray-700-800 float-left mr-3 h-6 w-6"
                title="Template Settings Icon"
              />
            </ToggleGroup.Item>
            <ToggleGroup.Item
              className="hover:border-b-black data-[state=on]:border-b-black mx-5 px-5 hover:border-b-4 data-[state=on]:border-b-4"
              value="design"
              aria-label="Design Settings"
            >
              Design
              <NewspaperIcon
                className="text-gray-700-800 float-left mr-3 h-6 w-6"
                title="Design Settings Icon"
              />
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
        <div>
          <button className="h-10 rounded-md border border-blue-700/90 px-2 text-sm font-normal text-blue-700/90 hover:scale-110 hover:bg-slate-100">
            <RocketLaunchIcon className="float-left pr-1" /> Unlock Pro
          </button>
        </div>
      </div>
    </>
  );
}

export default SignatureSettingsMenuBar;
