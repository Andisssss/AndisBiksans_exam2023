<template>
  <div id="songs-view" @scroll="handleScroll">
    <div class="wrapper-header">
      <h1>SONGS</h1>
      <div class="wrapper-search">
        <input id="input-search" placeholder="Search by title..." v-model="search" />
      </div>
      <div class="wrapper-settings">
        <button id="btn-show-favorites" :class="{ active: show_favorites }"
                @click="show_favorites = !show_favorites">Show Favorites</button>
      </div>
    </div>
    <div class="wrapper-songs">
      <table>
        <tr ref="header">
          <th id="th-id">#</th>
          <th id="th-title" @click="sortBy('title')" :class="{ active: sort.by === 'title' }">
            Title
            <IconCaretUp v-if="sort.by === 'title'" color="var(--c-accent-secondary)"
                         :class="{ 'flip-vertical': sort.order === 'desc' }" />
          </th>
          <th id="th-artist">Artist</th>
          <th id="th-album">Album</th>
          <th id="th-duration" @click="sortBy('duration')" :class="{ active: sort.by === 'duration' }">
            Duration
            <IconCaretUp v-if="sort.by === 'duration'" color="var(--c-accent-secondary)"
                         :class="{ 'flip-vertical': sort.order === 'desc' }" />
          </th>
        </tr>
        <tr class="song" v-for="(song, index) in filtered_songs" :key="song.id" @click="selectSong(song)"
            :class="{ active: store.getNowPlayingSongId === song.id }">
          <td id="td-index">
            <IconPlay v-if="store.getNowPlayingSongId === song.id" color="var(--c-accent-secondary)" />
            <span id="txt-index" v-else>{{ index + 1 }}</span>
          </td>
          <td id="td-title">
            <img :src="song.album.images[1].url" />
            {{ song.name }}
          </td>
          <td id="td-artist">{{ getArtists(song.artists) }}</td>
          <td id="td-album">{{ song.album.name }}</td>
          <td id="td-duration">
        {{ getTime(song.duration_ms) }}
        <IconHeart
          :class="{ active: auth.getFavoriteSongs.includes(song.id), 'not-favorite': !auth.getFavoriteSongs.includes(song.id) }"
          @click="auth.toggleFavorite(song.id)"
        />
      </td>
        </tr>
      </table>
    </div>
  </div>
</template>



<script>
import { useAuthStore } from '../stores/auth';
import { usePlayerStore } from '../stores/player';
import songsAPI from '../data/songs';
import IconPlay from '../components/icons/IconPlay.vue';
import IconCaretUp from '../components/icons/IconCaretUp.vue';
import IconHeart from '../components/icons/IconHeart.vue';

export default {
  components: { IconPlay, IconCaretUp, IconHeart },
  data() {
    const store = usePlayerStore();
    const auth = useAuthStore();
    
    return {
      store,
      auth,
      songs: [...songsAPI],
      sort: {
        by: null,
        order: 'asc'
      },
      search: '',
      clicks: 0,
      show_favorites: false
    };
  },
  methods: {
    getTime(time_in_ms) {
      const min = Math.floor(time_in_ms / 1000 / 60);
      const sec = Math.floor((time_in_ms / 1000) % 60);
      return `${min}:${sec.toString().padStart(2, '0')}`;
    },
    getArtists(artists) {
      return artists.map(artist => artist.name).join(', ');
    },
    handleScroll(event) {
      this.$refs.header.classList.value = event.target.scrollTop > 100 ? 'scrolled' : '';
    },
    sortBy(by) {
      const sortOrder = by === this.sort.by ? (this.sort.order === 'asc' ? 'desc' : 'asc') : 'asc';

      this.songs.sort((a, b) => {
        const fieldA = by === 'title' ? a.name.toLowerCase() : a.duration_ms;
        const fieldB = by === 'title' ? b.name.toLowerCase() : b.duration_ms;

        const compareValue = (fieldA - fieldB) * (sortOrder === 'asc' ? 1 : -1);

        return compareValue;
      });

      this.sort.by = by;
      this.sort.order = sortOrder;
    },
    selectSong(song) {
      this.clicks++;
      if (this.clicks === 1) {
        this.timer = setTimeout(() => {
          this.clicks = 0;
        }, 500);
      } else {
        clearTimeout(this.timer);
        this.store.setNowPlaying(song);
        this.clicks = 0;
      }
    },
  },
  mounted() {
    this.store.setPlaylist(this.songs);
  },
  computed: {
    filtered_songs() {
      return this.songs.filter(song => {
        const nameLowerCase = song.name.toLowerCase();
        const searchLowerCase = this.search.toLowerCase();
        const isFavorite = this.show_favorites ? this.auth.getFavoriteSongs.includes(song.id) : true;
        return nameLowerCase.includes(searchLowerCase) && isFavorite;
      });
    },
  },
};


</script>
<style scoped>
  .not-favorite {
    color: red; 
    opacity: 1!important; 
  }
</style>
