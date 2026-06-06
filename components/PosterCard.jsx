import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getImageUrl } from '../api/tmdb';
import { Rounded, Colors } from '../constants/theme';
import { Typography } from './Typography';

export const PosterCard = ({ movie, width = 120, height = 180, rank, isLarge = false }) => {
  const router = useRouter();

  if (!movie || (!movie.poster_path && !movie.backdrop_path)) return null;

  const imageUrl = getImageUrl(isLarge ? movie.backdrop_path : movie.poster_path);

  return (
    <TouchableOpacity 
      style={[styles.container, { width: isLarge ? width * 2 : width, height }]}
      onPress={() => router.push(`/movie/${movie.id}`)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: imageUrl }} 
        style={[styles.image, { width: isLarge ? width * 2 : width, height }]} 
        resizeMode="cover"
      />
      {rank && (
        <View style={styles.rankContainer}>
          <Typography 
            variant="display" 
            style={styles.rankText}
          >
            {rank}
          </Typography>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    borderRadius: Rounded.md,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  image: {
    borderRadius: Rounded.md,
  },
  rankContainer: {
    position: 'absolute',
    bottom: -15,
    left: -10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  rankText: {
    color: Colors.canvas,
    textShadowColor: Colors.border,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontSize: 80,
  }
});
