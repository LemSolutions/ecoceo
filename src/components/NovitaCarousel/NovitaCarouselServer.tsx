import NovitaCarouselClient from './index';
import { novitaQuery } from '@/sanity/lib/queries';
import { sanityFetch } from '@/lib/sanityFetch';

const NovitaCarouselServer = async () => {
  const novita = await sanityFetch(novitaQuery, {}, { revalidate: 600 });
  return <NovitaCarouselClient initialItems={novita || []} />;
};

export default NovitaCarouselServer;

