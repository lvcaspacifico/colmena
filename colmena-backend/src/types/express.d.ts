declare namespace Express {
  export interface Request {
    user?: {
      id: number
      roleCode: number
    }
  }
}
