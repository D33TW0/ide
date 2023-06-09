// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Fragment } from 'react';
import { useRecoilValue } from 'recoil';
import { ActionButton } from '@fluentui/react/lib/Button';
import formatMessage from 'format-message';
import { CommunicationColors } from '@fluentui/theme';

import { botBuildTimeErrorState, dispatcherState } from '../../recoilModel';

type BotErrorViewerProps = {
  projectId: string;
};

export const BotErrorViewer: React.FC<BotErrorViewerProps> = ({ projectId }) => {
  const { setActiveTabInDebugPanel, setDebugPanelExpansion } = useRecoilValue(dispatcherState);
  const botBuildTimeError = useRecoilValue(botBuildTimeErrorState(projectId));

  const openErrorDialog = () => {
    setActiveTabInDebugPanel('RuntimeLog');
    setDebugPanelExpansion(true);
  };

  return (
    <Fragment>
      {botBuildTimeError?.message && (
        <ActionButton
          styles={{
            root: {
              color: `${CommunicationColors.primary}`,
              height: '20px',
            },
          }}
          onClick={() => {
            openErrorDialog();
          }}
        >
          <span>{formatMessage('See details')}</span>
        </ActionButton>
      )}
    </Fragment>
  );
};
