generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id         String   @id @default(cuid())
  name       String?
  email      String?  @unique
  image      String?
  posts      Post[]
  comments   Comment[]
  likes      Like[]
  accounts   Account[]
  sessions   Session[]
  createdAt  DateTime @default(now())
}

model Post {
  id        String   @id @default(cuid())
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  caption   String?
  media     Media[]
  likes     Like[]
  comments  Comment[]
  createdAt DateTime @default(now())
  isPublic  Boolean  @default(true)
}

model Media {
  id        String   @id @default(cuid())
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  publicId  String   @unique
  secureUrl String
  width     Int
  height    Int
  format    String
  bytes     Int
  lqip      String?
  createdAt DateTime @default(now())
}

model Comment {
  id        String   @id @default(cuid())
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  content   String
  createdAt DateTime @default(now())
}

model Like {
  id        String   @id @default(cuid())
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  createdAt DateTime @default(now())
  @@unique([postId, userId])
}

/// NextAuth models
model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?
  access_token       String?
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?
  session_state      String?
  user               User    @relation(fields: [userId], references: [id])
  createdAt          DateTime @default(now())
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id])
}
