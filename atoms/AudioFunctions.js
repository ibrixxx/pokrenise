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

export const currentPlaybackOption = atom({
    key: 'currentPlaybackOption',
    default: playbackOptions[0]
})






