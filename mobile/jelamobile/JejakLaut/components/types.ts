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