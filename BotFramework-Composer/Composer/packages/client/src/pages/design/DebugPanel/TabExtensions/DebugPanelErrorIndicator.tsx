// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { jsx } from '@emotion/react';
import { SharedColors } from '@fluentui/theme';

import { Indicator } from './Indicator';

export const DebugPanelErrorIndicator = (props: { hasError: boolean; hasWarning?: boolean }) => {
  const indicator = props.hasError ? (
    <Indicator color={`${SharedColors.red10}`} />
  ) : props.hasWarning ? (
    <Indicator color={`${SharedColors.yellow10}`} />
  ) : null;
  return indicator;
};
