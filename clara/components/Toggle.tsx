import React from 'react';
import { View, Text, Switch } from 'react-native';

type Props = {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
};

export default function Toggle({ label, value, onChange }: Props) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
      <Text>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}


