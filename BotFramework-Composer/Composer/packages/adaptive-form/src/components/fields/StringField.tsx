// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect } from 'react';
import { FieldProps } from '@bfc/extension-client';
import { ITextField, TextField } from '@fluentui/react/lib/TextField';
import formatMessage from 'format-message';

import { FieldLabel } from '../FieldLabel';

export const StringField: React.FC<FieldProps<string>> = function StringField(props) {
  const {
    id,
    value = '',
    onChange,
    disabled,
    label,
    description,
    placeholder,
    readonly,
    onFocus,
    onBlur,
    error,
    uiOptions,
    required,
    focused,
    cursorPosition,
    hasIcon,
    aria,
  } = props;

  const textFieldRef = React.createRef<ITextField>();

  useEffect(() => {
    if (focused && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [focused, textFieldRef.current, value]);

  useEffect(() => {
    if (cursorPosition !== undefined && cursorPosition > -1 && textFieldRef.current) {
      textFieldRef.current.setSelectionRange(cursorPosition, textFieldRef.current.selectionEnd || cursorPosition);
    }
  }, [cursorPosition]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (typeof onFocus === 'function') {
      e.stopPropagation();
      onFocus(id, value, e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (typeof onBlur === 'function') {
      e.stopPropagation();
      onBlur(id, value);
    }
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    onChange(newValue);
  };

  return (
    <>
      <FieldLabel description={description} helpLink={uiOptions?.helpLink} id={id} label={label} required={required} />
      <TextField
        {...aria}
        aria-required={required}
        ariaLabel={label || formatMessage('string field')}
        autoAdjustHeight={!!uiOptions?.multiline}
        autoComplete="off"
        componentRef={textFieldRef}
        data-testid="string-field"
        disabled={disabled}
        errorMessage={error}
        id={id}
        multiline={uiOptions?.multiline}
        placeholder={placeholder}
        readOnly={readonly}
        resizable={false}
        styles={{
          root: { width: '100%' },
          fieldGroup: {
            borderRadius: hasIcon ? '0 2px 2px 0' : undefined,
          },
          errorMessage: { display: 'none' },
        }}
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
        onClick={props.onClick}
        onFocus={handleFocus}
        onKeyDown={props.onKeyDown}
        onKeyUp={props.onKeyUp}
      />
    </>
  );
};
