import {Audio} from "expo-av";

export const onPlay = async (audioInstance, setAudioInstance, audioObj, soundItem, currStatus, setStatus) => {
    if(!audioInstance) {
        try {
            const {soundObject} = await Audio.Sound.createAsync({uri: audioObj.audioUrl}, {shouldPlay: true})
            await setAudioInstance(soundObject)
            await setStatus(soundObject)
            await soundObject.playAsync()
        }
        catch (e){
            console.log(e)
        }
    }
    else if(currStatus.isLoaded && currStatus.isPlaying) {
        try {
            const status = await audioInstance.setStatusAsync({shouldPlay: false})
            await setStatus(status)
        }
        catch (e) {
            console.log(e)
        }
    }
    else if(currStatus.isLoaded && !currStatus.isPlaying && audioObj.audioUrl === soundItem.audioUrl){
        try{
            const status = await audioInstance.playAsync()
            await setStatus(status)
        }
        catch (e) {
            console.log(e)
        }
    }
}
