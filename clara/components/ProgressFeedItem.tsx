import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  text: string;
};

export default function ProgressFeedItem({ text }: Props) {
  return (
    <View style={{ paddingVertical: 10 }}>
      <Text>{text}</Text>
    </View>
  );
}


