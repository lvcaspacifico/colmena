type UserRoleCodeAPIResponse =  1 | 2 | 3

type UserAPIResponse = {
    token: string
    user: {
        id: number
        nickname: string
        email: string
        roleCode: UserRoleCodeAPIResponse
        birthdate: string
        createdAt: string
    }
}