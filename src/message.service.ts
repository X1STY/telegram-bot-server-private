import * as fs from 'fs';

export interface MessageEntry {
  shortDesc: string;
  message: string;
}

export class MessageService {
  private messages: Record<string, MessageEntry> = {};

  constructor(private readonly filePath: string) {
    this.loadMessages();
  }

  private loadMessages() {
    try {
      const fileContent = fs.readFileSync(this.filePath, 'utf-8');
      this.messages = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  getMessages() {
    return { ...this.messages };
  }

  updateMessage(key: string, newMessage: string) {
    if (this.messages[key]) {
      this.messages[key].message = newMessage;
      this.saveMessages();
    } else {
      console.error(`Message with key '${key}' not found.`);
    }
  }

  private saveMessages() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.messages, null, 2));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }
}
