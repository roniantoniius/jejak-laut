import { RouteProp } from '@react-navigation/native';

export type Note = {
    id: string;
} & NoteData;

export type NoteData = {
    id: string;
    title: string;
    markdown: string;
    tags: Tag[];
    longitude: number;
    latitude: number;
    lastModified: string;
};

export type Tag = {
    id: string;
    label: string;
    color: string;
};

export interface NewNoteRouteParams {
    latitude?: number;
    longitude?: number;
}

export type RootStackParamList = {
    newnote: NewNoteRouteParams;
    // Add other routes here if needed
  };
  
  export type NewNoteRouteProp = RouteProp<RootStackParamList, 'newnote'>;