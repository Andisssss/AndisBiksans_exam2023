import { reactive } from 'vue'
import router from '../router'

export const auth = reactive({
  user: {
    name: 'Andis',
    surname: 'Biksans',
    code: 'IT21036',
    liked_songs: localStorage.liked_songs ? localStorage.liked_songs.split(',') : []
  },
  isLogged: localStorage.isLogged ?? false,
  setUserData(name, surname, code) {
    this.user.name = name
    this.user.surname = surname
    this.user.code = code
  },
  login(email, password) {
    if (email === 'admin@admin.lv' && password === 'password') {
      localStorage.isLogged = true
      this.isLogged = true
      router.push('/')
    }
  },
  logout() {
    localStorage.clear()
    this.isLogged = false

    router.push('/login')
  },
  toggleFavorite(songID) {
    console.log(this.user.liked_songs)
    const song_index = this.user.liked_songs.indexOf(songID)

    if (song_index < 0) {
      this.user.liked_songs.push(songID)
    } else {
      this.user.liked_songs.splice(song_index)
    }

    localStorage.liked_songs = this.user.liked_songs
  },
  getFavoriteSongs() {
    return this.user.liked_songs
  }
})
