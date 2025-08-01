// app/index.tsx
import { useRouter } from 'expo-router';
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CHAT_ROOMS = [
  {
    id: "Mubashar", name: "Mubashar",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    lastMessage: "Welcome to the general chat!",
  },
  {
    id: "support", name: "Support",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    lastMessage: "How can we help you today?",
  },
  {
    id: "random", name: "Random",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    lastMessage: "Share anything random here!",
  },
  {
    id: "work", name: "Work",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    lastMessage: "Meeting at 3pm, don't forget!",
  },
  {
    id: "friends", name: "Friends",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    lastMessage: "Let's catch up soon! 🍕",
  },
  {
    id: "family", name: "Family",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    lastMessage: "Family dinner this weekend?",
  },
  {
    id: "developers", name: "Developers",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    lastMessage: "Pushed new code to main.",
  },
  {
    id: "music", name: "Music",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    lastMessage: "Check out this new album!",
  },
  {
    id: "sports", name: "Sports",
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
    lastMessage: "Game night on Friday.",
  },
  {
    id: "gaming", name: "Gaming",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    lastMessage: "GGs last night!",
  },
  {
    id: "travel", name: "Travel",
    avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    lastMessage: "Share your favorite destination.",
  },
  {
    id: "books", name: "Books",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    lastMessage: "Any book recommendations?",
  },
  {
    id: "movies", name: "Movies",
    avatar: "https://randomuser.me/api/portraits/women/13.jpg",
    lastMessage: "Who's watched the new release?",
  },
  {
    id: "photography", name: "Photography",
    avatar: "https://randomuser.me/api/portraits/men/14.jpg",
    lastMessage: "Share your best shots!",
  },
  {
    id: "announcements", name: "Announcements",
    avatar: "https://randomuser.me/api/portraits/women/15.jpg",
    lastMessage: "App update coming soon 🚀",
  },
];

export default function ChatListScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#3d3f41" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: Platform.OS === "android" ? 25 : 0, color: "#fff", paddingHorizontal: 16, paddingVertical: 15  }}>Tribe Chats</Text>
      <FlatList
        data={CHAT_ROOMS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatListItem}
            onPress={() =>
              router.push({
                pathname: '/chat/[roomId]',
                params: { roomId: item.id, name: item.name, avatar: item.avatar }
              })
            }
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatName}>{item.name}</Text>
              <Text numberOfLines={1} style={styles.lastMessage}>
                {item.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chatListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  avatarContainer: {
    marginRight: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eee",
  },
  chatName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
  },
  lastMessage: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
});
