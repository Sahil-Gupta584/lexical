/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import { BsTypeItalic, BsTypeUnderline } from "react-icons/bs";
import { CiRedo, CiUndo } from "react-icons/ci";
import { FaBold } from "react-icons/fa";
import { GoStrikethrough } from "react-icons/go";
import { LuAlignCenter, LuAlignLeft, LuAlignRight } from "react-icons/lu";
import { MdFormatQuote, MdImage } from "react-icons/md";
import { INSERT_IMAGE_COMMAND } from "./imagePlugin";

const LowPriority = 1;

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isQuote, setIsQuote] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = selection.getNodes()[0];
      if (node) {
        const element = node.getTopLevelElementOrThrow();
        setIsQuote(element.getType() === "quote");
      }
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      // setIsStrikethrough(selection.li("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);
  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      $setBlocksType(selection, () => $createQuoteNode());
    });
  };

  return (
    <div
      className=" flex align-middle mb-px p-1 rounded-t-[10px]; bg-white border-b-[1px] rounded-t-md"
      ref={toolbarRef}
    >
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="flex cursor-pointer align-middle p-2 rounded-[10px] border-0"
        aria-label="Undo"
      >
        <CiUndo className="w-5 h-5" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <CiRedo className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={
          "flex cursor-pointer align-middle p-2 rounded-[10px] border-0 " +
          (isBold ? "bg-gray-500 " : "")
        }
        aria-label="Format Bold"
      >
        <FaBold />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={
          "flex cursor-pointer align-middle p-2 rounded-[10px] border-0 " +
          (isItalic ? "bg-gray-500 " : "")
        }
        aria-label="Format Italics"
      >
        <BsTypeItalic />{" "}
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={
          "flex cursor-pointer align-middle p-2 rounded-[10px] border-0 " +
          (isUnderline ? "bg-gray-500 " : "")
        }
        aria-label="Format Underline"
      >
        <BsTypeUnderline />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={
          "flex cursor-pointer align-middle p-2 rounded-[10px] border-0 " +
          (isStrikethrough ? "bg-gray-500 " : "")
        }
        aria-label="Format Strikethrough"
      >
        <GoStrikethrough />
      </button>
      <hr />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="flex cursor-pointer align-middle p-2 rounded-[10px] border-0"
        aria-label="Left Align"
      >
        <LuAlignLeft />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="flex cursor-pointer align-middle p-2 rounded-[10px] border-0"
        aria-label="Center Align"
      >
        <LuAlignCenter />{" "}
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="flex cursor-pointer align-middle p-2 rounded-[10px] border-0"
        aria-label="Right Align"
      >
        <LuAlignRight />{" "}
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        <i className="format justify-align" />
      </button>{" "}
      <button
        onClick={() => {
          formatQuote();
        }}
        className={
          "flex cursor-pointer align-middle p-2 rounded-[10px] border-0 " +
          (isQuote ? "bg-gray-500 " : "")
        }
        aria-label="Quote Block"
      >
        <MdFormatQuote />
      </button>
      <button
        onClick={() => {
          const url = prompt("Enter URL:");
          if (!url) return;
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }}
        className="flex cursor-pointer align-middle p-2 rounded-[10px] border-0"
        aria-label="Insert Link"
      >
        <AiOutlineLink />
      </button>
      <button
        onClick={() => {
          const srcfile = prompt("Enter the URL of the image:", "");

          editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            src: srcfile as string,
            altText: "Image",
            captionsEnabled: true,
            showCaption: true,
            // caption: "Image Caption",
          });
        }}
        className="flex cursor-pointer align-middle p-2 rounded-[10px] border-0"
        aria-label="Insert Image"
      >
        <MdImage />
      </button>
    </div>
  );
}
