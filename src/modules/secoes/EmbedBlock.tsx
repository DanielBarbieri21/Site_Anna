import {
  soundcloudEmbedUrl,
  youtubeEmbedUrl,
  tiktokEmbedUrl,
  instagramEmbedUrl,
  type EmbedItem,
} from '../../lib/secoesApi'

const aspectSoundCloud = 'aspect-[4/1]'
const aspectVideo = 'aspect-video'
const aspectInstagram = 'aspect-square'

export function EmbedBlock({ item }: { item: EmbedItem }) {
  const { tipo, url, titulo } = item
  if (!url.trim()) return null

  if (tipo === 'soundcloud') {
    const embed = soundcloudEmbedUrl(url)
    return (
      <div className="space-y-2">
        {titulo && (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#a3b0c9]">{titulo}</p>
        )}
        <iframe
          title={titulo ?? 'SoundCloud'}
          src={embed}
          className={`w-full rounded-2xl border border-slate-700/50 ${aspectSoundCloud}`}
          allow="autoplay"
        />
      </div>
    )
  }

  if (tipo === 'youtube') {
    const embed = youtubeEmbedUrl(url)
    return (
      <div className="space-y-2">
        {titulo && (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#a3b0c9]">{titulo}</p>
        )}
        <iframe
          title={titulo ?? 'YouTube'}
          src={embed}
          className={`w-full rounded-2xl border border-slate-700/50 ${aspectVideo}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (tipo === 'tiktok') {
    const embed = tiktokEmbedUrl(url)
    return (
      <div className="space-y-2">
        {titulo && (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#a3b0c9]">{titulo}</p>
        )}
        <iframe
          title={titulo ?? 'TikTok'}
          src={embed}
          className={`w-full max-w-sm rounded-2xl border border-slate-700/50 ${aspectVideo}`}
          allowFullScreen
        />
      </div>
    )
  }

  if (tipo === 'instagram') {
    const embed = instagramEmbedUrl(url)
    return (
      <div className="space-y-2">
        {titulo && (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#a3b0c9]">{titulo}</p>
        )}
        <iframe
          title={titulo ?? 'Instagram'}
          src={embed}
          className={`w-full max-w-md rounded-2xl border border-slate-700/50 ${aspectInstagram}`}
          allow="encrypted-media"
        />
      </div>
    )
  }

  return null
}
