// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { Label } from '@fluentui/react/lib/Label';
import { useId } from '@fluentui/react-hooks';
import kebabCase from 'lodash/kebabCase';
import formatMessage from 'format-message';
import { Toggle } from '@fluentui/react/lib/Toggle';

import * as styles from './styles';

interface ISettingToggleProps {
  checked?: boolean;
  description: React.ReactChild;
  id?: string;
  image?: string;
  onToggle: (checked: boolean) => void;
  title: string;
  hideToggle?: boolean;
}

const SettingToggle: React.FC<ISettingToggleProps> = (props) => {
  const { id, title, description, image, checked, onToggle, hideToggle } = props;
  const uniqueId = useId(kebabCase(title));

  return (
    <div css={styles.settingsContainer}>
      <div aria-hidden="true" css={styles.image} role="presentation">
        {image && <img aria-hidden alt={''} src={image} />}
      </div>
      <div css={styles.settingsContent}>
        <Label htmlFor={id || uniqueId} styles={{ root: { padding: 0 } }}>
          {title}
        </Label>
        <p css={styles.settingsDescription}>{description}</p>
      </div>
      {!hideToggle && (
        <Toggle
          ariaLabel={`${title} ${description}`}
          checked={!!checked}
          data-testid={id}
          id={id || uniqueId}
          offText={formatMessage('Off')}
          onChange={(_e, checked) => onToggle(!!checked)}
          onText={formatMessage('On')}
        />
      )}
    </div>
  );
};

export { SettingToggle };
