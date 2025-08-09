import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "@/lib/db"
import { compare } from "bcryptjs"

const googleClientId = process.env.GOOGLE_CLIENT_ID || ''
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || ''

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db as any),
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await db.user.findFirst({ where: { email: credentials.email } })
        if (!user || !user.passwordHash) return null
        const ok = await compare(credentials.password, user.passwordHash)
        return ok ? { id: user.id, email: user.email!, name: user.name, image: user.image, role: user.role } as any : null
      },
    }),
    // Add Google provider if credentials are available
    ...(googleClientId && googleClientSecret ? [
      Google({ 
        clientId: googleClientId, 
        clientSecret: googleClientSecret,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ] : []),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Persist user id and role on the token at login
        (token as any).role = (user as any).role || 'user'
      }
      
      if (account && account.type === "oauth") {
        // Handle OAuth login
        token.accessToken = account.access_token
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.sub
        ;(session.user as any).role = (token as any).role || 'user'
        ;(session.user as any).accessToken = token.accessToken
      }
      return session
    },
    async signIn({ user, account, profile }) {
      console.log('SignIn callback:', { user: user?.email, account: account?.provider, profile: profile?.email });
      // Allow all sign ins
      return true
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback:', { url, baseUrl });
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/', // Redirect errors to homepage
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.error('[NextAuth Error]:', code, metadata)
    },
    warn(code) {
      console.warn('[NextAuth Warning]:', code)
    },
    debug(code, metadata) {
      console.log('[NextAuth Debug]:', code, metadata)
    }
  }
}

