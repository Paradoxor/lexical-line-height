/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {$patchStyleText} from '@lexical/selection';
import {$getSelection, LexicalEditor} from 'lexical';
import React, { useState, useCallback } from 'react';
import DropDown, { DropDownItem } from '../../ui/DropDown';
import './index.css';

export default function LineHeight({
  disabled,
  editor,
  value
}: {
  disabled: boolean;
  editor: LexicalEditor;
  value: string;
}) {
  const [customModeActive, setCustomModeActive] = useState(false);
  const [lineHeight, setLineHeight] = useState('1');

  const AVAILABLE_LINE_HEIGHTS: [string, string][] = [
    ["1", "Single"],
    ["1.5", "1.5"],
    ["2", "Doubled"],
    ["3", "3"],
    ["custom", "User defined"]
  ];

  const isValueInList = useCallback(value =>
    AVAILABLE_LINE_HEIGHTS.some(([height]) => height === value),
    [AVAILABLE_LINE_HEIGHTS]
  );

  const updateLineHeight = useCallback(
    (newLineHeight: string | null) => {
      // handle new line height not setting it
      if (newLineHeight == "custom") {
        setCustomModeActive(true);
        return;
      }

      setCustomModeActive(!isValueInList(value));
      setLineHeight(newLineHeight);
      editor.update(() => {
        if (editor.isEditable()) {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, {
              'line-height': newLineHeight,
            });
          }
        }
      });
    },
    [editor],
  );

  const handleKeyPress = useCallback(e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const numLineHeight = Number(lineHeight);
      if (numLineHeight > 0 && !isNaN(numLineHeight)) {
        updateLineHeight(lineHeight);
      } else {
        setLineHeight("1"); // reset to default if invalid
      }
    }
  }, [lineHeight, updateLineHeight]);

  return (
    <>
    <DropDown disabled={disabled} buttonClassName="toolbar-item spaced" buttonAriaLabel="Insert specialized editor node" buttonIconClassName="icon line-height">
      {AVAILABLE_LINE_HEIGHTS.map(([option, text]) => (
        <DropDownItem className={`item ${option === value ? 'active dropdown-item-active' : ''}`} onClick={() => updateLineHeight(option)} key={option}>
          <span className="text">{text}</span>
        </DropDownItem>
      ))}
    </DropDown>
    {(customModeActive || !isValueInList(value)) && (
    <input
        type="number"
        value={lineHeight}
        disabled={disabled}
        className="toolbar-item line-height-input"
        min="1"
        onChange={(e) => setLineHeight(e.target.value)}
        onBlur={() => updateLineHeight(lineHeight)}
        onKeyDown={handleKeyPress}
      />)}
    </>
  );
}
