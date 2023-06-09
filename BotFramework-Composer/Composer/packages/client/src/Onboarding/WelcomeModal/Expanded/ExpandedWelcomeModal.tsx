// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { jsx } from '@emotion/react';
import formatMessage from 'format-message';
import { Icon } from '@fluentui/react/lib/Icon';
import { IconButton, PrimaryButton } from '@fluentui/react/lib/Button';

import { useOnboardingContext } from '../../OnboardingContext';

import {
  buttonStyle,
  contentStyle,
  headerStyle,
  footerStyle,
  statusStyle,
  subtitleStyle,
  titleStyle,
  topBarStyle,
} from './styles';
import welcomeImage from './welcome.png';

const StepStatus = ({ isComplete, steps = 0, title }) => (
  <div css={statusStyle}>
    <Icon className={isComplete && 'completed'} iconName={isComplete ? 'SkypeCircleCheck' : 'NavigateForward'} />
    {title}
    {!!steps && (
      <span>
        &nbsp;({steps} {steps > 1 ? formatMessage('tips') : formatMessage('tip')})
      </span>
    )}
  </div>
);

const WelcomeModal = () => {
  const {
    actions: { exit, nextSet, onComplete, toggleMinimized },
    state: { currentSet, currentStep, stepSets },
  } = useOnboardingContext();

  return (
    <div css={contentStyle}>
      <div css={headerStyle}>
        <div css={topBarStyle}>
          <div css={titleStyle}>{formatMessage('Welcome to Composer!')}</div>
          <div css={buttonStyle}>
            <IconButton
              iconProps={{ iconName: 'ChromeMinimize' }}
              title={formatMessage('Collapse')}
              onClick={toggleMinimized}
            />
            <IconButton
              data-testid={'WelcomeModalCloseIcon'}
              iconProps={{ iconName: 'ChromeClose' }}
              title={formatMessage('Close')}
              onClick={exit}
            />
          </div>
        </div>
        <img alt="Welcome" src={welcomeImage} />
        <div css={subtitleStyle}>{formatMessage('What you need to know to get started')}</div>
      </div>
      <div>
        {stepSets.map(({ steps: { length }, title }, index) => (
          <StepStatus
            key={index}
            isComplete={index < currentSet || (index === currentSet && currentStep === -1)}
            steps={length}
            title={title}
          />
        ))}
      </div>
      <div css={footerStyle}>
        {currentStep === -1 && (
          <div>
            {currentSet + 1 < stepSets.length && (
              <PrimaryButton data-testid="onboardingNextSet" text={stepSets[currentSet + 1].title} onClick={nextSet} />
            )}
            {currentSet + 1 === stepSets.length && (
              <PrimaryButton data-testid="onboardingDone" text={formatMessage('Done!')} onClick={onComplete} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeModal;
