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

export interface EditNoteRouteParams {
    id: string;
    latitude?: number;
    longitude?: number;
}

export interface PeriksaLokasiRouteParams {
    id: string;
}

export type RootStackParamList = {
    newnote: NewNoteRouteParams;
    ['edit/[id]']: EditNoteRouteParams;
    ['periksalokasi/[id]']: PeriksaLokasiRouteParams;
};

export type NewNoteRouteProp = RouteProp<RootStackParamList, 'newnote'>;
export type EditNoteRouteProp = RouteProp<RootStackParamList, 'edit/[id]'>;
export type PeriksaLokasiRouteProp = RouteProp<RootStackParamList, 'periksalokasi/[id]'>;