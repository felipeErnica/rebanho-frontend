/* eslint-disable @typescript-eslint/ban-ts-comment */
import { User } from "@/types/User"
import { Button } from "@/ui/components/common/Button"
import { InputBox } from "@/ui/components/common/InputBox"
import { JSX, useState } from "react"
import { authenticateUser } from "./api/user-authentication"

export const LoginDisplay = (): JSX.Element => {

    const [user, setUser] = useState<User>({})

    return <div className="h-screen w-screen flex flex-col gap-8 px-10 py-20" >
        <div className="grid grid-cols-1 gap-6">
            <InputBox
                type="text"
                placeholder="Usuário..."
                className="border-gray-700"
                onInput={(event) => {
                    const currentUser = user
                    currentUser.name = event.currentTarget.value
                    setUser(currentUser)
                }}
            />
            <InputBox
                type="password"
                className="border-gray-700"
                placeholder="Senha..."
                onInput={(event) => {
                    const currentUser = user
                    currentUser.password = event.currentTarget.value
                    setUser(currentUser)
                }}
            />
        </div>
        <div className="grid grid-rows-2 gap-4">
            <Button
                className="bg-gray-700 focus:bg-gray-400 text-white hover:bg-gray-400"
                onClick={() => {
                    authenticateUser(user)
                        .then((jwt) => {
                            const token = jwt.token
                            //@ts-ignore
                            window.electronEvents.setAuthToken(token)
                            //@ts-ignore
                            window.electronEvents.openMain()
                        })
                        .catch((err) => console.log(`falha: ${err}`))
                }}
            >
                Entrar
            </Button>
            <Button
                //className="focus:bg-gray-400 text-white hover:bg-gray-400"
                onClick={() => {
                    //@ts-ignore
                    window.electronEvents.closeLogin()
                }}>
                Cancelar
            </Button>
        </div>
    </div>
}
