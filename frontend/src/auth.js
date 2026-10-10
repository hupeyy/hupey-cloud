import { SvelteKitAuth } from '@auth/sveltekit';
import Authentik from '@auth/sveltekit/providers/authentik';

const ADMIN_GROUP = 'authentik Admins';

// Reads AUTH_SECRET and AUTH_AUTHENTIK_{ID,SECRET,ISSUER} from the environment.
export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [Authentik],
	trustHost: true,
	pages: { signIn: '/login' },
	callbacks: {
		jwt({ token, profile }) {
			if (profile) token.groups = profile.groups ?? [];
			return token;
		},
		session({ session, token }) {
			session.user.groups = token.groups ?? [];
			session.user.isAdmin = session.user.groups.includes(ADMIN_GROUP);
			return session;
		}
	}
});
