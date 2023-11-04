import { defineStore } from 'pinia'
import router from "../router"

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      name: "Andis",
      surname: "Biksans",
      code: "IT21036",
      favourite_songs: localStorage.favourite_songs ? localStorage.favourite_songs.split(",") : []
    },
    IsLoggedIn: localStorage.IsLoggedIn ?? false
  }),
  getters: {
    loggedIn() {
      return this.IsLoggedIn;
    },
    getFavoriteSongs() {
      return this.user.favourite_songs;
    }
  },
  actions: {
    setUserData(name, surname, code) {
      this.user.name = name;
      this.user.surname = surname;
      this.user.code = code;
    },
    login(email, password) {
      if (email === "admin@admin.lv" && password === "password") {
        localStorage.IsLoggedIn = true;
        this.IsLoggedIn = true;
        router.push("/");
      }
    },
    logout() {
      localStorage.clear();
      this.IsLoggedIn = false;
      router.push("/login");
    },
    toggleFavorite(songID) {
      const song_index = this.user.favourite_songs.indexOf(songID);

      if (song_index < 0) {
        this.user.favourite_songs.push(songID);
      } else {
        this.user.favourite_songs.splice(song_index, 1);
      }
      localStorage.favourite_songs = this.user.favourite_songs;
    },
  },


})