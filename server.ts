import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

const app = express();
app.use(express.json({ limit: '10mb' }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// User and Account types
interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Plain/stored for this applet
  role: 'admin' | 'user';
  avatar: string;
  createdAt: number;
}

interface StoredUser {
  id: string;
  name: string;
  email?: string;
  role?: 'admin' | 'user';
  avatar: string;
  isOnline: boolean;
  statusText?: string;
  lastActive?: number;
}

interface StoredMessage {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;
  isThumb?: boolean;
}

// In-Memory Database for registered accounts (one email per account)
// Pre-seed Admin account as requested
const ADMIN_EMAIL = 'admin@social.com';
const ADMIN_PASSWORD = 'Adminsocial';

const registeredAccounts = new Map<string, RegisteredAccount>();

// Seed the Admin account
registeredAccounts.set(ADMIN_EMAIL.toLowerCase(), {
  id: 'user_admin_root',
  name: 'Forum Admin',
  email: ADMIN_EMAIL,
  passwordHash: ADMIN_PASSWORD,
  role: 'admin',
  avatar: `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="#0866FF"/><text x="50" y="58" font-family="-apple-system, sans-serif" font-size="34" font-weight="900" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">FA</text></svg>`
  )}`,
  createdAt: Date.now(),
});

const onlineUsersMap = new Map<string, StoredUser>();
const clientToUserMap = new Map<WebSocket, string>();
const postsList: any[] = [];
const storiesList: any[] = [];
const messagesList: StoredMessage[] = [];

// Helper to get all users (registered accounts + online status)
function getAllUsers(): StoredUser[] {
  const users: StoredUser[] = [];
  const seenIds = new Set<string>();

  for (const account of registeredAccounts.values()) {
    seenIds.add(account.id);
    const online = onlineUsersMap.get(account.id);
    users.push({
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      avatar: account.avatar,
      isOnline: !!online,
      statusText: online ? 'Active now' : 'Offline',
      lastActive: online?.lastActive || account.createdAt,
    });
  }

  for (const [id, user] of onlineUsersMap.entries()) {
    if (!seenIds.has(id)) {
      users.push(user);
    }
  }

  return users;
}

// Broadcast helper to all connected clients
function broadcast(payload: any, excludeWs?: WebSocket) {
  const json = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== excludeWs) {
      client.send(json);
    }
  });
}

// WebSocket connection lifecycle
wss.on('connection', (ws: WebSocket) => {
  // Send current state on connect
  ws.send(
    JSON.stringify({
      type: 'sync:state',
      data: {
        posts: postsList,
        stories: storiesList,
        onlineUsers: Array.from(onlineUsersMap.values()),
        allUsers: getAllUsers(),
        messages: messagesList,
      },
    })
  );

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());

      switch (msg.type) {
        case 'user:online': {
          const user: StoredUser = {
            ...msg.user,
            isOnline: true,
            statusText: 'Active now',
            lastActive: Date.now(),
          };
          onlineUsersMap.set(user.id, user);
          clientToUserMap.set(ws, user.id);

          broadcast({
            type: 'users:update',
            users: getAllUsers(),
            onlineUsers: Array.from(onlineUsersMap.values()),
          });
          break;
        }

        case 'user:offline': {
          const userId = msg.userId;
          if (userId) {
            onlineUsersMap.delete(userId);
            clientToUserMap.delete(ws);
            broadcast({
              type: 'users:update',
              users: getAllUsers(),
              onlineUsers: Array.from(onlineUsersMap.values()),
            });
          }
          break;
        }

        case 'post:create': {
          const newPost = msg.post;
          if (newPost && newPost.id) {
            if (!postsList.some((p) => p.id === newPost.id)) {
              postsList.unshift(newPost);
            }
            broadcast({
              type: 'post:created',
              post: newPost,
            });
          }
          break;
        }

        case 'post:update': {
          const updatedPost = msg.post;
          if (updatedPost && updatedPost.id) {
            const index = postsList.findIndex((p) => p.id === updatedPost.id);
            if (index !== -1) {
              postsList[index] = updatedPost;
            } else {
              postsList.unshift(updatedPost);
            }
            broadcast({
              type: 'post:updated',
              post: updatedPost,
            });
          }
          break;
        }

        case 'post:delete': {
          const postId = msg.postId;
          if (postId) {
            const index = postsList.findIndex((p) => p.id === postId);
            if (index !== -1) {
              postsList.splice(index, 1);
            }
            broadcast({
              type: 'post:deleted',
              postId,
            });
          }
          break;
        }

        case 'story:create': {
          const newStory = msg.story;
          if (newStory && newStory.id) {
            if (!storiesList.some((s) => s.id === newStory.id)) {
              storiesList.unshift(newStory);
            }
            broadcast({
              type: 'story:created',
              story: newStory,
            });
          }
          break;
        }

        case 'chat:send': {
          const chatMsg: StoredMessage = msg.message;
          if (chatMsg && chatMsg.id) {
            messagesList.push(chatMsg);
            broadcast({
              type: 'chat:message',
              message: chatMsg,
            });
          }
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    const userId = clientToUserMap.get(ws);
    if (userId) {
      clientToUserMap.delete(ws);
      onlineUsersMap.delete(userId);
      broadcast({
        type: 'users:update',
        users: Array.from(onlineUsersMap.values()),
      });
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket connection error:', err);
  });
});

// REST AUTHENTICATION ENDPOINTS
// 1. Register: strictly limited to one account per email
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Enforce one email per account constraint
  if (registeredAccounts.has(normalizedEmail)) {
    return res.status(409).json({
      error: 'An account with this email address already exists. Please log in with your password.',
    });
  }

  const newAccount: RegisteredAccount = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: password,
    role: normalizedEmail === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
    avatar: avatar || `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="#0866FF"/><text x="50" y="58" font-family="-apple-system, sans-serif" font-size="36" font-weight="700" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">${name.slice(0, 2).toUpperCase()}</text></svg>`
    )}`,
    createdAt: Date.now(),
  };

  registeredAccounts.set(normalizedEmail, newAccount);

  const safeUser: StoredUser = {
    id: newAccount.id,
    name: newAccount.name,
    email: newAccount.email,
    role: newAccount.role,
    avatar: newAccount.avatar,
    isOnline: true,
    statusText: 'Active now',
  };

  onlineUsersMap.set(safeUser.id, safeUser);
  broadcast({
    type: 'users:update',
    users: getAllUsers(),
    onlineUsers: Array.from(onlineUsersMap.values()),
  });

  res.status(201).json({ success: true, user: safeUser });
});

// 2. Login endpoint (supports admin@social.com / Adminsocial and user accounts)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const account = registeredAccounts.get(normalizedEmail);

  if (!account) {
    return res.status(404).json({
      error: 'No account found with this email. Please create an account first.',
    });
  }

  if (account.passwordHash !== password) {
    return res.status(401).json({ error: 'Incorrect password. Please verify and try again.' });
  }

  const safeUser: StoredUser = {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    avatar: account.avatar,
    isOnline: true,
    statusText: 'Active now',
  };

  onlineUsersMap.set(safeUser.id, safeUser);
  broadcast({
    type: 'users:update',
    users: getAllUsers(),
    onlineUsers: Array.from(onlineUsersMap.values()),
  });

  res.json({ success: true, user: safeUser });
});

// 3. Public endpoint to list/search users by name or email
app.get('/api/users', (req, res) => {
  const query = ((req.query.q as string) || '').trim().toLowerCase();
  const all = getAllUsers();
  if (query) {
    const filtered = all.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        (u.email && u.email.toLowerCase().includes(query))
    );
    return res.json({ users: filtered });
  }
  res.json({ users: all });
});

// 4. Admin endpoint to view all registered accounts & forum moderation
app.get('/api/admin/accounts', (req, res) => {
  const list = Array.from(registeredAccounts.values()).map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    role: a.role,
    createdAt: a.createdAt,
    avatar: a.avatar,
  }));
  res.json({ accounts: list });
});

// 4. Delete post (admin or author)
app.delete('/api/posts/:id', (req, res) => {
  const postId = req.params.id;
  const index = postsList.findIndex((p) => p.id === postId);
  if (index !== -1) {
    postsList.splice(index, 1);
    broadcast({
      type: 'post:deleted',
      postId,
    });
    return res.json({ success: true });
  }
  res.status(404).json({ error: 'Post not found' });
});

// 5. REST Health and Sync Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    onlineCount: onlineUsersMap.size,
    postsCount: postsList.length,
    registeredAccountsCount: registeredAccounts.size,
    time: new Date().toISOString(),
  });
});

app.get('/api/state', (req, res) => {
  res.json({
    posts: postsList,
    stories: storiesList,
    onlineUsers: Array.from(onlineUsersMap.values()),
    messages: messagesList,
  });
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`SCIENCE MSSN 2K27 Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
