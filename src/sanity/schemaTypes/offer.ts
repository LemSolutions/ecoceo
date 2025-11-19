import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'offer',
  title: 'Offerte',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: Rule => Rule.required(),
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
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'highlight',
      title: 'Messaggio Evidenziato',
      type: 'string',
      description: 'Breve testo da mostrare nel badge o sopra il titolo',
    }),
    defineField({
      name: 'mainImage',
      title: 'Immagine',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Descrizione Breve',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'details',
      title: 'Dettagli Completi',
      type: 'blockContent',
      description: 'Contenuto formattato per la pagina singola',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Testo CTA',
      type: 'string',
      initialValue: 'Richiedi Preventivo',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'URL CTA',
      type: 'url',
      description: 'Lascia vuoto per usare mailto predefinito',
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'Es. -20%, Solo per oggi, etc.',
    }),
    defineField({
      name: 'priceOriginal',
      title: 'Prezzo Originale',
      type: 'number',
    }),
    defineField({
      name: 'priceDiscounted',
      title: 'Prezzo Scontato',
      type: 'number',
    }),
    defineField({
      name: 'startDate',
      title: 'Data Inizio',
      type: 'datetime',
    }),
    defineField({
      name: 'endDate',
      title: 'Data Fine',
      type: 'datetime',
    }),
    defineField({
      name: 'priority',
      title: 'Priorità',
      type: 'number',
      initialValue: 0,
      description: 'Valori più alti vengono mostrati per primi nel popup',
    }),
    defineField({
      name: 'showInHomepage',
      title: 'Mostra in homepage',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'isActive',
      title: 'Attiva',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'mainImage',
      badge: 'badge',
    },
    prepare({ title, subtitle, badge, media }) {
      return {
        title,
        subtitle: badge ? `${badge} · ${subtitle || ''}` : subtitle,
        media,
      }
    },
  },
})

