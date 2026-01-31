import { Song } from '@/types'

// In-memory storage for demo
let songs: Song[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    liked: false,
  },
  {
    id: '2',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    liked: false,
  },
  {
    id: '3',
    title: 'Good as Hell',
    artist: 'Lizzo',
    album: 'Cuz I Love You',
    duration: 206,
    liked: false,
  },
  {
    id: '4',
    title: 'Peaches',
    artist: 'Justin Bieber ft. Daniel Caesar, Giveon',
    album: 'Justice',
    duration: 198,
    liked: false,
  },
  {
    id: '5',
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    album: 'Midnights',
    duration: 214,
    liked: false,
  },
]

export async function GET() {
  return Response.json(songs)
}

export async function POST(request: Request) {
  const song: Song = await request.json()
  const newSong = {
    ...song,
    id: Date.now().toString(),
  }
  songs.push(newSong)
  return Response.json(newSong, { status: 201 })
}

export async function PUT(request: Request) {
  const updatedSong: Song = await request.json()
  songs = songs.map(s => (s.id === updatedSong.id ? updatedSong : s))
  return Response.json(updatedSong)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  songs = songs.filter(s => s.id !== id)
  return Response.json({ success: true })
}
