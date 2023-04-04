import { createContext, MutableRefObject } from 'react';
import AceEditor from 'react-ace';

export type EditorContextType = {
  editor: MutableRefObject<AceEditor>;
  queryValues: unknown[];
};
export const EditorContext = createContext<EditorContextType | null>(null);
