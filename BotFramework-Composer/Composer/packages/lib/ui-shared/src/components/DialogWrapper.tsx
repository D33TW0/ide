// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Dialog, DialogType, IDialogProps } from '@fluentui/react/lib/Dialog';
import { FontWeights } from '@fluentui/react/lib/Styling';
import { FontSizes } from '@fluentui/theme';
import { IDialogContentStyles } from '@fluentui/react/lib/Dialog';
import { IModalStyles } from '@fluentui/react/lib/Modal';

export enum DialogTypes {
  CreateFlow,
  DesignFlow,
  Customer,
  ProvisionFlow,
}

// -------------------- Styles -------------------- //

const styles: {
  [DialogTypes.DesignFlow]: { dialog: Partial<IDialogContentStyles>; modal: Partial<IModalStyles> };
  [DialogTypes.CreateFlow]: { dialog: Partial<IDialogContentStyles>; modal: Partial<IModalStyles> };
  [DialogTypes.ProvisionFlow]: { dialog: Partial<IDialogContentStyles>; modal: Partial<IModalStyles> };
} = {
  [DialogTypes.CreateFlow]: {
    dialog: {
      title: {
        fontWeight: FontWeights.bold,
        fontSize: FontSizes.size20,
        paddingTop: '14px',
        paddingBottom: '11px',
      },
      subText: {
        fontSize: FontSizes.size14,
      },
    },
    modal: {
      main: {
        // maxWidth: '416px !important',
        maxWidth: '80% !important',
        width: '960px !important',
      },
    },
  },
  [DialogTypes.ProvisionFlow]: {
    dialog: {
      title: {
        fontWeight: FontWeights.bold,
        fontSize: FontSizes.size20,
        paddingTop: '14px',
        paddingBottom: '11px',
      },
      subText: {
        fontSize: FontSizes.size14,
      },
    },
    modal: {
      main: {
        maxWidth: '70% !important',
        width: '900px !important',
      },
    },
  },
  [DialogTypes.DesignFlow]: {
    dialog: {
      title: {
        fontWeight: FontWeights.bold,
        fontSize: FontSizes.size20,
        paddingTop: '14px',
        paddingBottom: '11px',
      },
      subText: {
        fontSize: FontSizes.size14,
      },
    },
    modal: {
      main: {
        maxWidth: '416px !important',
      },
    },
  },
};

interface DialogWrapperProps extends Pick<IDialogProps, 'onDismiss'> {
  isOpen: boolean;
  isBlocking?: boolean;
  title?: string;
  subText?: string;
  dialogType: DialogTypes;
  customerStyle?: {
    dialog?: Record<string, any>;
    modal?: Record<string, any>;
  };
  minWidth?: number;
}

export const DialogWrapper: React.FC<DialogWrapperProps> = (props) => {
  const {
    isOpen,
    onDismiss,
    title = '',
    subText = '',
    children,
    dialogType,
    isBlocking,
    customerStyle = { dialog: {}, modal: {} },
    minWidth,
  } = props;
  /* add customer styles to the array */
  styles[DialogTypes.Customer] = customerStyle;

  const currentStyle = styles[dialogType];

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      dialogContentProps={{
        type: DialogType.normal,
        title: title,
        subText: subText,
        styles: currentStyle.dialog,
      }}
      hidden={false}
      minWidth={minWidth}
      modalProps={{
        isBlocking: isBlocking,
        styles: currentStyle.modal,
      }}
      onDismiss={onDismiss}
    >
      {children}
    </Dialog>
  );
};
