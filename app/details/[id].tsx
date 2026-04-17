import { useTheme } from "@/context/ThemeContext";
import { usePostsStore } from "@/store/postsStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function BlogDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { getPostById, fetchPosts, posts } = usePostsStore();

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, []);

  const post = id ? getPostById(parseInt(id)) : null;

  if (!post) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.backButton, { color: colors.primary }]}>
              ← Back
            </Text>
          </Pressable>
        </View>
        <View style={styles.centerContent}>
          <Text style={[styles.notFoundText, { color: colors.text }]}>
            Post not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>
            ← Back
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.postNumber, { color: colors.primary }]}>
            Post #{post.id}
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            {post.title}
          </Text>

          <View
            style={[styles.divider, { borderBottomColor: colors.border }]}
          />

          <View style={styles.userSection}>
            <Text style={[styles.label, { color: colors.subtitle }]}>
              User ID:
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {post.userId}
            </Text>
          </View>

          <View
            style={[styles.divider, { borderBottomColor: colors.border }]}
          />

          <View style={styles.bodySection}>
            <Text style={[styles.label, { color: colors.subtitle }]}>
              Content:
            </Text>
            <Text style={[styles.bodyText, { color: colors.text }]}>
              {post.body}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: "500",
  },
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
  },
  postNumber: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
    marginBottom: 16,
  },
  divider: {
    borderBottomWidth: 1,
    marginVertical: 16,
  },
  userSection: {
    marginBottom: 8,
  },
  bodySection: {
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
  },
});
