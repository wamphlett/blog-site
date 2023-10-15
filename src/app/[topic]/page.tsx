import PrimaryLayout from '@/layouts/primary';
import { getBlurUrl } from '../loaders';
import Title from '@/components/title';
import Article from '@/components/article';
import { callApi } from '@/util/API';
import Sidebar from '@/components/sidebar';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type PageProps = {
  params: {
    topic: string;
  };
};

async function getData(topic: string) {
  const res = await callApi(`/topics/${topic}`, 600);

  if (!res) {
    throw new Error('Failed to fetch data');
  }

  return res;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  let data;
  try {
    data = await getData(params.topic);
  } catch (e) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist',
    };
  }

  return {
    title: `${data.title} | Warren Amphlett Blog`,
  };
}

export default async function Page({ params }: PageProps) {
  let data;
  try {
    data = await getData(params.topic);
  } catch (e) {
    return notFound();
  }

  const headerURL =
    data.image ||
    'https://library.wamphlett.net/photos/website/2023/albania/ksamil.jpg';
  const blurDataURL = await getBlurUrl(headerURL);

  return (
    <PrimaryLayout
      headerImageBlurDataURL={blurDataURL!}
      headerImageUrl={headerURL}
      sidebar={<Sidebar currentUrl={`/${params.topic}`} topic={params.topic} />}
    >
      <Title subtitle={data.description} title={data.title} />

      <Article html={data.html} />
    </PrimaryLayout>
  );
}
