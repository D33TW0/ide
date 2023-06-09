// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useId } from '@fluentui/react-hooks';
import { Label } from '@fluentui/react/lib/Label';
import { Stack } from '@fluentui/react/lib/Stack';
import * as React from 'react';
import { TagInput } from '@bfc/ui-shared';

type Props = {
  /**
   * The label of the value picker control.
   */
  label?: string;
  /**
   * Callback for custom rendering of label.
   */
  onRenderLabel?: (props: Props, defaultRender: (props: Props) => JSX.Element) => JSX.Element;
  /**
   * Array of values to show.
   */
  values: string[];
  /**
   * Callback to update hte values.
   */
  onChange: (tags: string[]) => void;
};

const defaultLabelRender = (props: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const textFieldId = useId('valuePickerLabel');
  return <Label htmlFor={textFieldId}>{props.label}</Label>;
};

export const ValuePicker = (props: Props) => {
  const { label, values, onChange, onRenderLabel = defaultLabelRender } = props;

  return (
    <Stack grow>
      {label && onRenderLabel(props, defaultLabelRender)}
      <TagInput removeOnBackspace editable={false} tags={values} onChange={onChange} />
    </Stack>
  );
};
