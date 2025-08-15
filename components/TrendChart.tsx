import React from 'react';

type Props = {
  data: { x: string | number; y: number }[];
  title?: string;
};

export default function TrendChart({ data, title }: Props) {
  return (
    <>
      {title ? <></> : null}
      {/* TODO: Swap in Victory chart once API is finalized in SDK. Placeholder for now. */}
    </>
  );
}


