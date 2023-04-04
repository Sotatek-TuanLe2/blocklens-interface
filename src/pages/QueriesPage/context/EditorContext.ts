import { createContext, MutableRefObject } from 'react';
import AceEditor from 'react-ace';

export type EditorContextType = {
  editor: MutableRefObject<AceEditor>;
};
export const EditorContext = createContext<EditorContextType | null>(null);
