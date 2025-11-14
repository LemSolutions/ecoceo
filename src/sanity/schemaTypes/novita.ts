import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'novita',
  title: 'Novità',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Sottotitolo',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Immagine Principale',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'miniIntro',
      title: 'Breve Testo di Introduzione',
      type: 'text',
      rows: 3,
      description: 'Testo breve che verrà mostrato nella card dell\'archivio',
    }),
    defineField({
      name: 'fullContent',
      title: 'Contenuto Completo',
      type: 'blockContent',
      description: 'Il contenuto completo e formattato della novità',
    }),
    defineField({
      name: 'isActive',
      title: 'Attivo',
      type: 'boolean',
      initialValue: true,
      description: 'Se attivo, la novità sarà visibile nell\'archivio',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'mainImage',
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return { ...selection, subtitle: subtitle || 'Nessun sottotitolo' }
    },
  },
})

