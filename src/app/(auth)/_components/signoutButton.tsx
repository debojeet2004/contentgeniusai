'use client'
import React from 'react'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth-client'


export default function SignoutButton() {

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Successfully signed out!');
            redirect('/login');
          },
        },
      });
    } catch (error) {
      toast.error('Failed to sign out. Please try again.');
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Button 
      onClick={handleSignOut}
      variant="destructive"
      disabled={isLoading}
    >
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </Button>
  )
}