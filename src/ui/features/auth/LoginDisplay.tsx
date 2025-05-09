// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { User } from "@/types/User"
import { Button } from "@/ui/components/common/Button"
import { InputBox } from "@/ui/components/common/InputBox"
import { Label } from "@/ui/components/common/Label"
import { JSX, useState } from "react"
import { authenticateUser } from "./api/user-authentication"
import { setAuthToken } from "@/util/ApiRequest"

export const LoginDisplay = (): JSX.Element => {

    const [user, setUser] = useState<User>({})

    return <div className="h-screen w-screen flex flex-col gap-8 p-10" >
        <div className="grid grid-cols-1 gap-2">
            <Label label="Usuário:" />
            <InputBox
                type="text"
                onInput={(event) => {
                    const currentUser = user
                    currentUser.name = event.currentTarget.value
                    setUser(currentUser)
                }}
            />
            <Label label="Senha:" />
            <InputBox
                type="password"
                onInput={(event) => {
                    const currentUser = user
                    currentUser.password = event.currentTarget.value
                    setUser(currentUser)
                }}
            />
        </div>
        <div className="grid grid-cols-2 gap-8">
            <Button
                className="bg-gray-400 text-white hover:text-gray-500"
                onClick={() => {
                    authenticateUser(user)
                        .then((jwt) => {
                            setAuthToken(jwt.token)
                            //@ts-ignore
                            window.electronEvents.openMain()
                            //@ts-ignore
                            window.electronEvents.closeLogin()
                        })
                        .catch(() => console.log('falha'))
                }}
            >
                Entrar
            </Button>
            <Button
                className="bg-gray-500 text-white hover:text-gray-500"
                onClick={() => {
                    //@ts-ignore
                    window.electronEvents.closeLogin()
                }}>
                Cancelar
            </Button>
        </div>
    </div>
}
