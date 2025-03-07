import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { getSession, signOut } from "next-auth/react"

type PromiseHandlers = {
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}

// const refreshUrl = "admin/refresh-token"

const userInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

const failedAdminQueue: any = []

userInstance.interceptors.request.use(
  handleRequest as (req: AxiosRequestConfig) => Promise<any>
)

userInstance.interceptors.response.use(
  (response: AxiosResponse) => response, // Return response as is
  async (error: AxiosError) => {
    // If the error is a 401 Unauthorized error, sign out the user
    if (error.response?.status === 401) {
      console.log("Session expired or unauthorized access. Signing out...")

      await signOut({ callbackUrl: "/login", redirect: true })
    }
    return Promise.reject(error)
  }
)

async function handleRequest(req: AxiosRequestConfig) {
  try {
    const session = await getSession()

    if (session?.accessToken && req.headers) {
      req.headers.Authorization = `Bearer ${session.accessToken}`
    }

    return req
  } catch (error) {
    return Promise.reject(error)
  }
}
export default userInstance;
