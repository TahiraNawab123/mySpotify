export interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  liked?: boolean
  imageUrl?: string
}

export interface Playlist {
  id: string
  name: string
  songs: string[]
  createdAt: Date
}
