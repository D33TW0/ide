// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { jsx } from '@emotion/react';
import formatMessage from 'format-message';
import { DefaultButton } from '@fluentui/react/lib/Button';
import React, { useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { FontSizes, SharedColors, NeutralColors, FluentTheme } from '@fluentui/theme';
import { DiagnosticSeverity } from '@bfc/shared';
import { FontWeights } from '@fluentui/style-utilities';
import { Stack } from '@fluentui/react/lib/Stack';

import { outputsDebugPanelSelector, rootBotProjectIdSelector } from '../../../../../recoilModel';
import { DropdownWithAllOption } from '../../../../../components/DropdownWithAllOption/DropdownWithAllOption';

const severityTextStyle = {
  marginRight: '6px',
};

const countStyle: any = {
  fontWeight: FontWeights.bold,
};

const getOptionAll = () => {
  return {
    key: 'All',
    text: formatMessage('All bots'),
  };
};

const getSeverityButtonStyle = (severityType: DiagnosticSeverity, isChecked: boolean): any => {
  const baseStyle = {
    root: {
      padding: '4px 8px',
      marginRight: '8px',
      fontSize: FontSizes.size12,
      textAlign: 'center',
      border: `1px solid ${NeutralColors.gray20}`,
      boderRadius: '2px',
      height: '24px',
      fontWeight: '500',
    },
    icon: {
      color: isChecked ? SharedColors.red10 : NeutralColors.gray90,
      fontSize: FontSizes.size16,
      marginRight: '8px',
    },
  };

  if (severityType === DiagnosticSeverity.Warning) {
    return {
      ...baseStyle,
      icon: {
        ...baseStyle.icon,
        color: isChecked ? FluentTheme.palette.yellow : NeutralColors.gray90,
      },
    };
  } else {
    return baseStyle;
  }
};

type DiagnosticsFiltersProps = {
  showErrors: boolean;
  projectsToFilter: string[];
  showWarnings: boolean;
  errorCount: number;
  warningCount: number;
  onWarningFilterChange: (value: boolean) => void;
  onErrorFilterChange: (value: boolean) => void;
  onProjectFilterChange: (projects: string[]) => void;
};

export const DiagnosticsFilters: React.FC<DiagnosticsFiltersProps> = (props) => {
  const {
    showErrors,
    showWarnings,
    onWarningFilterChange,
    onErrorFilterChange,
    onProjectFilterChange,
    projectsToFilter,
    errorCount,
    warningCount,
  } = props;
  const projects = useRecoilValue(outputsDebugPanelSelector);
  const rootBotProjectId = useRecoilValue(rootBotProjectIdSelector);
  const optionAll = getOptionAll();

  useEffect(() => {
    if (rootBotProjectId) {
      onProjectFilterChange([rootBotProjectId]);
    }
  }, [rootBotProjectId]);

  const projectSelectorOptions = useMemo(() => {
    return projects.map(({ projectId, botName }) => {
      return {
        key: projectId,
        text: botName,
      };
    });
  }, [projects]);

  useEffect(() => {
    const allProjects = projects.map((project) => project.projectId);
    onProjectFilterChange([...allProjects, optionAll.key]);
  }, [projects]);

  if (!rootBotProjectId) {
    return null;
  }

  return (
    <Stack horizontal>
      <DefaultButton
        allowDisabledFocus
        checked={showErrors}
        iconProps={{ iconName: 'StatusErrorFull' }}
        styles={getSeverityButtonStyle(DiagnosticSeverity.Error, showErrors)}
        onClick={() => {
          onErrorFilterChange(!showErrors);
        }}
      >
        <span style={severityTextStyle}>
          {formatMessage(`{count, plural,=1 {Error}other {Errors}}`, { count: errorCount })}
        </span>
        <span style={countStyle}>{errorCount}</span>
      </DefaultButton>
      <DefaultButton
        allowDisabledFocus
        toggle
        checked={showWarnings}
        iconProps={{ iconName: 'WarningSolid' }}
        styles={getSeverityButtonStyle(DiagnosticSeverity.Warning, showWarnings)}
        onClick={() => {
          onWarningFilterChange(!showWarnings);
        }}
      >
        <span style={severityTextStyle}>
          {formatMessage(`{count, plural,=1 {Warning}other {Warnings}}`, { count: warningCount })}
        </span>
        <span style={countStyle}>{warningCount}</span>
      </DefaultButton>
      <div
        css={{
          marginLeft: 'auto !important',
        }}
      >
        <DropdownWithAllOption
          aria-label={formatMessage('Select bots to display problems for')}
          optionAll={optionAll}
          options={projectSelectorOptions}
          placeholder={formatMessage('Select bots')}
          selectedKeys={projectsToFilter}
          onChange={(_, items: string[]) => {
            onProjectFilterChange(items);
          }}
        />
      </div>
    </Stack>
  );
};
