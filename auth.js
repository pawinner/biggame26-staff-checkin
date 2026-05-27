import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ALLOWED_EMAIL_DOMAIN = "@docchula.com";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          hd: "docchula.com"
        }
      }
    })
  ],
  pages: {
    signIn: "/"
  },
  callbacks: {
    async signIn({ profile }) {
      return profile?.email?.toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN) ?? false;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/checked-in`;
    }
  }
});
