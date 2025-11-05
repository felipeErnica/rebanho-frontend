import { JwtToken, User } from "@/shared/entities/User";
import { authUser } from "@/util/ApiRequest";

export async function authenticateUser(user: User): Promise<JwtToken> {
    const response = await authUser(user)
    return response.json
}
