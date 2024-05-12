import { createContext, useContext } from 'react';

type IContext = {
  metaplex: any;
};

const DEFAULT_CONTEXT: IContext = {
  metaplex: null,
};

export const MetaplexContext = createContext(DEFAULT_CONTEXT);

export function useMetaplex() {
  return useContext(MetaplexContext);
}
