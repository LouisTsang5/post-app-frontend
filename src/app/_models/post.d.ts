export interface Post {
    id: string,
    title: string,
    content: string,
    multiMedia?: MultiMedia[],
}

export interface PostFormData {
    title: string,
    content: string,
    multimedia?: File[],
}

export interface MultiMedia {
    id: string,
    index: number,
}