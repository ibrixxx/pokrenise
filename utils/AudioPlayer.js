import {Audio} from "expo-av";

const onPlaybackStatusUpdate = (status, setStatus) => {
    if(status.isLoaded) {
        setStatus(status)
        if(status.didJustFinish && !status.isLooping) {
            setStatus(status)
        }
    }
    else
        if(status.error) {
            console.log('FATAL ERROR ' + status.error)
        }
}

export const loadPlaybackInstance = async (audioInstance, setAudioInstance, audioObj, shouldPlay, setStatus) => {
    if(audioInstance !== null) {
        await audioInstance.unloadAsync()
        setAudioInstance(null)
    }
    const initalStatus = {
        shouldPlay: shouldPlay,
        rate: 1.0,
        volume: 1.0,
        isMuted: false,
        isLooping: false,
        // shouldCorrectPitch: false
    }
    const {sound, status} = await Audio.Sound.createAsync(
        {uri: audioObj.audioUrl},
        initalStatus,
        (status) => onPlaybackStatusUpdate(status, setStatus)
    )
    setAudioInstance(sound)
}

export const onPlay = async (audioInstance, currentStatus) => {
    if(audioInstance !== null) {
        if(currentStatus.isPlaying)
            audioInstance.pauseAsync()
        else
            audioInstance.playAsync()
    }
}
