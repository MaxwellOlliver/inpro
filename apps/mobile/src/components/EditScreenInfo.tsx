import React from 'react';

import { ExternalLink } from './ExternalLink';
import { Box } from '@/src/components/ui/box';
import { Text } from '@/src/components/ui/text';

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <Box>
      <Box className="mx-4 items-center">
        <Text className="text-center text-typography-950">
          Open up the code for this screen:
        </Text>
        <Box className="my-2 rounded-sm bg-secondary-200 p-2">
          <Text className="font-SpaceMono text-center text-sm leading-5">
            {path}
          </Text>
        </Box>

        <Text className="text-center text-typography-950">
          Change any of the text, save the file, and your app will automatically
          update.
        </Text>
      </Box>

      <Box className="mx-5 mt-4 items-center">
        <ExternalLink
          style={{ paddingVertical: 15 }}
          href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet"
        >
          <Text className="text-center">
            Tap here if your app doesn't automatically update after making
            changes
          </Text>
        </ExternalLink>
      </Box>
    </Box>
  );
}
