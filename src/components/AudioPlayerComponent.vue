<script>
import { mapState, mapActions } from 'pinia';
import { usePlayerStore } from '@/stores/player';
import IconPlay from './icons/IconPlay.vue';
import IconPause from './icons/IconPause.vue';
import IconNext from './icons/IconNext.vue';
import IconPrev from './icons/iconprevious.vue';

export default {
  props: ["song_preview_url"],
  components: { IconPlay, IconPause, IconNext, IconPrev },
  data() {
    return {
      time: undefined,
      btn_prev: undefined,
      btn_next: undefined,
      is_playing: false,
      audio_playback: undefined,
      audio_time: 0,
      audio_length: 0,
    };
  },
  mounted() {
    // Add a keydown event listener to the window
    window.addEventListener('keydown', this.handleKeyDown);
  },
  unmounted() {
    clearInterval(this.audio_playback);
  },
  beforeUnmount() {
    // Remove the keydown event listener when the component is unmounted
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    handleKeyDown(event) {
      if (event.keyCode === 32) {
        event.preventDefault();
        this.togglePlay();
      }
    },
    ...mapActions(usePlayerStore, {
      setNowPlaying: "setNowPlaying",
      resetNowPlaying: "resetNowPlaying",
    }),

    playSong(preview) {
      this.is_playing = true;
      this.$refs.audio.src = preview;

      this.$refs.audio.play();

      // Start interval
      this.audio_playback = setInterval(() => {
        this.audio_time = Math.round(this.$refs.audio.currentTime);
        this.audio_length = Math.round(this.$refs.audio.duration);

        this.$refs.time.style.width = (this.audio_time * 100) / this.audio_length + '%';

        if (this.audio_time === this.audio_length) {
          if (this.next_song) {
            return this.setNowPlaying(this.next_song);
          }

          this.togglePlay();

          this.is_playing = false;
          this.$refs.time.style.width = 0;

          return this.resetNowPlaying();
        }
      }, 10)
    },
    togglePlay() {
      clearInterval(this.audio_playback);

      this.is_playing = !this.is_playing;

      if (this.is_playing) this.$refs.audio.play();
      else this.$refs.audio.pause();
    }

  },
  computed: {   
    ...mapState(usePlayerStore, {
      now_playing: "getNowPlaying",
      now_playing_song_id: "getNowPlayingSongId",
      song_preview: "getNowPlayingSongPreview",
      now_playing_song_image: "getNowPlayingSongImage",
      now_playing_song_name: "getNowPlayingSongName",
      now_playing_artists: "getNowPlayingArtists",
      next_song: "getNextSong",
      previous_song: "getPreviousSong",
    }),
    get_playback_time() {
      return `0:${this.audio_time.toString().length === 1 ? `0${this.audio_time}` : this.audio_time}`
    },
    get_audio_length() {
      return `0:${this.audio_length.toString().length === 1 ? `0${this.audio_length}` : this.audio_length}`
    }
  },
  watch: {
    song_preview(newValue) {
      this.playSong(newValue);
    }
  }
}
</script>

<template>
  <div id="audio-player">
    <audio ref="audio" preload>
      <source :src="song_preview" type="audio/mpeg" />
    </audio>
    <div id="controls">
      <div class="wrapper-song-info">
        <img :src="now_playing_song_image" alt="" />
        <div class="song-info">
          <p class="song-title">{{ now_playing_song_name }}</p>
          <p class="song-artists">{{ now_playing_artists }}</p>
        </div>
      </div>
      <div class="wrapper-playback-controls">
        <div class="playback-controls">
          <button ref="prev" class="prev" @click="setNowPlaying(previous_song)" :disabled="!previous_song">
            <IconPrev color="#FFF" width="60%" />
          </button>
          <button ref="play" class="play" @click="togglePlay()" :disabled="!now_playing_song_id">
            <IconPause v-if="is_playing" color="#FFF" width="60%" />
            <IconPlay v-else color="#FFF" width="60%" />
          </button>
          <button ref="next" class="next" @click="setNowPlaying(next_song)" :disabled="!next_song">
            <IconNext color="#FFF" width="60%" />
          </button>
        </div>
        <div class="wrapper-audio-track">


          <p>{{ get_playback_time }}</p>

          <div ref="audio-track" class="audio-track">
            <div ref="time" class="time"></div>
          </div>
          <p>{{ get_audio_length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>

#audio-player {
  height: 100%;
  width: 100%;
  padding: 0 1rem;
  border-top: 1px solid var(--c-accent);
  background-color: var(--c-dark);

  #controls {
    display: flex;
    height: 100%;
    align-items: center;
    position: relative;

    .wrapper-song-info {
      display: flex;
      align-items: center;
      width: 30%;
      position: absolute;
      padding-right: 1rem;
      height: inherit;

      img {
        height: 70%;
        width: auto;
        border-radius: .25rem;
        margin-right: 1rem;
        z-index: 0;
        filter: drop-shadow(10px 20px 30px rgba(144, 64, 241, .4));
      }

      .song-info {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 2rem;

        .song-title {
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .song-artists {
          opacity: .8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .wrapper-playback-controls {
      width: 40%;
      margin: 0 30% 0 auto;

      .playback-controls {
        display: flex;
        width: 100%;
        justify-content: center;
        margin-bottom: .5rem;
      }

      .wrapper-audio-track {
        display: flex;
        align-items: center;

        p {
          font-size: .8rem;
          line-height: normal;
          padding-bottom: .2rem;
          font-weight: 600;

          &:last-child {
            opacity: .5;
          }
        }

        .audio-track {
          width: 100%;
          height: 4px;
          background-color: var(--c-secondary);
          border-radius: 2rem;
          margin: 0px .5rem;

          .time {
            width: 0;
            height: 4px;
            background-color: var(--c-white);
            border-radius: 2rem;
            filter: drop-shadow(0 0px 5px rgb(255 255 255 / 20%));
          }
        }
      }
    }

    .play,
    .next,
    .prev {
      margin-right: .5rem;
      border-radius: .35rem;
      background-color: transparent;
      height: 36px;
      width: 36px;
      display: flex;
      align-items: center;
      justify-content: center;

      &[disabled] {
        box-shadow: none;
        opacity: .4;
        cursor: default;
      }

    }

    .play {
      background-color: var(--c-primary);
      filter: drop-shadow(0px 4px 10px rgba(144, 64, 241, .1));
    }
  }
}

</style>
