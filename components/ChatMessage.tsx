// components/ChatMessage.tsx
import { Ionicons } from "@expo/vector-icons"; // ⬅️ icon for the left action
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler"; // ⬅️ NEW

const EMOJIS = ["👍", "😂", "😍", "😮", "😢"];

export type Message = {
  id: string;
  text: string;
  sender: string;
  avatar: string;
  time: string;
  createdAt: string;
  edited?: boolean;
  reactions?: { [emoji: string]: string[] };
  replyTo: any
};

// … Message type & props stay the same, but add onReply:
interface ChatMessageProps {
  item: Message;
  roomId: string;
  avatar: string;
  startEditing: (id: string, roomId: string) => void;
  toggleReaction: (roomId: string, id: string, emoji: string, user: string) => void;
  onReply: (m: Message) => void;               // ⬅️ NEW
}

export default function ChatMessage({
  item,
  roomId,
  avatar,
  startEditing,
  toggleReaction,
  onReply,                                      // ⬅️ NEW
}: ChatMessageProps) {
  /** Rendered when user swipes → (dragging message to the right) */
  const renderLeftActions = () => (
    <View style={styles.replyAction}>
      <Ionicons name="return-up-back" size={24} color="#fff" />
    </View>
  );

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      onSwipeableOpen={() => onReply(item)}     // ⬅️ Fire callback
    >
      <View style={styles.message}>
        <Image source={{ uri: avatar }} style={styles.avatar} />

        {/*  … existing message bubble */}
        <View style={{ flex: 1 }}>
          {/* header */}
          <View style={styles.header}>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.time}>{item.time}</Text>
            {item.sender === "You" && (
              <TouchableOpacity onPress={() => startEditing(item.id, roomId)} style={{ marginLeft: 10 }}>
                <Text style={{ color: "#007AFF", fontSize: 12 }}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {item.replyTo && (
            <View style={styles.replyPreview}>
              <View style={styles.replyStripe} />
              <View style={{ flex: 1 }}>
                <Text style={styles.replySender}>{item.replyTo.sender}</Text>
                <Text
                  style={styles.replyText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.replyTo.text}
                </Text>
              </View>
            </View>
          )}

          {/* body */}
          <Text style={styles.text}>
            {item.text}{" "}
            {item.edited && <Text style={{ color: "#888", fontSize: 12 }}>(edited)</Text>}
          </Text>
          <Text style={styles.bubbleTime}>
  {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
</Text>


          {/* reactions */}
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            {EMOJIS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => toggleReaction(roomId, item.id, emoji, "You")}
                style={{ marginRight: 5 }}
              >
                <Text style={{ color: "#888" }}>
                  {emoji}
                  {item.reactions?.[emoji]?.length ? ` ${item.reactions[emoji].length}` : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Swipeable>
  );
}

/* +++++++++++++++++++++++++++++++++++++ */
const styles = StyleSheet.create({
  message: { flexDirection: "row", marginBottom: 14, alignItems: "flex-start" },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  sender: { fontWeight: "bold", marginRight: 8, fontSize: 15 },
  time: { color: "#888", fontSize: 12 },
  text: { fontSize: 16 },
  /** left-swipe action style */
  replyAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    backgroundColor: "#007AFF",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  replyPreview: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 4,
    borderRadius: 6,
    backgroundColor: "#f1f1f1",
  },
  replyStripe: {
    width: 3,
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 2,
    marginRight: 6,
  },
  replySender: { fontWeight: "600", fontSize: 13, color: "#007AFF" },
  replyText: { fontSize: 13, color: "#555" },
  edited: { color: "#888", fontSize: 12 },
  bubbleTime: { alignSelf: "flex-end", color: "#888", fontSize: 11, marginTop: 2 },
});
