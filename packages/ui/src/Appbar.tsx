import { Button } from "./Button"
import { RedirectableProviderType } from "next-auth/providers/index"

interface AppbarProps {
    user?: {
        name?: string | null
    },
    onSignin: any,
    onSignout: any
}

export const Appbar = ({
    user, onSignin, onSignout
}: AppbarProps) => {
    return <div className="flex justify-between border-b border-slate-300 p-2 px-4">
        <div className="text-lg flex flex-col justify-center">
            PayOP
        </div>
        <div className="flex flex-col justify-center">
            <Button onClick={user ? onSignout : onSignin}>{user ? "Logout" : "Login"}</Button>
        </div>
    </div>
}