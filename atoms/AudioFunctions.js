import { atom, selector } from 'recoil';
import {playbackOptions} from "../utils/playbackOptions";

export const currentAudioObject = atom({
    key: 'currentAudioObject',
    default: null
})

export const currentAudioInstance = atom({
    key: 'currentAudioInstance',
    default: null
})

export const currentPlaylist = atom({
    key: 'currentPlaylist',
    default: []
})

export const currentStatus = atom({
    key: 'currentStatus',
    default: null
})

// {
//     "androidImplementation": "SimpleExoPlayer",
//     "didJustFinish": false,
//     "durationMillis": 154575,
//     "isBuffering": true,
//     "isLoaded": true,
//     "isLooping": false,
//     "isMuted": false,
//     "isPlaying": true,
//     "playableDurationMillis": 65898,
//     "positionMillis": 0,
//     "progressUpdateIntervalMillis": 500,
//     "rate": 1,
//     "shouldCorrectPitch": false,
//     "shouldPlay": true,
//     "uri": "/files/ti4bwp8r/production/a70e310b2c6b1014d1972aa9ad39ee9a621a2db6.mp3",
//     "volume": 1,
// }


export const currentPlaybackOption = atom({
    key: 'currentPlaybackOption',
    default: playbackOptions[0]
})

export const downloadedAudios = atom({
    key: 'downloadedAudios',
    default: {}
})






