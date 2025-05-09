import { JwtToken, User } from "@/types/User";
import { authUser } from "@/util/ApiRequest";

export async function authenticateUser(user: User): Promise<JwtToken> {
    const response = await authUser(user)
    
    if (response.error) {
        console.log(response.error)
        if (response.status == 401) console.log('Usuário ou senha incorretos')
    }

    return response.json
}
