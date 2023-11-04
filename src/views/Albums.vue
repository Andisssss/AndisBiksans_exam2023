<template>
  <div id="album-view">
    <div class="wrapper-header">
      <h1>ALBUMS</h1>
      <div class="settings">
        <button id="btn-grid" :class="{ active: is_grid }" @click="toggleView(true)">
          <IconGrid />
        </button>
        <button id="btn-list" :class="{ active: !is_grid }" @click="toggleView(false)">
          <IconList />
        </button>
      </div>
    </div>
    <ul id="list-albums" :class="{ grid: is_grid }">
      <li class="album" v-for="album in albums" @click="selectAlbum(album.id)" :class="{ active: isAlbumActive(album) }">
        <img id="img-album" :src="album.images[0].url" />
        <div class="album-info">
          <h4 id="txt-album-name" :class="{active: isAlbumActive(album)}">{{ album.name }}</h4>
          <p id="txt-album-artists">{{ getAlbumArtists(album.artists) }}</p>
          <div class="album-year">
            <p id="txt-album-year">{{ getAlbumYear(album.release_date) }}</p>
            <p id="txt-album-tracks">{{ getTrackCountText(album) }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import songList from '../data/songs';
import IconGrid from '../components/icons/IconGrid.vue';
import IconList from '../components/icons/IconList.vue';
import { usePlayerStore } from '../stores/player';

export default {
  components: { IconGrid, IconList },
  data() {
    return {
      store: usePlayerStore(),
      is_grid: true,
      clicks: 0,
    };
  },
  methods: {
    toggleView(isGrid) {
      this.is_grid = isGrid;
    },
    songsToAlb(songs) {
  return songs.reduce((accumulator, currentSong) => {
    const { album } = currentSong;
    const albumID = album.id;
    if (!accumulator[albumID]) {
      accumulator[albumID] = { ...album, tracks: [] };
    }
    accumulator[albumID].tracks.push(currentSong);
    return accumulator;
  }, {});
},
    getAlbumArtists(artists) {
      return artists.map(artist => artist.name).join(', ');
    },
    getAlbumYear(date) {
      return new Date(date).getFullYear();
    },
    isAlbumActive(album) {
      return this.store.getNowPlayingAlbumID === album.id;
    },
    selectAlbum(albumID) {
      this.clicks++;
      if (this.clicks === 1) {
        setTimeout(() => (this.clicks = 0), 500);
      } else {
        clearTimeout(this.timer);
        const album = this.albums[albumID];
        this.store.setPlaylist(album.tracks);
        this.store.setNowPlaying(album.tracks[0]);
        this.clicks = 0;
      }
    },
    getTrackCountText(album) {
      const trackCount = album.tracks.length;
      return `${trackCount} ${trackCount > 1 ? 'songs' : 'song'}`;
    },
  },
  computed: {
    albums() {
      return this.songsToAlb(songList);
    },
  },
};

</script>