// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { CompletionItemKind } from 'monaco-languageclient';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import React, { useLayoutEffect, useRef } from 'react';
import { CompletionItem, MarkupContent } from 'vscode-languageserver-types';
import { DirectionalHint } from '@fluentui/react/lib/common/DirectionalHint';

type FuseJsMatch = { indices: number[][]; value: string; key: string };

const styles = {
  completionElement: css`
    height: 32px;
    cursor: pointer;
    padding: 0 4px;
    width: 100%;
    display: flex;
    align-items: center;
  `,
  selectedElement: css`
    background-color: #ddd;
  `,
  text: css`
    font-size: 15px;
  `,
  icon: css`
    margin-right: 5px;
  `,
};

const getIconName = (kind: CompletionItemKind | undefined): string => {
  switch (kind) {
    case CompletionItemKind.Function:
      return 'Variable';
    case CompletionItemKind.Variable:
      return 'VariableGroup';
    case CompletionItemKind.Enum:
      return 'BulletedList';
    default:
      return '';
  }
};

// You can check out Fuse.js documentation to understand the types: https://fusejs.io/api/options.html.
// Matches is an array of "match" (m). Each match has a start index and end index.
const renderMatch = (match: FuseJsMatch, segmentIndex: number): JSX.Element => {
  let firstIndex = 0;
  const lastIndex = match.value.length;

  const items = match.indices.map((m, spanIndex) => {
    const firstSpan = <span>{match.value.slice(firstIndex, m[0])}</span>;
    const secondSpan = <span style={{ color: 'blue' }}>{match.value.slice(m[0], m[1] + 1)}</span>;

    firstIndex = m[1] + 1;
    return (
      <React.Fragment key={`segment-${segmentIndex}-span-${spanIndex}`}>
        {firstSpan}
        {secondSpan}
      </React.Fragment>
    );
  });

  items.push(<span key={`segment-${segmentIndex}-span-final`}>{match.value.slice(firstIndex, lastIndex)}</span>);

  return <React.Fragment key={`segment-${segmentIndex}`}>{items}</React.Fragment>;
};

const renderLabelWithCharacterHighlights = (matches: FuseJsMatch[]): JSX.Element => {
  return <React.Fragment> {matches.map(renderMatch)} </React.Fragment>;
};

const renderDocumentation = (documentation: string | MarkupContent | undefined) => {
  return <span>{documentation}</span>;
};

export const CompletionElement = (props: {
  id: string;
  completionItem: CompletionItem;
  isSelected: boolean;
  onClickCompletionItem: () => void;
}) => {
  const { completionItem, isSelected, onClickCompletionItem, id } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const additionalStyles = isSelected ? styles.selectedElement : {};

  useLayoutEffect(() => {
    if (isSelected) {
      rootRef.current?.scrollIntoView?.();
    }
  }, [isSelected]);

  const renderItem = () => {
    return (
      <div
        id={id}
        ref={rootRef}
        aria-selected={isSelected}
        css={[styles.completionElement, additionalStyles]}
        onClick={onClickCompletionItem}
        role="option"
      >
        <FontIcon iconName={getIconName(completionItem.kind)} css={styles.icon} />
        <div css={styles.text}>
          {completionItem.data?.matches
            ? renderLabelWithCharacterHighlights(completionItem.data.matches)
            : completionItem.label}
        </div>
      </div>
    );
  };

  return completionItem.documentation ? (
    <TooltipHost
      content={renderDocumentation(completionItem.documentation)}
      directionalHint={DirectionalHint.rightCenter}
    >
      {renderItem()}
    </TooltipHost>
  ) : (
    renderItem()
  );
};
