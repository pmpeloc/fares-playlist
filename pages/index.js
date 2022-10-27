import { Fragment } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const YOUTUBE_PLAYLIST_BY_CHANNEL =
  'https://www.googleapis.com/youtube/v3/playlists';
const YOUTUBE_PLAYLIST_ITEMS_API =
  'https://www.googleapis.com/youtube/v3/playlistItems';
const YOUTUBE_FARES_CHANNEL = 'UCLpt4Lc1xprVmhAUoVq1PjA';

const getData = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const getPlaylistByChannel = async (channels) => {
  return await Promise.all(
    channels.map(async (channel) => {
      const url = `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&maxResults=50&playlistId=${channel.id}&key=${process.env.YOUTUBE_API_KEY}`;
      const data = await getData(url);
      channel.videos = data.items;
      return channel;
    })
  );
};

export async function getServerSideProps() {
  const dataChannel = await getData(
    `${YOUTUBE_PLAYLIST_BY_CHANNEL}?part=snippet&maxResults=50&channelId=${YOUTUBE_FARES_CHANNEL}&key=${process.env.YOUTUBE_API_KEY}`
  );
  const dataPlaylist = await getPlaylistByChannel(dataChannel.items);
  const playlists = [];
  for (const item of dataPlaylist) {
    playlists.push(item);
  }
  return {
    props: {
      data: {
        channelId: dataChannel.items[0].snippet.channelId,
        channelTitle: dataChannel.items[0].snippet.channelTitle,
        playlists,
      },
    },
  };
}

export default function Home({ data }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>FARES | Coding Bootcamp</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Fares Coding Bootcamp</h1>

        {data.playlists.map(({ snippet = {}, videos }, index) => {
          const { title } = snippet;
          return (
            <Fragment key={index}>
              <h2>
                <span className={styles.decorator}>Playlist:</span>{' '}
                <span className={styles.subtitle}>{title}</span>
              </h2>
              <ul key={index} className={styles.grid}>
                {videos.map(({ snippet = {} }, index) => {
                  const { title, thumbnails = {}, resourceId = {} } = snippet;
                  const { medium } = thumbnails;
                  return (
                    <li key={index} className={styles.card}>
                      <a
                        href={`https://www.youtube.com/watch?v=${resourceId.videoId}`}>
                        <p>
                          <img
                            width={medium?.width}
                            height={medium?.height}
                            src={medium?.url}
                            alt={title}
                          />
                        </p>
                        <h3 className={styles.videoTitle}>{title}</h3>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Fragment>
          );
        })}
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'>
          Hecho con ❤️ por{' '}
          <img src='/logo-fares.svg' alt='FARES' className={styles.logo} />{' '}
          Fares Bootcamp
        </a>
      </footer>
    </div>
  );
}
