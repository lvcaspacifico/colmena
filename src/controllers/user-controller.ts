import { InternalAppError } from "@/utils/Errors/InternalAppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { UserRole } from "@/utils/Enums/UserRoles";
import { hash } from "bcrypt";
import { z } from "zod";


class UserController {

    async create(request: Request, response: Response){
        const bodySchema = z.object({
            nickname: z.string()
            .trim()
            .min(2, { message: "Nickname it's required and it must be at leats 2 characters long"})
            .max(30, { message: "Nickname must be at most 30 characters long" }),
            email: z.email({ message: "Email is required and must be a valid formate up to 100 characters"}),
            password: z.string()
            .trim()
            .min(2, { message: "Password it's required and it must be at leats 8 characters long"})
            .max(60, { message: "Password must be at most 60 characters long" }),
            
            roleCode: z.number().refine(val => Object.values(UserRole).includes(val), 
            { message: "Role code must be a valid UserRole | 1=Admin,2=PO,3=Dev" }),
            birthdate: z.string()
                .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Birthdate must be in YYYY-MM-DD format" })
                .transform((str) => new Date(str))
                .refine((date) => date <= new Date(), { message: "Birthdate cannot be in the future" })
            });
            
            const { nickname, email, password, roleCode, birthdate } = bodySchema.parse(request.body);
            
            console.log( { nickname, email, password, roleCode, birthdate } )

            const userWithSameEmail = await prisma.user.findFirst({ where: { email } });

            if (userWithSameEmail) throw new InternalAppError("Já existe um usuário cadastrado com esse e-mail");
            
            const hashedPassword = await hash(password, 8)

            const user = await prisma.user.create({
                data: {
                    nickname,
                    email,
                    password: hashedPassword,
                    roleCode,
                    birthdate
                },
            })

            return response.status(201).json(user);
        }









}

export { UserController };