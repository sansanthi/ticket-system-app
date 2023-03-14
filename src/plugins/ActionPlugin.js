import { $createCodeNode, $isCodeNode } from "@lexical/code";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTextNode, $getRoot } from "lexical";
import { useCallback, useEffect } from "react";
import { PLAYGROUND_TRANSFORMERS } from "./MarkdownTransformers.ts";
import { TRANSFORMERS } from "@lexical/markdown";

export default function ActionPlugin({ onChangeMarkdown, descriptionText }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    console.log("Action plugins: ");
    editor.registerUpdateListener(({ editorState }) => {
     
      console.log('read ediorstate working')
      editorState.read(() => {
        const markdown = $convertToMarkdownString(PLAYGROUND_TRANSFORMERS);
        onChangeMarkdown(markdown);
        
      });
    });

    editor.update(() => {
      console.log('update editor sdtate working')
      $convertFromMarkdownString(descriptionText, PLAYGROUND_TRANSFORMERS);
    });
  }, [editor]);
}

