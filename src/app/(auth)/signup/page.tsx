import { SignUpForm } from "../_components/signupForm"

export default async function SignUpPage() {

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex items-center justify-center p-6">
        <SignUpForm className="mx-auto min-w-[40%]" />
      </div>
      <div className="bg-muted relative hidden lg:block">
        {/* <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
      </div>
    </div>
  )
}
