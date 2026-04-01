import { Link, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, FlatList, Pressable } from 'react-native';
import { api } from '../../src/api/tmdb';

interface MovieDetails {
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  runtime: number;
}

interface MovieCreditsActor {
  name: string;
  id: number;
  profile_path: string | null;
}

export default function MovieDetailsScreen() {
  // Captura o parâmetro '[id]' do nome do arquivo
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);

  const [credits, setCredits] = useState<MovieCreditsActor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);


  const fetchMovieDetails = async () => {
    try {
      const response = await api.get(`/movie/${id}`);
      setMovie(response.data);      
      setIsLoading(false)
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
    }
  };

  const fetchCredits = async () => {
      try {
        const response = await api.get(`/movie/${id}/credits`);
        console.log('Resposta dos créditos:', response.data.cast);
        setCredits(response.data.cast);
        setIsLoadingCredits(false);
      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
      }
  };

    const rendercreditsItem = ({ item }: { item: MovieCreditsActor }) => (
      // Link do Expo Router passando o ID do filme como parâmetro dinâmico
      <Link href={`../actor/${item.id}`} asChild>
        <Pressable style={styles.card}>
          {item.profile_path ? (
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.profile_path}` }}
              style={styles.poster}
            />
          ) : (
            <View>
              <Text>Sem Imagem</Text>
            </View>
          )}
        </Pressable>
      </Link>
    );
  

  useEffect(() => {
    fetchMovieDetails();
    fetchCredits();
  }, [id]); // O hook é re-executado caso o ID mude

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (isLoadingCredits) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Filme não encontrado.</Text>
      </View>
    );
  }

  if (!credits) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Créditos não encontrados.</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      {movie.poster_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
          style={styles.poster}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>

        <View style={styles.statsContainer}>
          <Text style={styles.statText}>⭐ {movie.vote_average}/10</Text>
          <Text style={styles.statText}>⏱️ {movie.runtime} min</Text>
        </View>

        <Text style={styles.sectionTitle}>Sinopse</Text>
        <Text style={styles.overview}>
          {movie.overview || 'Sinopse não disponível para este filme.'}
        </Text>
      </View>
      <View style={styles.content}>
        <FlatList
                  data={credits}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={rendercreditsItem}
                  contentContainerStyle={styles.listContainer}
                  // horizontal={true}
                  
                />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  poster: { width: '100%', height: 400 },
  content: { padding: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  statsContainer: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statText: { color: '#E50914', fontSize: 16, fontWeight: '600' },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  overview: { color: '#D1D5DB', fontSize: 16, lineHeight: 24 },
  errorText: { color: '#FFFFFF', fontSize: 18 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  listContainer: { padding: 50 },
});
