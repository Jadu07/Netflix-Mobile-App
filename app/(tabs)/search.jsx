import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTrendingMovies, searchMovies, discoverMovies, getGenres } from '../../api/tmdb';
import { PosterCard } from '../../components/PosterCard';
import { Typography } from '../../components/Typography';
import { Colors, Rounded, Spacing } from '../../constants/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const insets = useSafeAreaInsets();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const genreData = await getGenres();
        setGenres(genreData);
      } catch (e) {
        console.error('Error fetching genres:', e);
      }
    };
    fetchInitialData();
  }, []);

  const handleSearch = async (text, genre = selectedGenre, year = selectedYear) => {
    setLoading(true);
    setIsFallback(false);
    try {
      let data = [];
      if (text.trim() === '') {
        if (genre || year) {
          data = await discoverMovies(genre, year);
        } else {
          data = await getTrendingMovies();
        }
      } else {
        data = await searchMovies(text, year);
        if (genre) {
          data = data.filter(movie => movie.genre_ids?.includes(genre));
        }
      }

      if (data && data.length > 0) {
        const slicedData = data.slice(0, data.length - (data.length % 3));
        setResults(slicedData);
      } else {
        const fallbackData = await getTrendingMovies();
        const slicedFallback = fallbackData.slice(0, fallbackData.length - (fallbackData.length % 3));
        setResults(slicedFallback);
        setIsFallback(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(query, selectedGenre, selectedYear);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, selectedGenre, selectedYear]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.md) }]}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.muted} />
          <TextInput
            style={styles.input}
            placeholder="Search movies..."
            placeholderTextColor={Colors.muted}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.muted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            <TouchableOpacity 
              style={[styles.chip, !selectedGenre && styles.chipActive]} 
              onPress={() => setSelectedGenre(null)}
            >
              <Typography variant="label" color={!selectedGenre ? Colors.canvas : Colors.onDark}>All Genres</Typography>
            </TouchableOpacity>
            {genres.map(g => (
              <TouchableOpacity 
                key={g.id} 
                style={[styles.chip, selectedGenre === g.id && styles.chipActive]} 
                onPress={() => setSelectedGenre(g.id)}
              >
                <Typography variant="label" color={selectedGenre === g.id ? Colors.canvas : Colors.onDark}>{g.name}</Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            <TouchableOpacity 
              style={[styles.chip, !selectedYear && styles.chipActive]} 
              onPress={() => setSelectedYear(null)}
            >
              <Typography variant="label" color={!selectedYear ? Colors.canvas : Colors.onDark}>All Years</Typography>
            </TouchableOpacity>
            {years.map(y => (
              <TouchableOpacity 
                key={y} 
                style={[styles.chip, selectedYear === y && styles.chipActive]} 
                onPress={() => setSelectedYear(y)}
              >
                <Typography variant="label" color={selectedYear === y ? Colors.canvas : Colors.onDark}>{y}</Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <>
          {isFallback && (query.length > 0 || selectedGenre || selectedYear) && (
            <View style={styles.fallbackMessage}>
              <Typography variant="bodyStrong" color={Colors.onDark}>
                No exact matches found.
              </Typography>
              <Typography variant="body" color={Colors.muted} style={{ marginTop: 4 }}>
                Explore these popular titles instead:
              </Typography>
            </View>
          )}
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <View style={styles.itemWrapper}>
                <PosterCard movie={item} width={105} height={160} />
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.center}>
                <Typography variant="body" color={Colors.muted}>
                  No results found.
                </Typography>
              </View>
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Rounded.sm,
    paddingHorizontal: Spacing.sm,
    height: 40,
    marginBottom: Spacing.md,
  },
  filtersContainer: {
    gap: Spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Rounded.pill,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    marginRight: Spacing.sm,
  },
  chipActive: {
    backgroundColor: Colors.onDark,
    borderColor: Colors.onDark,
  },
  input: {
    flex: 1,
    color: Colors.onDark,
    marginLeft: Spacing.sm,
    fontSize: 16,
  },
  fallbackMessage: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  listContent: {
    padding: Spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  itemWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  }
});
