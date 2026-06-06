import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { getImageUrl, getMovieDetails } from '../../api/tmdb';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { Colors, Rounded, Spacing } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function MovieDetailScreen() {
  const { id, play } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(play === 'true');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  const onStateChange = useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  if (loading || !movie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Find trailer
  const videos = movie.videos?.results || [];
  const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube') || videos[0];

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={Colors.onDark} />
        </TouchableOpacity>
      </View>

      {playing && trailer ? (
        <View style={styles.playerContainer}>
          <YoutubePlayer
            height={width * (9 / 16)}
            play={playing && isReady}
            videoId={trailer.key}
            onChangeState={onStateChange}
            onReady={() => setIsReady(true)}
          />
        </View>
      ) : (
        <View style={styles.backdropContainer}>
          <Image
            source={{ uri: getImageUrl(movie.backdrop_path, 'original') }}
            style={styles.backdrop}
          />
          <View style={styles.backdropOverlay} />
        </View>
      )}

      <View style={styles.content}>
        <Typography variant="headlineLg" style={styles.title}>
          {movie.title || movie.name}
        </Typography>

        <View style={styles.metaRow}>
          <Typography variant="label" style={styles.metaText} color={Colors.success}>
            {movie.vote_average ? `${(movie.vote_average * 10).toFixed(0)}% Match` : 'New'}
          </Typography>
          <Typography variant="label" style={styles.metaText}>
            {movie.release_date?.substring(0, 4)}
          </Typography>
          <View style={styles.badge}>
            <Typography variant="legal" color={Colors.muted}>
              {movie.adult ? '18+' : '13+'}
            </Typography>
          </View>
          <Typography variant="label" style={styles.metaText}>
            {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : ''}
          </Typography>
        </View>

        {!playing && trailer && (
          <Button
            title="Play Trailer"
            icon={<Ionicons name="play" size={24} color={Colors.onPrimary} />}
            onPress={() => setPlaying(true)}
            style={styles.playButton}
          />
        )}
        {!playing && !trailer && (
          <Button
            title="Trailer Not Available"
            variant="secondary"
            style={styles.playButton}
          />
        )}

        <Typography variant="body" style={styles.overview}>
          {movie.overview}
        </Typography>

        <View style={styles.genresRow}>
          <Typography variant="label" color={Colors.muted}>
            Genres: {movie.genres?.map(g => g.name).join(', ')}
          </Typography>
        </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.canvas,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: Rounded.pill,
    padding: 4,
  },
  playerContainer: {
    width: '100%',
    backgroundColor: Colors.ink,
    marginTop: 60, // Space for close button
  },
  backdropContainer: {
    width: '100%',
    height: width * (9 / 16),
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  metaText: {
    color: Colors.muted,
  },
  badge: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: Rounded.sm,
  },
  playButton: {
    marginBottom: Spacing.lg,
  },
  overview: {
    marginBottom: Spacing.lg,
  },
  genresRow: {
    marginBottom: Spacing.xl,
  }
});
