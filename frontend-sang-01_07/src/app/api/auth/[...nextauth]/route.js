import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { authOptions } from "./authOptions";
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


// {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//       clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   session: {
//     jwt: true,
//   },
//   // NEXT_PUBLIC_BACKEND_SERVER_MEDIA
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       // console.log('singIn callback', { account, profile, user });
//       if (
//         account &&
//         account.provider === 'google' &&
//         profile &&
//         'email_verified' in profile
//       ) {
//         if (!profile.email_verified) return false;
//       }
//       return true;
//     },

//     async jwt({ token, trigger, account, user, session }) {
//       // console.log('jwt callback', {
//       //   token,
//       //   trigger,
//       //   account,
//       //   user,
//       //   session,
//       // });

//       if (account) {
//         if (account.provider === 'google') {
//           // we now know we are doing a sign in using GoogleProvider
//           try {
//             const strapiResponse = await fetch(
//               `${process.env.NEXT_PUBLIC_BACKEND_SERVER_MEDIA}/api/auth/${account.provider}/callback?access_token=${account.access_token}`,
//               { cache: 'no-cache' }
//             );
//             if (!strapiResponse.ok) {
//               const strapiError = await strapiResponse.json();
//               // console.log('strapiError', strapiError);
//               throw new Error(strapiError.error.message);
//             }
//             const strapiLoginResponse =
//               await strapiResponse.json();
//             // customize token
//             // name and email will already be on here
//             token.strapiToken = strapiLoginResponse.jwt;
//             token.strapiUserId = strapiLoginResponse.user.id;
//             token.provider = account.provider;
//             token.blocked = strapiLoginResponse.user.blocked;
//             // Set local storage
//           } catch (error) {
//             throw error;
//           }
//         }
//       }

//       return token;
//     },
//     async session({ token, session }) {
//       // console.log('session callback', {
//       //   token,
//       //   session,
//       // });

//       session.strapiToken = token.strapiToken;
//       session.provider = token.provider;
//       session.user.strapiUserId = token.strapiUserId;
//       session.user.blocked = token.blocked;
//       return session;
//     },
//   },
//   session: {
//     strategy: 'jwt',
//   },
// }