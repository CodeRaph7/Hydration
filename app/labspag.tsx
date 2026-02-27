  import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

const RECIPES = [
  {
    id: "1",
    title: "Spaghetti Carbonara",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
    cookTime: 25,
    difficulty: "Medium",
    rating: 4.5,
    tags: ["Italian", "Pasta", "Quick"],
  },
  {
    id: "2",
    title: "Greek Salad",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
    cookTime: 10,
    difficulty: "Easy",
    rating: 4.8,
    tags: ["Vegetarian", "Healthy", "Quick"],
  },
  {
    id: "3",
    title: "Beef Tacos",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400",
    cookTime: 30,
    difficulty: "Easy",
    rating: 4.6,
    tags: ["Mexican", "Spicy"],
  },
  {
    id: "4",
    title: "Chicken Curry",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400",
    cookTime: 45,
    difficulty: "Hard",
    rating: 4.7,
    tags: ["Indian", "Spicy"],
  },
  {
    id: "5",
    title: "Caesar Salad",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    cookTime: 15,
    difficulty: "Easy",
    rating: 4.4,
    tags: ["Vegetarian", "Healthy", "Quick"],
  },
];

function RecipeCard({ recipe }: any) {
  // TODO: Implement the recipe card
  // Requirements:
  // 1. Show recipe image (height: 200)
  // 2. Display title (bold, 18px)
  // 3. Show cook time with clock emoji ⏱️
  // 4. Display difficulty badge
  // 5. Show rating with stars
  // 6. Display tags using the Tag component from Exercise 1.2

  return (
    <View style={styles.card}>
      <Image source={{ uri: recipe.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>

        <View style={styles.row}>
          <Text>⏱️{recipe.cookTime}</Text>
          <Text>{recipe.difficulty}</Text>
          <Text>{recipe.rating}</Text>
        </View>
        <View style={styles.rowtag}>
          {recipe.tags.map((tag: string) => (
            <Text key={tag} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <ScrollView style={{ padding: 16 }}>
      {RECIPES.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 180,
  },

  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  rowtag: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },

  tag: {
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    fontSize: 12,
  },
});
