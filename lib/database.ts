import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { eq, and, or, desc, asc, gt, ilike } from 'drizzle-orm'
import { users, sessions, conversations, messages, workflows, snippets, apiKeys } from './schema'

// Database connection
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('Database connection string not found')
}

const client = postgres(connectionString)
export const db = drizzle(client)

// Database operations
export class DatabaseManager {
  // User operations
  async createUser(userData: {
    email: string
    name: string
    avatar?: string
  }) {
    const [user] = await db.insert(users).values({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning()
    return user
  }

  async getUserById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id))
    return user
  }

  async getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email))
    return user
  }

  async updateUser(id: string, updates: Partial<typeof users.$inferInsert>) {
    const [user] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning()
    return user
  }

  // Session operations
  async createSession(sessionData: {
    userId: string
    token: string
    expiresAt: Date
  }) {
    const [session] = await db.insert(sessions).values({
      ...sessionData,
      createdAt: new Date()
    }).returning()
    return session
  }

  async getSessionByToken(token: string) {
    const [session] = await db.select()
      .from(sessions)
      .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    return session
  }

  async deleteSession(token: string) {
    await db.delete(sessions).where(eq(sessions.token, token))
  }

  // Conversation operations
  async createConversation(conversationData: {
    userId: string
    title: string
    model?: string
  }) {
    const [conversation] = await db.insert(conversations).values({
      ...conversationData,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning()
    return conversation
  }

  async getConversationsByUser(userId: string) {
    return await db.select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt))
  }

  async getConversationById(id: string) {
    const [conversation] = await db.select()
      .from(conversations)
      .where(eq(conversations.id, id))
    return conversation
  }

  async updateConversation(id: string, updates: Partial<typeof conversations.$inferInsert>) {
    const [conversation] = await db.update(conversations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning()
    return conversation
  }

  async deleteConversation(id: string) {
    await db.delete(conversations).where(eq(conversations.id, id))
  }

  // Message operations
  async createMessage(messageData: {
    conversationId: string
    role: 'user' | 'assistant' | 'system'
    content: string
    model?: string
    tokens?: number
  }) {
    const [message] = await db.insert(messages).values({
      ...messageData,
      createdAt: new Date()
    }).returning()
    return message
  }

  async getMessagesByConversation(conversationId: string) {
    return await db.select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt))
  }

  // Workflow operations
  async createWorkflow(workflowData: {
    userId: string
    name: string
    description: string
    nodes: any[]
    edges: any[]
    published: boolean
  }) {
    const [workflow] = await db.insert(workflows).values({
      ...workflowData,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning()
    return workflow
  }

  async getWorkflowsByUser(userId: string) {
    return await db.select()
      .from(workflows)
      .where(eq(workflows.userId, userId))
      .orderBy(desc(workflows.updatedAt))
  }

  async getPublicWorkflows() {
    return await db.select()
      .from(workflows)
      .where(eq(workflows.published, true))
      .orderBy(desc(workflows.updatedAt))
  }

  // Snippet operations
  async createSnippet(snippetData: {
    userId: string
    name: string
    description: string
    language: string
    code: string
    tags: string[]
    category: string
  }) {
    const [snippet] = await db.insert(snippets).values({
      ...snippetData,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning()
    return snippet
  }

  async getSnippetsByUser(userId: string) {
    return await db.select()
      .from(snippets)
      .where(eq(snippets.userId, userId))
      .orderBy(desc(snippets.updatedAt))
  }

  async getPublicSnippets() {
    return await db.select()
      .from(snippets)
      .where(eq(snippets.isPublic, true))
      .orderBy(desc(snippets.usageCount))
  }

  async searchSnippets(query: string) {
    return await db.select()
      .from(snippets)
      .where(
        or(
          ilike(snippets.name, `%${query}%`),
          ilike(snippets.description, `%${query}%`),
          ilike(snippets.code, `%${query}%`)
        )
      )
      .orderBy(desc(snippets.usageCount))
  }

  // API Key operations
  async createAPIKey(keyData: {
    userId: string
    provider: string
    keyName: string
    encryptedKey: string
    isActive: boolean
  }) {
    const [key] = await db.insert(apiKeys).values({
      ...keyData,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning()
    return key
  }

  async getAPIKeysByUser(userId: string) {
    return await db.select()
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId))
      .orderBy(desc(apiKeys.createdAt))
  }

  async updateAPIKey(id: string, updates: Partial<typeof apiKeys.$inferInsert>) {
    const [key] = await db.update(apiKeys)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(apiKeys.id, id))
      .returning()
    return key
  }

  async deleteAPIKey(id: string) {
    await db.delete(apiKeys).where(eq(apiKeys.id, id))
  }

  async getAPIKeyById(id: string) {
    const [key] = await db.select()
      .from(apiKeys)
      .where(eq(apiKeys.id, id))
    return key
  }
}

// Export singleton instance
export const databaseManager = new DatabaseManager()