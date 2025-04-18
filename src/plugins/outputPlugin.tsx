// plugins/OutputPlugin.tsx
import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useState } from "react";

const OutputPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [output, setOutput] = useState("");

  const handleClick = () => {
    editor.update(() => {
      const editorState = editor.getEditorState();
      const json = editorState.toJSON();
      setOutput(JSON.stringify(json, null, 2));
    });
  };

  return (
    <div>
      <button
        onClick={() => {
          editor.update(() => {
            const htmlString = $generateHtmlFromNodes(editor, null);
            const div = document.getElementById("output");
            if (!div) {
              return;
            }

            div.innerHTML = htmlString;
            setOutput(htmlString);
          });
        }}
        className="p-4 bg-blue-300 cursor-pointer"
      >
        Get Output
      </button>

      {/* <pre className="bg-gray-100 p-2 mt-2 rounded">{output}</pre> */}
    </div>
  );
};

export default OutputPlugin;
