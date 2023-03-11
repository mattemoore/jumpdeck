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
import Container from '~/core/ui/Container';

function SignatureSettingsMenuBar(): JSX.Element {
  return (
    <>
      <Container>
        <div className="flex w-full flex-row items-center justify-between px-4">
          <div>
            <img
              src="/assets/images/logo-signitto.svg"
              alt="Signitto logo"
            ></img>
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
            <Button>
              <RocketLaunchIcon className="float-left h-5 pr-2" /> Unlock Pro
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}

export default SignatureSettingsMenuBar;
