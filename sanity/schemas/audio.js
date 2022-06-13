import {MdAudiotrack as icon} from 'react-icons/md'

export default {
  name: 'audio',
  title: 'AUDIO',
  type: 'document',
  icon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Naziv audio fajla',
    },
    // {
    //   name: 'movie',
    //   title: 'Movie',
    //   type: 'reference',
    //   to: [{type: 'movie'}],
    //   description: 'Which movie are we screening',
    // },
    {
      name: 'published',
      title: 'Published',
      type: 'boolean',
      description: 'Da li je vidljiv korisnicima',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'Textualni opis audio fajla',
    },
    {
      name: 'views',
      title: 'Views',
      type: 'number',
      editable: false,
      description: 'Broj pregleda',
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Muzika', value: 'muzika'},
          {title: 'Motivakcija', value: 'motivakcija'},
          {title: 'Podcast', value: 'podcast'},
        ],
        layout: 'radio',
      },
    },
    {
      name: 'free',
      title: 'Free',
      type: 'boolean',
      description: 'Da li je besplatno',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Naslovna fotografija',
    },
    {
      name: 'audio',
      title: 'Audio',
      type: 'file',
      description: 'mp3 audio fajl',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
}
