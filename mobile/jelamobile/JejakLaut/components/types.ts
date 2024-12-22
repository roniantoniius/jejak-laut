export type Note = {
    id: string;
} & NoteData;

export type NoteData = {
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
};