import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface ChatInputBarProps {
  newMessage: string;
  setNewMessage: (text: string) => void;
  editingId: string | null;
  handleEdit: () => void;
  handleSend: () => void;
  cancelEditing: () => void;
  paddingBottom: number;
}

export default function ChatInputBar({
  newMessage,
  setNewMessage,
  editingId,
  handleEdit,
  handleSend,
  cancelEditing,
  paddingBottom
}: ChatInputBarProps) {
  return (
    <View style={[styles.inputBar, { paddingBottom }]}>
      <TextInput
        style={styles.input}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder={editingId ? "Edit your message..." : "Type your message..."}
        onSubmitEditing={editingId ? handleEdit : handleSend}
        returnKeyType={editingId ? "done" : "send"}
        blurOnSubmit={false}
      />
      {editingId ? (
        <>
          <TouchableOpacity style={styles.cancelBtn} onPress={cancelEditing}>
            <Text style={{ color: "#007AFF" }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn} onPress={handleEdit}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: "#f5f5f5",
  },
  sendBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  cancelBtn: { marginRight: 8, paddingVertical: 10, paddingHorizontal: 12 },
});
