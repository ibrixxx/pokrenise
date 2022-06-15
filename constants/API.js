const sanityProjectId = 'ti4bwp8r'
const sanityDataset = 'production'
const sanityGetEndpoint = `https://${sanityProjectId}.api.sanity.io/v2021-06-07/data/query/${sanityDataset}?query=`
const getAudioQuery = '*[_type == \'audio\']{...,"imageUrl": image.asset->url,"audioUrl": audio.asset->url}'

export const getAudio = sanityGetEndpoint + getAudioQuery
