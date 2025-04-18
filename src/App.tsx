import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import ToolbarPlugin from "./plugins/toolbar";
import { ParagraphNode, TextNode } from "lexical";

import "./App.css";
import { QuoteNode } from "@lexical/rich-text";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LinkNode } from "@lexical/link";
import { useEffect } from "react";
import ImagesPlugin from "./plugins/imagePlugin";
import { ImageNode } from "./nodes/imageNode";
function App() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if ((e.ctrlKey || e.metaKey) && target.tagName === "A" && target.href) {
        window.open(target.href, "_blank");
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const editorConfig = {
    // html: {
    //   export: exportMap,
    //   import: constructImportMap(),
    // },
    namespace: "React.js Demo",
    nodes: [ParagraphNode, TextNode, QuoteNode, LinkNode, ImageNode],
    onError(error: Error) {
      throw error;
    },
    theme,
  };

  return (
    <>
      <div className="bg-gray-300 min-h-screen min-w-screen flex items-center justify-center">
        <LexicalComposer initialConfig={editorConfig}>
          <div className=" min-h-[50vh] w-[600px] bg-white rounded-lg shadow-lg ">
            <div className="editor-inner">
              <ToolbarPlugin />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <LinkPlugin />
              <ImagesPlugin />
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className="h-full focus:outline-none text-left min-h-[150px] p-2 absolute"
                    aria-placeholder="Enter some rich text..."
                    placeholder={
                      <div className=" top-2 left-2 text-gray-400 p-2">
                        Enter some rich text...
                      </div>
                    }
                  />
                }
                ErrorBoundary={LexicalErrorBoundary}
              />

              {/* <TreeViewPlugin /> */}
            </div>
          </div>
        </LexicalComposer>
      </div>
    </>
  );
}

const theme = {
  quote: "border-l-4 border-gray-300 text-gray-600 italic my-4 pl-4",
  link: "text-blue-600 underline hover:text-blue-800",
};
export default App;
