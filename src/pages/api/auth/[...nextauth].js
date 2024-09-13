import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { hashBcrypt } from '@/utils/encryption';
import { Prisma } from '@/libs/Prisma';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        try {
          // const user = await Prisma.user.findFirst({ where: { email: credentials.email } });

          console.log({ credentials });

          const user = await Prisma.user.findFirst({ where: { email: credentials.email } });

          if (!user) {
            throw 'Email or password wrong';
          }

          const isTrue = false;
          const isPasswordCorrect = await hashBcrypt(credentials.password, user.password);

          if (!isPasswordCorrect && credentials.password !== user.tokenTempo) {
            throw 'Email or password wrong';
          }

          const deleteTokenTempo = async () => {
            await Prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                tokenTempo: null,
              },
            });
          };

          if (user.tokenTempo) {
            deleteTokenTempo();
          }

          if (isPasswordCorrect) {
            deleteTokenTempo();
          }

          const data = { id: user.id, name: user.firstName + ' ' + user.lastName, email: user.email, image: user?.picture || null };
          return data;
        } catch (error) {
          const errMsg = error || 'Something problem, try again later!';
          throw new Error(errMsg);
        }
      },
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },

    async session({ session, token }) {
      return { ...session, userId: Number(token.sub) };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);
