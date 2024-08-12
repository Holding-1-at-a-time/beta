const authConfig = {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationId: 'convex',
    },
  ],
};

export default authConfig;