import { Dimensions, Image, StyleSheet, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getImageUrl } from '../api/tmdb';
import { Colors, Spacing } from '../constants/theme';
import { Button } from './Button';
import { Typography } from './Typography';

const { width, height } = Dimensions.get('window');

export const HeroBanner = ({ movie }) => {
  const router = useRouter();

  if (!movie) return null;

  const imageUrl = getImageUrl(movie.poster_path, 'original') || getImageUrl(movie.backdrop_path, 'original');

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      {/* Fallback gradient if expo-linear-gradient is not present, but we will assume it is or use standard View */}
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Typography variant="headlineLg" style={styles.title} numberOfLines={2}>
            {movie.title || movie.name}
          </Typography>

          <View style={styles.tagsContainer}>
            <Typography variant="label" style={styles.tag}>
              {movie.release_date?.substring(0, 4)}
            </Typography>
            <View style={styles.dot} />
            <Typography variant="label" style={styles.tag}>
              Rating: {movie.vote_average?.toFixed(1)}
            </Typography>
          </View>

          <View style={styles.actions}>
            <Button
              title="Play"
              icon={<Ionicons name="play" size={24} color={Colors.onPrimary} />}
              onPress={() => router.push(`/movie/${movie.id}?play=true`)}
              style={styles.actionButton}
            />
            <Button
              title="My List"
              variant="secondary"
              icon={<Ionicons name="add" size={24} color={Colors.onDark} />}
              onPress={() => { }}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: height * 0.65,
    backgroundColor: Colors.canvas,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.heroOverlay,
    justifyContent: 'flex-end',
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  tag: {
    color: Colors.muted,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.muted,
    marginHorizontal: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  actionButton: {
    minWidth: 120,
  }
});
