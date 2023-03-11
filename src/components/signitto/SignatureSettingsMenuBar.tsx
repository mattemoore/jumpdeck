import React from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import {
  ShareIcon,
  RectangleGroupIcon,
  NewspaperIcon,
  ListBulletIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import Button from '~/core/ui/Button';
import Link from 'next/link';

function SignatureSettingsMenuBar(): JSX.Element {
  return (
    <>
      <div className="flex h-20 w-full flex-row items-center justify-around bg-primary-50 px-4">
        <div>
          <Link
            href="/"
            className={'text-primary-800 hover:underline dark:text-primary-500'}
          >
            Back to JumpDeck
          </Link>
        </div>
        <div>
          <img src="/assets/images/logo-signitto.svg" alt="Signitto logo"></img>
        </div>
        <div>
          <ToggleGroup.Root
            className="flex h-10 flex-wrap justify-center"
            type="single"
            defaultValue="details"
            aria-label="Signature Settings Menu"
          >
            <ToggleGroup.Item
              className="ToggleGroupItem"
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
              className="ToggleGroupItem"
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
              className="ToggleGroupItem"
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
              className="ToggleGroupItem"
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
          <Button>
            <RocketLaunchIcon className="float-left h-5 pr-2" /> Unlock Pro
          </Button>
        </div>
      </div>
    </>
  );
}

export default SignatureSettingsMenuBar;
