import { Button } from "@/ui/components/common/Button"
import { InputBox } from "@/ui/components/common/InputBox"
import { Label } from "@/ui/components/common/Label"
import { JSX } from "react"

export const LoginDisplay = (): JSX.Element => {
    return <div className="h-screen w-screen flex flex-col gap-8 p-10" >
        <div className="grid grid-cols-1 gap-2">
            <Label label="Usuário:" />
            <InputBox type="text" />
            <Label label="Senha:" />
            <InputBox type="password" />
        </div>
        <div className="grid grid-cols-2 gap-8">
            <Button className="bg-gray-500">Entrar</Button>
            <Button 
                className="bg-gray-500" 
                onClick={() => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                window.electronEvents.closeLogin()
            }}>
                Cancelar
            </Button>
        </div>
    </div>
}
