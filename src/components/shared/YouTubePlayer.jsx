import { getYouTubeEmbedUrl } from '@/utils/youtubeUtils';

const YouTubePlayer = ({ url, title = 'YouTube Video', className = '' }) => {
  const embedUrl = getYouTubeEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className={`bg-gray-100 p-4 rounded-lg text-center ${className}`}>
        <p className="text-red-500">Invalid YouTube URL</p>
        <p className="text-sm text-gray-600 mt-2">{url}</p>
      </div>
    );
  }

  return (
    <div className={`youtube-player-wrapper ${className}`}>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default YouTubePlayer;
