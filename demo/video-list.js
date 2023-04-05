export default [
  {
    title: 'Hello',
    artist: 'Adele',
    isVideo: true,
    poster: 'https://www.vidlii.com/usfi/prvw/ztc8CefviYF.jpg',
    src: ['https://www.vidlii.com/usfi/v/3lEVk36WBQf.N-XAsDPW2aikTl64QnDUoSRwCOEgLkOoN8COl88f-Xb90egFcWj3AtXsI5j5fwKFHbLhm0yPzjFrr7Nz.mp4'],
    tracks: [
      {
        default: true,
        kind: "subtitles",
        srclang: "en",
        src: "vvt/hello-en.vtt",
        label: 'English'
      },
      {
        default: false,
        kind: "subtitles",
        srclang: "zh",
        src: "vvt/hello-zh.vtt",
        label: '简体中文'
      }
    ]
  },
  {
    title: 'Mountains',
    artist: 'Test',
    isVideo: true,
    src: ['https://www.javatpoint.com/oprweb/movie.mp4']
  },
  {
    title: 'Incredibles Teaser',
    artist: 'Pixar',
    isVideo: true,
    poster: 'http://www.jplayer.org/video/poster/Incredibles_Teaser_640x272.png',
    src: ['http://www.jplayer.org/video/m4v/Incredibles_Teaser.m4v', 'http://www.jplayer.org/video/ogv/Incredibles_Teaser.ogv', 'http://www.jplayer.org/video/webm/Incredibles_Teaser.webm']
  },
  {
    title: 'Big Buck Bunny Trailer',
    artist: 'Blender Foundation',
    poster: 'http://www.jplayer.org/video/poster/Big_Buck_Bunny_Trailer_480x270.png',
    isVideo: true,
    src: ['http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v', 'http://www.jplayer.org/video/ogv/Big_Buck_Bunny_Trailer.ogv', 'http://www.jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm']
  },
  {
    title: 'ABC News Live',
    artist: 'ABC News',
    isVideo: true,
    src: 'https://abc-iview-mediapackagestreams-2.akamaized.net/out/v1/6e1cc6d25ec0480ea099a5399d73bc4b/index.m3u8',
  }
];