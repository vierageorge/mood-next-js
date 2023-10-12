import { prisma } from './db';
import { auth } from '@clerk/nextjs';

export const getUserByClerkId = async () => {
  const { userId } = auth();
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId as string,
    },
  });
  return user;
};
