import { useTheme } from "@/context/ThemeContext";
import { usePostsStore } from "@/store/postsStore";
import { Post } from "@/types";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function BlogListScreen() {
  const router = useRouter();
  const { theme, toggleTheme, colors } = useTheme();
  const { posts, loading, fetchPosts } = usePostsStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={[
        styles.postCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => router.push(`/details/${item.id}`)}
    >
      <Text
        style={[styles.postTitle, { color: colors.text }]}
        numberOfLines={2}
      >
        {item.title}
      </Text>
      <Text
        style={[styles.postBody, { color: colors.subtitle }]}
        numberOfLines={3}
      >
        {item.body}
      </Text>
      <Text style={[styles.postId, { color: colors.primary }]}>
        Post #{item.id}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          DaustBlog
        </Text>
        <Pressable
          onPress={toggleTheme}
          style={[styles.themeButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.themeButtonText}>
            {theme === "light" ? "🌙" : "☀️"}
          </Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading posts...
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  themeButtonText: {
    fontSize: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  listContent: {
    padding: 12,
  },
  postCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  postBody: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  postId: {
    fontSize: 12,
    fontWeight: "500",
  },
});
