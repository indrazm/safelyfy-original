import { supabase } from "./client"

const uploadFile = async ({ bucket, file, fileName }: { bucket: string; file: File; fileName: string }) => {
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
    })
    return { data, error }
}

export const handleUploadFiles = ({ bucket, files, folderId }: { bucket: string; files: File[]; folderId: string }) => {
    files.forEach((file) => {
        uploadFile({ file, bucket, fileName: `${folderId}/${file.name}` })
    })
}

export const listingFiles = async ({ bucket, folderId }: { bucket: string; folderId: string }) => {
    const { data, error } = await supabase.storage.from(bucket).list(folderId, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
    })
    return { data, error }
}
