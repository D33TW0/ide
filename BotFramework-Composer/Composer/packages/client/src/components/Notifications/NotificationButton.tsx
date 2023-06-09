// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useState } from 'react';
import { FontWeights } from '@fluentui/style-utilities';
import { IButtonStyles, IconButton } from '@fluentui/react/lib/Button';
import { NeutralColors, SharedColors } from '@fluentui/theme';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { useRecoilValue } from 'recoil';
import formatMessage from 'format-message';
import { DirectionalHint } from '@fluentui/react/lib/common/DirectionalHint';

import { notificationsSelector } from '../../recoilModel/selectors/notifications';
import { dispatcherState } from '../../recoilModel';
import TelemetryClient from '../../telemetry/TelemetryClient';

import { NotificationPanel } from './NotificationPanel';

const styles = {
  container: css`
    position: relative;
  `,
  count: (visible?: boolean) => css`
    background-color: ${NeutralColors.white};
    border: 2px solid ${SharedColors.cyanBlue10};
    border-radius: 100%;
    color: ${SharedColors.cyanBlue10};
    font-size: 8px;
    font-weight: ${FontWeights.bold};
    height: 12px;
    right: -4px;
    position: absolute;
    text-align: center;
    visibility: ${visible ? 'visible' : 'hidden'};
    width: 12px;
  `,
};

type NotificationButtonProps = {
  buttonStyles?: IButtonStyles;
};

const NotificationButton: React.FC<NotificationButtonProps> = ({ buttonStyles }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteNotification, markNotificationAsRead } = useRecoilValue(dispatcherState);
  const notifications = useRecoilValue(notificationsSelector);
  const unreadNotification = notifications.filter(({ read }) => !read);

  const toggleIsOpen = () => {
    if (!isOpen) {
      notifications.map(({ id }) => markNotificationAsRead(id));
      TelemetryClient.track('NotificationPanelOpened');
    }
    setIsOpen(!isOpen);
  };

  const label = formatMessage('Open notification panel');

  return (
    <div>
      <TooltipHost content={label} directionalHint={DirectionalHint.bottomCenter}>
        <IconButton aria-label={label} iconProps={{ iconName: 'Ringer' }} styles={buttonStyles} onClick={toggleIsOpen}>
          <div css={styles.container}>
            <div aria-hidden css={styles.count(!isOpen && !!unreadNotification.length)}>
              {unreadNotification.length}
            </div>
          </div>
        </IconButton>
      </TooltipHost>
      <NotificationPanel
        isOpen={isOpen}
        notifications={notifications}
        onDeleteNotification={deleteNotification}
        onDismiss={toggleIsOpen}
      />
    </div>
  );
};

export { NotificationButton };
