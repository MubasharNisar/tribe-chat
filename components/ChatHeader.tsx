import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
interface ChatHeaderProps {
  name?: string;
  avatar?: string;
}

export default function ChatHeader({ name, avatar }: ChatHeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.roomHeader}>
      <TouchableOpacity
        style={styles.backBtnTouchable}
        onPress={() => router.back()}
        hitSlop={10}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          style={{ marginLeft: 16, color: "#fff" }}
        />
      </TouchableOpacity>
      <Image
        source={{ uri: typeof avatar === "string" ? avatar : "" }}
        style={{ width: 42, height: 42, borderRadius: 16, marginRight: 10 }}
      />
      <Text style={styles.roomTitle}>{typeof name === "string" ? name : "Chat"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  roomHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#3d3f41",
  },
  backBtnTouchable: {
    marginRight: 12,
    padding: 4,
    borderRadius: 24,
  },
  backBtn: {
    color: "#007AFF",
    fontSize: 26,
    fontWeight: "bold",
    paddingHorizontal: 2,
  },
  roomTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
});
