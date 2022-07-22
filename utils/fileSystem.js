import * as FileSystem from "expo-file-system";

export const fetchDownloaded = async setDownloaded => {
    const arr = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory).catch(e => console.log(e))
    const result = {}
    for(let i = 0; i<arr.length; i++) {
        const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + arr[i]).catch(e => console.log(e))
        result[arr[i]] = info
    }
    await setDownloaded(result)
}
