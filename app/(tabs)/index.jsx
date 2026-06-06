import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { getTopRatedMovies, getTrendingMovies, getUpcomingMovies } from '../../api/tmdb';
import { HeroBanner } from '../../components/HeroBanner';
import { RowCarousel } from '../../components/RowCarousel';
import { Typography } from '../../components/Typography';
import { Colors } from '../../constants/theme';

export default function HomeScreen() {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trendingData, topRatedData, upcomingData] = await Promise.all([
          getTrendingMovies(),
          getTopRatedMovies(),
          getUpcomingMovies(),
        ]);

        setTrending(trendingData);
        setTopRated(topRatedData);
        setUpcoming(upcomingData);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!loading && trending.length === 0 && topRated.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Typography variant="titleMd" style={{ textAlign: 'center', marginBottom: 16 }}>
          Could not load movies
        </Typography>
        <Typography variant="body" color={Colors.muted} style={{ textAlign: 'center' }}>
          Please make sure your TMDB API Key is set in the .env file. Restart the app after adding it.
        </Typography>
      </View>
    );
  }

  // Pick a random trending movie for the hero banner
  const heroMovie = trending.length > 0 ? trending[Math.floor(Math.random() * Math.min(5, trending.length))] : null;

  return (
    <ScrollView style={styles.container} bounces={false}>
      <HeroBanner movie={heroMovie} />
      <View style={styles.content}>
        <RowCarousel title="Trending Now" data={trending} isLarge />
        <RowCarousel title="Top Rated" data={topRated} showRank />
        <RowCarousel title="Upcoming Releases" data={upcoming} />
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
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.canvas,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    paddingBottom: 40,
    marginTop: -20, // Overlap slightly with hero banner
  }
});
