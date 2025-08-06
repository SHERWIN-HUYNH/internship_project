
import  { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Tài khoản", type: "text" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        // Gọi endpoint Flask để xác thực
        const res = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });
        const user = await res.json();
        if (res.ok && user) {
          // Trả object user cho NextAuth lưu vào session
          return { id: user.id, name: user.username, token: user.token };
        }
        return null;
      },
    }),
  ],

  session: { strategy: "jwt" },
  jwt: {
    secret: process.env.JWT_SECRET,
  },

  pages: {
    signIn: "/signin",  // bạn có thể custom UI tại đây
  },
};
