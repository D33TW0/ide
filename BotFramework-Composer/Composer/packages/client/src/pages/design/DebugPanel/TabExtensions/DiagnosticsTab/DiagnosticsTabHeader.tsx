// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import formatMessage from 'format-message';

import { useAutoFix } from './useAutoFix';
import { useDiagnosticsStatistics } from './useDiagnostics';

export const DiagnosticsHeader = () => {
  const { hasError, hasWarning } = useDiagnosticsStatistics();
  useAutoFix();

  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        align-items: center;
      `}
      data-testid="Tab-Diagnostics"
    >
      <div
        css={css`
          margin-right: ${hasError || hasWarning ? 4 : 0}px;
        `}
      >
        {formatMessage('Problems')}
      </div>
    </div>
  );
};
