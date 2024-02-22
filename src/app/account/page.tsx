import { getServerAuthSession } from "@/server/auth"

async function page() {

  const session = await getServerAuthSession()
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false, // Temporary redirect
      },
      props: {}, // No props needed
    };
  }
  return <div>Hello account {session.user.id}</div>
}

export default page
