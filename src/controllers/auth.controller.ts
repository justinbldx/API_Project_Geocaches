import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import bcrypt from 'bcrypt';

export class AuthController {
    constructor(
        private readonly userService: UserService = new UserService()
    ) { }

    login = async (req: Request, res: Response): Promise<void> => {
        const { username, password } = req.body;
        const user = await this.userService.getByUsername(username);

        if (!user) {
            res.status(401).json({ message: 'Identifiants invalides' });
            return;
        }

        if (await bcrypt.compare(password, user.password!)) {
            const userWithNetworks = await this.userService.getUserNetworks(user);
            const { password: _password, ...userWithoutPassword } = userWithNetworks as typeof userWithNetworks & { password?: string };

            res.status(200).json({ 
                token: jwt.sign({ 
                    id: Number.parseInt(user.id.toString()),
                    username: user.username, 
                    role: user.role
                }, process.env.JWT_SECRET!, { expiresIn: '24h' }),
                user: userWithoutPassword
            });
        } else {
            res.status(401).json({ message: 'Identifiants invalides' });
        }
    }
}