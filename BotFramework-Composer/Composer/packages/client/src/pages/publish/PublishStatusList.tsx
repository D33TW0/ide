// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { jsx } from '@emotion/react';
import { DetailsList, CheckboxVisibility } from '@fluentui/react/lib/DetailsList';
import { Sticky, StickyPositionType } from '@fluentui/react/lib/Sticky';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { Icon } from '@fluentui/react/lib/Icon';
import { Link } from '@fluentui/react/lib/Link';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import moment from 'moment';
import { useMemo, useState } from 'react';
import formatMessage from 'format-message';
import { PublishResult } from '@botframework-composer/types';
import { ActionButton } from '@fluentui/react/lib/Button';
import { SharedColors } from '@fluentui/theme';

import { ApiStatus } from '../../utils/publishStatusPollingUpdater';

import { listRoot, tableView, detailList } from './styles';
import { LogDialog } from './LogDialog';

export type StatusListProps = {
  items: PublishResult[];
  isRollbackSupported: boolean;
  onRollbackClick: (item: PublishResult) => void;
};

function onRenderDetailsHeader(props, defaultRender) {
  return (
    <Sticky isScrollSynced stickyPosition={StickyPositionType.Header}>
      {defaultRender({
        ...props,
        onRenderColumnHeaderTooltip: (tooltipHostProps) => <TooltipHost {...tooltipHostProps} />,
      })}
    </Sticky>
  );
}

export const PublishStatusList: React.FC<StatusListProps> = (props) => {
  const { items, isRollbackSupported, onRollbackClick } = props;
  const [displayedLog, setDisplayedLog] = useState<string | null>(null);
  const [currentSort, setSort] = useState({ key: 'PublishDate', descending: true });
  const displayedItems = useMemo(() => {
    if (currentSort.descending) return items;
    return items.slice().reverse();
  }, [items, currentSort]);

  const columns = [
    {
      key: 'PublishTime',
      name: formatMessage('Time'),
      className: 'publishTime',
      fieldName: 'time',
      minWidth: 70,
      maxWidth: 90,
      isRowHeader: true,
      data: 'string',
      onRender: (item: PublishResult) => {
        return <span>{moment(item.time).format('h:mm a')}</span>;
      },
      isPadded: true,
    },
    {
      key: 'PublishDate',
      name: formatMessage('Date'),
      className: 'publishDate',
      fieldName: 'date',
      minWidth: 70,
      maxWidth: 90,
      isRowHeader: true,
      data: 'string',
      onRender: (item: PublishResult) => {
        return <span>{moment(item.time).format('MM-DD-YYYY')}</span>;
      },
      isPadded: true,
    },
    {
      key: 'PublishStatus',
      name: formatMessage('Status'),
      className: 'publishStatus',
      fieldName: 'status',
      minWidth: 40,
      maxWidth: 40,
      data: 'string',
      onRender: (item: PublishResult) => {
        if (item.status === ApiStatus.Success) {
          return <Icon iconName="Accept" style={{ color: SharedColors.green10, fontWeight: 600 }} />;
        } else if (item.status === ApiStatus.Publishing) {
          return (
            <div style={{ display: 'flex' }}>
              <Spinner size={SpinnerSize.small} />
            </div>
          );
        } else {
          return <Icon iconName="Cancel" style={{ color: SharedColors.red10, fontWeight: 600 }} />;
        }
      },
      isPadded: true,
    },
    {
      key: 'PublishMessage',
      name: formatMessage('Message'),
      className: 'publishMessage',
      fieldName: 'message',
      minWidth: 150,
      maxWidth: 300,
      isCollapsible: true,
      isMultiline: true,
      data: 'string',
      onRender: (item: PublishResult) => {
        return (
          <span>
            {item.message}
            {item.action && (
              <Link
                aria-label={item.action.label}
                href={item.action.href}
                rel="noopener noreferrer"
                style={{ marginLeft: '3px' }}
                target="_blank"
              >
                {item.action.label}
              </Link>
            )}
          </span>
        );
      },
      isPadded: true,
    },
    {
      key: 'PublishComment',
      name: formatMessage('Comment'),
      className: 'comment',
      fieldName: 'comment',
      minWidth: 70,
      maxWidth: 90,
      isCollapsible: true,
      isMultiline: true,
      data: 'string',
      onRender: (item: PublishResult) => {
        return <span>{item.comment}</span>;
      },
      isPadded: true,
    },
    {
      key: 'PublishLog',
      name: '',
      className: 'publishLog',
      minWidth: 70,
      maxWidth: 90,
      isCollapsible: true,
      isMultiline: true,
      data: 'string',
      onRender: (item: PublishResult) => {
        return (
          <ActionButton
            allowDisabledFocus
            styles={{ root: { color: '#0078D4' } }}
            onClick={() => {
              setDisplayedLog(item.log || '');
            }}
          >
            {formatMessage('View log')}
          </ActionButton>
        );
      },
      isPadded: true,
    },
    {
      key: 'PublishRollback',
      name: '',
      className: 'publishRollback',
      fieldName: 'publishRollback',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      isMultiline: true,
      data: 'string',
      onRender: (item: PublishResult) => {
        return (
          <ActionButton
            allowDisabledFocus
            disabled={!(isRollbackSupported && item.status === 200)}
            styles={{ root: { color: SharedColors.cyanBlue10 } }}
            onClick={() => {
              onRollbackClick(item);
            }}
          >
            {formatMessage('Rollback')}
          </ActionButton>
        );
      },
      isPadded: true,
    },
  ];

  return (
    <div css={listRoot} data-testid={'publish-status-list'}>
      <div css={tableView}>
        <DetailsList
          isHeaderVisible
          checkboxVisibility={CheckboxVisibility.hidden}
          columns={columns.map((col) => ({
            ...col,
            isSorted: col.key === currentSort.key,
            isSortedDescending: currentSort.descending,
          }))}
          css={detailList}
          items={displayedItems}
          styles={{ root: { selectors: { '.ms-DetailsRow-fields': { display: 'flex', alignItems: 'center' } } } }}
          onColumnHeaderClick={(_, clickedCol) => {
            if (!clickedCol) return;
            if (clickedCol.key === currentSort.key) {
              clickedCol.isSortedDescending = !currentSort.descending;
              setSort({ key: clickedCol.key, descending: !currentSort.descending });
            } else {
              clickedCol.isSorted = false;
            }
          }}
          onRenderDetailsHeader={onRenderDetailsHeader}
        />
      </div>
      {displayedLog !== null ? <LogDialog value={displayedLog} onDismiss={() => setDisplayedLog(null)} /> : null}
    </div>
  );
};
