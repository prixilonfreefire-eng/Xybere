import { Post, Story, User, ChatMessage } from '../types';

export interface FullChatMessage extends ChatMessage {
  recipientId: string;
}

type Listener = (payload: any) => void;

class RealtimeService {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<Listener>> = new Map();
  private reconnectTimeout: any = null;
  private channel: BroadcastChannel | null = null;
  private currentUser: User | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('science_mssn_realtime');
        this.channel.onmessage = (event) => {
          this.handleIncoming(event.data);
        };
      } catch {
        // BroadcastChannel unsupported fallback
      }
      this.connect();
    }
  }

  public setCurrentUser(user: User | null) {
    this.currentUser = user;
    if (user) {
      this.send('user:online', { user });
    }
  }

  public connect() {
    if (typeof window === 'undefined') return;

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        // If user is already set, announce online status
        if (this.currentUser) {
          this.send('user:online', { user: this.currentUser });
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleIncoming(data);
        } catch (err) {
          console.error('Error parsing WS message:', err);
        }
      };

      this.ws.onclose = () => {
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, 2500);
  }

  private handleIncoming(data: { type: string; [key: string]: any }) {
    if (!data || !data.type) return;
    const callbacks = this.listeners.get(data.type);
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }

  public on(type: string, callback: Listener) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    return () => {
      this.listeners.get(type)?.delete(callback);
    };
  }

  public send(type: string, payload: any = {}) {
    const message = { type, ...payload };

    // 1. Send via WebSocket if open
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }

    // 2. Also broadcast to local tabs via BroadcastChannel for instant zero-latency multi-tab sync
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch {
        // ignore
      }
    }
  }

  // Domain action helpers
  public announceOnline(user: User) {
    this.currentUser = user;
    this.send('user:online', { user });
  }

  public announceOffline(userId: string) {
    this.currentUser = null;
    this.send('user:offline', { userId });
  }

  public createPost(post: Post) {
    this.send('post:create', { post });
  }

  public updatePost(post: Post) {
    this.send('post:update', { post });
  }

  public deletePost(postId: string) {
    this.send('post:delete', { postId });
  }

  public createStory(story: Story) {
    this.send('story:create', { story });
  }

  public sendChatMessage(message: FullChatMessage) {
    this.send('chat:send', { message });
  }
}

export const realtime = new RealtimeService();
