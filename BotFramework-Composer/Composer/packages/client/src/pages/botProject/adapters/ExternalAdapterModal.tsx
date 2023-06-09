// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState, useMemo } from 'react';
import formatMessage from 'format-message';
import { DialogFooter } from '@fluentui/react/lib/Dialog';
import { Text } from '@fluentui/react/lib/Text';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Link } from '@fluentui/react/lib/Link';
import { DialogWrapper, DialogTypes } from '@bfc/ui-shared';
import { ObjectField } from '@bfc/adaptive-form';
import { useRecoilValue } from 'recoil';
import { DialogSetting } from '@bfc/shared';
import { JSONSchema7 } from '@botframework-composer/types';
import { EditorExtension, PluginConfig } from '@bfc/extension-client';
import mapValues from 'lodash/mapValues';
import { JSONSchema7Type } from 'json-schema';
import { AdapterRecord } from '@botframework-composer/types';

import { settingsState, dispatcherState } from '../../../recoilModel';
import { useShell } from '../../../shell';
import plugins, { mergePluginConfigs } from '../../../plugins';

type Props = {
  adapterKey: string;
  packageName: string;
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  schema: JSONSchema7;
  uiSchema: JSONSchema7 & { helpLink?: string };
  value?: { [key: string]: JSONSchema7Type | undefined };
};

export function hasRequired(testObject: { [key: string]: JSONSchema7Type | undefined }, fields?: string[]) {
  if (fields == null || fields.length === 0) return true;
  return fields.every((field: string) => field in testObject && testObject[field] != null);
}

function makeDefault(schema: JSONSchema7) {
  const { properties } = schema;

  return mapValues(properties, 'default');
}

const AdapterModal = (props: Props) => {
  const { isOpen, onClose, schema, uiSchema, projectId, adapterKey, packageName } = props;

  const [value, setValue] = useState(props.value ?? makeDefault(schema));
  const { setSettings } = useRecoilValue(dispatcherState);
  const currentSettings = useRecoilValue<DialogSetting>(settingsState(projectId));

  const shell = useShell('DesignPage', projectId);

  const pluginConfig: PluginConfig = useMemo(() => {
    return mergePluginConfigs({ uiSchema } as PluginConfig, plugins);
  }, [uiSchema]);

  const { required } = schema;

  return (
    <EditorExtension plugins={pluginConfig} projectId={projectId} shell={shell}>
      <DialogWrapper
        data-testid={'adapterModal'}
        dialogType={DialogTypes.Customer}
        isOpen={isOpen}
        title={formatMessage('Configure adapter')}
        onDismiss={onClose}
      >
        <div data-testid="adapterModal">
          <ObjectField
            definitions={{}}
            id={''}
            name={''}
            schema={schema}
            uiOptions={uiSchema}
            value={value}
            onChange={(update?: { [key: string]: any }) => {
              if (update != null) setValue({ ...update, $kind: adapterKey });
            }}
          />
          <Text>
            {formatMessage.rich('To learn more about the { title }, <a>visit its documentation page</a>.', {
              title: schema.title,
              a: ({ children }) => (
                <Link key="adapter-help-text-url" href={uiSchema.helpLink} target="_blank">
                  {children}
                </Link>
              ),
            })}
          </Text>
          <DialogFooter>
            <DefaultButton onClick={onClose}>{formatMessage('Back')}</DefaultButton>
            <PrimaryButton
              disabled={value == null || !hasRequired(value, required)}
              onClick={async () => {
                if (value != null) {
                  const currentAdapters: AdapterRecord[] = currentSettings.runtimeSettings?.adapters ?? [];

                  await setSettings(projectId, {
                    ...currentSettings,
                    [packageName]: { ...(currentSettings[packageName] ?? {}), ...value },
                    runtimeSettings: {
                      ...currentSettings.runtimeSettings,
                      adapters: [
                        ...currentAdapters.filter((a) => a.name != adapterKey),
                        { name: adapterKey, enabled: true, route: value.route, type: value.type ?? adapterKey },
                      ],
                    },
                  });
                }
                onClose();
              }}
            >
              {formatMessage('Configure')}
            </PrimaryButton>
          </DialogFooter>
        </div>
      </DialogWrapper>
    </EditorExtension>
  );
};

export default AdapterModal;
