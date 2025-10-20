import { redirect } from 'next/navigation'

export default function Page() {
  // Redirect to the new editor as the default home page
  redirect('/editor')
}
