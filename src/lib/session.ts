"use server";
import { auth } from './auth';
import { headers } from 'next/headers';


export async function getCurrentUser(): Promise<typeof auth.$Infer.Session['user'] | null>  {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      console.log('USER NOT FOUND');
    };

    return session?.user || null;
  } catch (error) {
    console.log('ERROR GETTING CURRENT USER: USER NOT FOUND', error);
    return null;
  }
}

export async function getSession(): Promise<typeof auth.$Infer.Session | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.log('SESSION NOT FOUND');
    }

    return session;
  } catch (error) {
    console.log('ERROR GETTING SESSION:', error);
    return null;
  }
}

