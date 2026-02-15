import React from 'react';
import Gradient from '@/assets/icons/Gradient';
import Logo from '@/assets/icons/Logo';
import { Box } from '@/src/components/ui/box';
import { Text } from '@/src/components/ui/text';

import { Button, ButtonText } from '@/src/components/ui/button';
import { useRouter } from 'expo-router';
import { Icon } from '@/src/components/ui/icon';

const FeatureCard = ({ iconSvg: IconSvg, name, desc }: any) => {
  return (
    <Box
      className="flex-column m-2 rounded-lg bg-background-0/40 p-4 md:flex-1"
      key={name}
    >
      <Box className="flex flex-row items-center">
        <Icon as={IconSvg} />
        <Text className="ml-2 text-xl font-medium">{name}</Text>
      </Box>
      <Text className="mt-2 text-primary-500">{desc}</Text>
    </Box>
  );
};

export default function Home() {
  const router = useRouter();
  return (
    <Box className="h-[100vh] flex-1 bg-background-300">
      {/* <Box className="absolute h-[500px] w-[500px] lg:w-[700px] lg:h-[700px]">
        <Gradient />
      </Box> */}
      <Box className="py-safe z-0 mx-5 flex flex-1 items-center lg:mx-32 lg:my-24">
        <Box className="base:flex-col justify-between gap-10 sm:w-[80%] sm:flex-row md:flex-1">
          <Box className="bg-background-template flex-col items-center rounded-full px-6 py-2 md:flex-row md:self-start">
            <Text className="font-medium text-primary-800">
              Get started by editing
            </Text>
            <Text className="ml-2 font-medium text-primary-800">
              ./App.tsx or ./app/index.tsx (or whatever entry point you have)
            </Text>
          </Box>
          <Button
            size="md"
            className="rounded-full bg-primary-500 px-6 py-2"
            onPress={() => {
              router.push('/tabs/tab1');
            }}
          >
            <ButtonText>Explore Tab Navigation</ButtonText>
          </Button>
        </Box>
        <Box className="h-[20px] w-[300px] flex-1 items-center justify-center lg:h-[160px] lg:w-[400px]">
          <Logo />
        </Box>
      </Box>
      {/* </ScrollView> */}
    </Box>
  );
}
