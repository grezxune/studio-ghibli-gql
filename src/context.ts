import { StudioGhibliApi, type StudioGhibliApiContract } from './datasources/studio-ghibli-api.js';

export interface AppContext {
  dataSources: {
    studioGhibliApi: StudioGhibliApiContract;
  };
}

export const createContext = (): AppContext => ({
  dataSources: {
    studioGhibliApi: new StudioGhibliApi(),
  },
});
