// // app/chat/[roomId].tsx
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useRef } from "react";
// import {
//   FlatList,
//   Image,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import { create } from "zustand";

// // Hide default Expo Router header (for Expo Router v2+)
// export const options = { headerShown: false };

// type Message = {
//   id: string;
//   text: string;
//   sender: string;
//   avatar: string;
//   time: string;
//   edited?: boolean;
//   reactions?: { [emoji: string]: string[] };
// };

// type ChatStore = {
//   messagesByRoom: { [roomId: string]: Message[] };
//   newMessage: string;
//   editingId: string | null;
//   loadMessages: () => Promise<void>;
//   addMessage: (roomId: string, text: string) => Promise<void>;
//   setNewMessage: (text: string) => void;
//   startEditing: (id: string, roomId: string) => void;
//   editMessage: (roomId: string, text: string) => Promise<void>;
//   cancelEditing: () => void;
//   toggleReaction: (roomId: string, id: string, emoji: string, user: string) => Promise<void>;
// };

// const useChatStore = create<ChatStore>((set, get) => ({
//   messagesByRoom: {},
//   newMessage: "",
//   editingId: null,
//   loadMessages: async () => {
//     const saved = await AsyncStorage.getItem("messagesByRoom");
//     if (saved) set({ messagesByRoom: JSON.parse(saved) });
//   },
//   addMessage: async (roomId, text) => {
//     const { messagesByRoom } = get();
//     const msg: Message = {
//       id: Date.now().toString(),
//       text,
//       sender: "You",
//       avatar: "https://i.pravatar.cc/60?img=3",
//       time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       edited: false,
//       reactions: {},
//     };
//     const updatedRoomMsgs = [...(messagesByRoom[roomId] || []), msg];
//     const updatedByRoom = { ...messagesByRoom, [roomId]: updatedRoomMsgs };
//     set({ messagesByRoom: updatedByRoom, newMessage: "" });
//     await AsyncStorage.setItem("messagesByRoom", JSON.stringify(updatedByRoom));
//   },
//   setNewMessage: (text) => set({ newMessage: text }),
//   startEditing: (id, roomId) => {
//     const { messagesByRoom } = get();
//     const msg = (messagesByRoom[roomId] || []).find((m) => m.id === id);
//     if (msg) set({ editingId: id, newMessage: msg.text });
//   },
//   editMessage: async (roomId, text) => {
//     const { editingId, messagesByRoom } = get();
//     if (!editingId) return;
//     const updated = (messagesByRoom[roomId] || []).map((msg) =>
//       msg.id === editingId ? { ...msg, text, edited: true } : msg
//     );
//     const updatedByRoom = { ...messagesByRoom, [roomId]: updated };
//     set({ messagesByRoom: updatedByRoom, editingId: null, newMessage: "" });
//     await AsyncStorage.setItem("messagesByRoom", JSON.stringify(updatedByRoom));
//   },
//   cancelEditing: () => set({ editingId: null, newMessage: "" }),
//   toggleReaction: async (roomId, id, emoji, user) => {
//     const { messagesByRoom } = get();
//     const updated = (messagesByRoom[roomId] || []).map((msg) => {
//       if (msg.id !== id) return msg;
//       let reactions = msg.reactions || {};
//       let users = reactions[emoji] || [];
//       if (users.includes(user)) {
//         reactions = { ...reactions, [emoji]: users.filter((u) => u !== user) };
//       } else {
//         reactions = { ...reactions, [emoji]: [...users, user] };
//       }
//       return { ...msg, reactions };
//     });
//     const updatedByRoom = { ...messagesByRoom, [roomId]: updated };
//     set({ messagesByRoom: updatedByRoom });
//     await AsyncStorage.setItem("messagesByRoom", JSON.stringify(updatedByRoom));
//   },
// }));

// const EMOJIS = ["👍", "😂", "😍", "😮", "😢"];

// // ------------ Chat Screen --------------
// export default function ChatRoomScreen() {
//   // Accept name and avatar from route params
//   const { roomId, name, avatar } = useLocalSearchParams<{ roomId: string, name?: string, avatar?: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();

//   const {
//     messagesByRoom,
//     newMessage,
//     editingId,
//     loadMessages,
//     addMessage,
//     setNewMessage,
//     startEditing,
//     editMessage,
//     cancelEditing,
//     toggleReaction,
//   } = useChatStore();

//   const flatListRef = useRef<FlatList<Message>>(null);

//   useEffect(() => {
//     loadMessages();
//   }, []);

//   useEffect(() => {
//     if (flatListRef.current && (messagesByRoom[roomId]?.length ?? 0) > 0) {
//       flatListRef.current.scrollToEnd({ animated: true });
//     }
//   }, [messagesByRoom, roomId]);

//   const messages = messagesByRoom[roomId] || [];

//   const handleSend = () => {
//     if (newMessage.trim()) addMessage(roomId, newMessage.trim());
//   };

//   const handleEdit = () => {
//     if (newMessage.trim()) editMessage(roomId, newMessage.trim());
//   };

//   const renderItem = ({ item }: { item: Message }) => (
//     <View style={styles.message}>
//       <Image source={{ uri: item.avatar }} style={styles.avatar} />
//       <View style={{ flex: 1 }}>
//         <View style={styles.header}>
//           <Text style={styles.sender}>{item.sender}</Text>
//           <Text style={styles.time}>{item.time}</Text>
//           {item.sender === "You" && (
//             <TouchableOpacity
//               onPress={() => startEditing(item.id, roomId)}
//               style={{ marginLeft: 10 }}
//             >
//               <Text style={{ color: "#007AFF", fontSize: 12 }}>Edit</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//         <Text style={styles.text}>
//           {item.text}{" "}
//           {item.edited && (
//             <Text style={{ color: "#888", fontSize: 12 }}>(edited)</Text>
//           )}
//         </Text>
//         <View style={{ flexDirection: "row", marginTop: 5 }}>
//           {EMOJIS.map((emoji) => (
//             <TouchableOpacity
//               key={emoji}
//               onPress={() => toggleReaction(roomId, item.id, emoji, "You")}
//               style={{ marginRight: 5 }}
//             >
//               <Text>
//                 {emoji}
//                 {item.reactions?.[emoji]?.length
//                   ? ` ${item.reactions[emoji].length}`
//                   : ""}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
//     >
//       <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
//         {/* ------- Custom Chat Header -------- */}
//         <View style={styles.roomHeader}>
//           <TouchableOpacity
//             style={styles.backBtnTouchable}
//             onPress={() => router.back()}
//             hitSlop={10}
//           >
//             <Text style={styles.backBtn}>{'<'}</Text>
//           </TouchableOpacity>
//           <Image
//             source={{ uri: typeof avatar === "string" ? avatar : "" }}
//             style={{ width: 32, height: 32, borderRadius: 16, marginRight: 10 }}
//           />
//           <Text style={styles.roomTitle}>
//             {typeof name === "string" ? name : "Chat"}
//           </Text>
//         </View>

//         <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//           <View style={{ flex: 1 }}>
//             <FlatList
//               ref={flatListRef}
//               data={messages}
//               renderItem={renderItem}
//               keyExtractor={(item) => item.id}
//               contentContainerStyle={{
//                 flexGrow: 1,
//                 justifyContent: "flex-end",
//                 padding: 16,
//               }}
//               keyboardShouldPersistTaps="always"
//             />

//             <View
//               style={[
//                 styles.inputBar,
//                 { paddingBottom: insets.bottom ? insets.bottom : 10 },
//               ]}
//             >
//               <TextInput
//                 style={styles.input}
//                 value={newMessage}
//                 onChangeText={setNewMessage}
//                 placeholder={editingId ? "Edit your message..." : "Type your message..."}
//                 onSubmitEditing={editingId ? handleEdit : handleSend}
//                 returnKeyType={editingId ? "done" : "send"}
//                 blurOnSubmit={false}
//               />
//               {editingId ? (
//                 <>
//                   <TouchableOpacity style={styles.cancelBtn} onPress={cancelEditing}>
//                     <Text style={{ color: "#007AFF" }}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.sendBtn} onPress={handleEdit}>
//                     <Text style={{ color: "#fff", fontWeight: "bold" }}>Save</Text>
//                   </TouchableOpacity>
//                 </>
//               ) : (
//                 <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
//                   <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// }

// // ----------- Styles -------------
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fafafa" },
//   message: { flexDirection: "row", marginBottom: 14, alignItems: "flex-start" },
//   avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
//   header: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
//   sender: { fontWeight: "bold", marginRight: 8, fontSize: 15 },
//   time: { color: "#888", fontSize: 12 },
//   text: { fontSize: 16 },
//   roomHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//     backgroundColor: "#fff",
//   },
//   backBtnTouchable: {
//     marginRight: 12,
//     padding: 4,
//     borderRadius: 24,
//   },
//   backBtn: {
//     color: "#007AFF",
//     fontSize: 26,
//     fontWeight: "bold",
//     paddingHorizontal: 2,
//   },
//   roomTitle: { fontSize: 20, fontWeight: "bold" },
//   inputBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     borderTopWidth: 1,
//     borderColor: "#eee",
//     backgroundColor: "#fff",
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     marginRight: 10,
//     backgroundColor: "#f5f5f5",
//   },
//   sendBtn: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//     borderRadius: 20,
//   },
//   cancelBtn: { marginRight: 8, paddingVertical: 10, paddingHorizontal: 12 },
// });


import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { create } from "zustand";
import ChatHeader from "../../components/ChatHeader";
import ChatInputBar from "../../components/ChatInputBar";
import ChatMessage, { Message } from "../../components/ChatMessage";

// Hide default Expo Router header
export const options = { headerShown: false };

// --- UPDATE Message type to support replyTo ---
export type Message = {
  id: string;
  text: string;
  sender: string;
  avatar: string;
  time: string;
  edited?: boolean;
  reactions?: { [emoji: string]: string[] };
  replyTo?: {
    id: string;
    sender: string;
    text: string;
  } | null;
};

// Define ChatStore type
type ChatStore = {
  messagesByRoom: { [roomId: string]: Message[] };
  newMessage: string;
  editingId: string | null;
  loadMessages: () => Promise<void>;
  addMessage: (roomId: string, text: string, replyTo?: Message | null) => Promise<void>;
  setNewMessage: (text: string) => void;
  startEditing: (id: string, roomId: string) => void;
  editMessage: (roomId: string, text: string) => Promise<void>;
  cancelEditing: () => void;
  toggleReaction: (roomId: string, id: string, emoji: string, user: string) => Promise<void>;
};

const useChatStore = create<ChatStore>((set, get) => ({
  messagesByRoom: {},
  newMessage: "",
  editingId: null,
  loadMessages: async () => {
    const saved = await AsyncStorage.getItem("messagesByRoom");
    if (saved) set({ messagesByRoom: JSON.parse(saved) });
  },
  // -- UPDATED: addMessage supports replyTo
  addMessage: async (roomId, text, replyTo = null) => {
    const { messagesByRoom } = get();
    const msg: Message = {
      id: Date.now().toString(),
      text,
      sender: "You",
      avatar: "https://i.pravatar.cc/60?img=3",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: new Date().toISOString(),
      edited: false,
      reactions: {},
      replyTo: replyTo
        ? {
            id: replyTo.id,
            sender: replyTo.sender,
            text: replyTo.text,
          }
        : null,
    };
    const updatedRoomMsgs = [...(messagesByRoom[roomId] || []), msg];
    const updatedByRoom = { ...messagesByRoom, [roomId]: updatedRoomMsgs };
    set({ messagesByRoom: updatedByRoom, newMessage: "" });
    await AsyncStorage.setItem("messagesByRoom", JSON.stringify(updatedByRoom));
  },
  setNewMessage: (text) => set({ newMessage: text }),
  startEditing: (id, roomId) => {
    const { messagesByRoom } = get();
    const msg = (messagesByRoom[roomId] || []).find((m) => m.id === id);
    if (msg) set({ editingId: id, newMessage: msg.text });
  },
  editMessage: async (roomId, text) => {
    const { editingId, messagesByRoom } = get();
    if (!editingId) return;
    const updated = (messagesByRoom[roomId] || []).map((msg) =>
      msg.id === editingId ? { ...msg, text, edited: true } : msg
    );
    const updatedByRoom = { ...messagesByRoom, [roomId]: updated };
    set({ messagesByRoom: updatedByRoom, editingId: null, newMessage: "" });
    await AsyncStorage.setItem("messagesByRoom", JSON.stringify(updatedByRoom));
  },
  cancelEditing: () => set({ editingId: null, newMessage: "" }),
  toggleReaction: async (roomId, id, emoji, user) => {
    const { messagesByRoom } = get();
    const updated = (messagesByRoom[roomId] || []).map((msg) => {
      if (msg.id !== id) return msg;
      let reactions = msg.reactions || {};
      let users = reactions[emoji] || [];
      if (users.includes(user)) {
        reactions = { ...reactions, [emoji]: users.filter((u) => u !== user) };
      } else {
        reactions = { ...reactions, [emoji]: [...users, user] };
      }
      return { ...msg, reactions };
    });
    const updatedByRoom = { ...messagesByRoom, [roomId]: updated };
    set({ messagesByRoom: updatedByRoom });
    await AsyncStorage.setItem("messagesByRoom", JSON.stringify(updatedByRoom));
  },
}));

export default function ChatRoomScreen() {
  const { roomId, name, avatar } = useLocalSearchParams<{ roomId: string, name?: string, avatar?: string }>();
  const insets = useSafeAreaInsets();
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const openSwipeable = useRef<Swipeable | null>(null);
  const inputRef = useRef<TextInput>(null);

  const {
    messagesByRoom,
    newMessage,
    editingId,
    loadMessages,
    addMessage,
    setNewMessage,
    startEditing,
    editMessage,
    cancelEditing,
    toggleReaction,
  } = useChatStore();

  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => { loadMessages(); }, []);
  useEffect(() => {
    if (flatListRef.current && (messagesByRoom[roomId]?.length ?? 0) > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messagesByRoom, roomId]);

  const messages = messagesByRoom[roomId] || [];

  const handleReply = (msg: Message, swipeable: Swipeable) => {
  // close any previously-open row
  openSwipeable.current?.close();
  openSwipeable.current = swipeable;

  setReplyTo(msg);
  setTimeout(() => inputRef.current?.focus(), 50);
};

const cancelReply = () => {
  setReplyTo(null);
  openSwipeable.current?.close();      // ⬅️ slide it back
  openSwipeable.current = null;
};

  const handleSend = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage, replyTo);
      addMessage(roomId, newMessage.trim(), replyTo);
      setNewMessage("");
      openSwipeable.current?.close();
      setReplyTo(null);
    }
  };

  const handleEdit = () => {
    if (newMessage.trim()) editMessage(roomId, newMessage.trim());
  };

  const buildChatData = (msgs: Message[]) => {
  const out: { type: "date" | "msg"; date?: string; data?: Message }[] = [];
  let lastDate = "";
  msgs.forEach(m => {
    const d = new Date(m.createdAt);
    const key = d.toDateString();            // e.g. "Fri Aug 01 2025"
    if (key !== lastDate) {
      out.push({ type: "date", date: key });
      lastDate = key;
    }
    out.push({ type: "msg", data: m });
  });
  return out;
};

const chatData = buildChatData(messages);

  const prettyDay = (dateStr: string) => {
  const today = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor(
    (today.setHours(0,0,0,0) - d.setHours(0,0,0,0)) / 86400000
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
    >
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ChatHeader name={name} avatar={avatar} />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <FlatList
              ref={flatListRef}
              // data={messages}
              data={chatData}
              // renderItem={({ item }) => (
              //   <ChatMessage
              //     item={item}
              //     roomId={roomId}
              //     avatar={avatar as string}
              //     startEditing={startEditing}
              //     toggleReaction={toggleReaction}
              //     onReply={handleReply as any}
              //   />
              // )}
              renderItem={({ item }) =>
    item.type === "date" ? (
      <View style={styles.dayPillWrapper}>
        <Text style={styles.dayPill}>{prettyDay(item.date!)}</Text>
      </View>
    ) : (
      <ChatMessage
        item={item.data!}
        roomId={roomId}
        avatar={avatar}
        startEditing={startEditing}
        toggleReaction={toggleReaction}
        onReply={handleReply}
      />
    )
  }
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "flex-end",
                padding: 16,
              }}
              keyboardShouldPersistTaps="always"
            />

            {/* -------- Reply Bar -------- */}
            {replyTo && (
              <View style={{
                padding: 6,
                backgroundColor: "#e0f7fa",
                borderRadius: 8,
                marginHorizontal: 10,
                marginBottom: 6,
                position: "relative"
              }}>
                <Text style={{ color: "#007AFF", fontWeight: "bold" }}>
                  Replying to {replyTo.sender}
                </Text>
                <Text numberOfLines={1} style={{ color: "#555" }}>{replyTo.text}</Text>
                <TouchableOpacity
                  onPress={cancelReply}
                  style={{ position: "absolute", right: 8, top: 8 }}
                >
                  <Text style={{ color: "#007AFF", fontSize: 18 }}>x</Text>
                </TouchableOpacity>
              </View>
            )}

            <ChatInputBar
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              editingId={editingId}
              handleEdit={handleEdit}
              handleSend={handleSend}
              cancelEditing={cancelEditing}
              paddingBottom={insets.bottom ? insets.bottom : 10}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  dayPillWrapper: { alignItems: "center", marginVertical: 10 },
dayPill: {
  backgroundColor: "#e0e0e0",
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 12,
  fontSize: 12,
  color: "#555",
},

});