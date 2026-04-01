import { Link, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, FlatList, Pressable } from 'react-native';
import { api } from '../../src/api/tmdb';


interface MovieDetails {
  id: number;
  backdrop_path: string | null;
}

interface ActorDetails {
  id: number;
  name: string;
  profile_path: string | null;
  biography: string | null;
}



export default function ActorDetailsScreen() {
  // Captura o parâmetro '[id]' do nome do arquivo
  const { id } = useLocalSearchParams();
  const [actorDetails, setActorDetails] = useState<ActorDetails | null>(null);
   const [moviesActor, setMoviesActor] = useState<MovieDetails[]>([]);
  
//   const [movie, setMovie] = useState<MovieDetails | null>(null);

//   const [credits, setCredits] = useState<MovieCreditsActor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingCredits, setIsLoadingCredits] = useState(true);


//   const fetchMovieDetails = async () => {
//     try {
//       const response = await api.get(`/movie/${id}`);
//       setMovie(response.data);      
//       setIsLoading(false)
//     } catch (error) {
//       console.error('Erro ao buscar detalhes:', error);
//     }
//   };

//   const fetchCredits = async () => {
//       try {
//         const response = await api.get(`/movie/${id}/credits`);
//         console.log('Resposta dos créditos:', response.data.cast); // Verifique a estrutura da resposta
//         setCredits(response.data.cast);
//         setIsLoadingCredits(false);
//       } catch (error) {
//         console.error('Erro ao buscar detalhes:', error);
//       }
//   };


const renderFilmsActor = ({ item }: { item: MovieDetails }) => (
    // Link do Expo Router passando o ID do filme como parâmetro dinâmico
    <Link href={`/movie/${item.id}`} asChild>
    <Pressable style={styles.card}>
        {item.backdrop_path ? (
        <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${item.backdrop_path}` }}
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


  const fetchActorDetails = async () => {
      try {
        const response = await api.get(`/person/${id}`);
        console.log('Resposta dos actor details:', response.data);
        setActorDetails(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
      }finally{
        setIsLoading(false);
      }
  };

   const fetchActorMovies = async () => {
      try {
        const response = await api.get(`/person/${id}/movie_credits`);
        console.log('Resposta dos filmes do ator:', response.data);
        // setActorDetails(response.data);
        setMoviesActor(response.data.cast);
      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
      }finally{
        setIsLoading(false);
      }
  };

  useEffect(() => {
    fetchActorMovies();
    fetchActorDetails();
  }, [id]); // O hook é re-executado caso o ID mude

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

//   if (isLoadingCredits) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#E50914" />
//       </View>
//     );
//   }

//   if (!movie) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>Filme não encontrado.</Text>
//       </View>
//     );
//   }

//   if (!credits) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>Créditos não encontrados.</Text>
//       </View>
//     );
//   }
  return (
   <ScrollView style={styles.container}>
         {actorDetails?.profile_path && (
           <Image
             source={{ uri: `https://image.tmdb.org/t/p/w500${actorDetails.profile_path}` }}
             style={styles.poster}
             resizeMode="cover"
           />
         )}
         <View style={styles.content}>
           <Text style={styles.title}>{actorDetails?.name}</Text>
         </View>
        <View style={styles.content}>
           <FlatList
                     data={moviesActor}
                     keyExtractor={(item) => item.id.toString()}
                     renderItem={renderFilmsActor}
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
  poster: { width: "100%", height: 100 },
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
