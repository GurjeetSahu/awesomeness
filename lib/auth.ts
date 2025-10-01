
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    email?: string;
    userId?: string;
  }
}
export const { handlers, auth, signIn, signOut } = NextAuth({

  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      authorization: { params: { scope: "user:email" } },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session }: any) {
      return session
    },
    // async signIn({ user }) {
    //   if (user.email === "") {
    //     return true
    //   } else {
    //     return false
    //   }
    // }
  }

})