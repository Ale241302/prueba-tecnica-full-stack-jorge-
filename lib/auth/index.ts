import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      scope: ["user:email", "read:user"],
      getUserInfo: async (token: any) => {
        // 1. Fetch GitHub profile
        const profileRes = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "User-Agent": "FinanceApp",
            Accept: "application/vnd.github+json",
          },
        });

        if (!profileRes.ok) {
          console.error("[GitHub Auth] Failed to fetch profile:", profileRes.status);
          return null;
        }

        const profile = await profileRes.json();
        let email = profile.email;

        // 2. If no public email, fetch from /user/emails
        if (!email) {
          try {
            const emailsRes = await fetch("https://api.github.com/user/emails", {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
                "User-Agent": "FinanceApp",
                Accept: "application/vnd.github+json",
              },
            });

            if (emailsRes.ok) {
              const emails = await emailsRes.json();
              console.log("[GitHub Auth] Emails response:", JSON.stringify(emails));

              if (Array.isArray(emails) && emails.length > 0) {
                const primary = emails.find((e: any) => e.primary && e.verified);
                const verified = emails.find((e: any) => e.verified);
                const first = emails[0];
                email = (primary || verified || first)?.email;
              }
            } else {
              const errorText = await emailsRes.text();
              console.error("[GitHub Auth] Failed to fetch emails:", emailsRes.status, errorText);
            }
          } catch (err) {
            console.error("[GitHub Auth] Error fetching emails:", err);
          }
        }

        // 3. Last resort: use noreply email
        if (!email) {
          email = `${profile.id}+${profile.login}@users.noreply.github.com`;
          console.warn("[GitHub Auth] Using noreply email fallback:", email);
        }

        return {
          user: {
            id: String(profile.id),
            name: profile.name || profile.login,
            email: email,
            image: profile.avatar_url,
            emailVerified: true,
          },
          data: profile,
        };
      },
    },
  },
  user: {
    additionalFields: {
      phone: {
        type: 'string',
        required: false,
        defaultValue: null,
        input: true,
      },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'ADMIN',
        input: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
