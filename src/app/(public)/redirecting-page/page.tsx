import { cookies } from "next/headers"
import RedirectPageComponent from "./RedirectPage"
import { decodeToken } from "../../../utils/helper"

const RedirectPage = async() => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token") || ''
  const user = decodeToken(token)

  return (
    <RedirectPageComponent user={user} />
  )
}

export default RedirectPage
