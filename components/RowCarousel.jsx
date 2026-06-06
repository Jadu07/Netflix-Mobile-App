import { FlatList, StyleSheet, View } from 'react-native';
import { Typography } from './Typography';
import { PosterCard } from './PosterCard';
import { Spacing } from '../constants/theme';

export const RowCarousel = ({ title, data, isLarge = false, showRank = false }) => {
  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      <Typography variant="titleSm" style={styles.title}>
        {title}
      </Typography>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <PosterCard 
            movie={item} 
            isLarge={isLarge} 
            rank={showRank ? index + 1 : undefined} 
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  title: {
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
  }
});
