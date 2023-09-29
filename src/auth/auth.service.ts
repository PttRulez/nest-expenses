import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signup(dto: AuthDto) {
    // check if user exists
    const userExists = await this.prismaService.user.findFirst({
      where: { email: dto.email },
    });
    console.log('userExists', userExists);
    if (userExists) throw new ForbiddenException('Credentials incorrect');

    // hash password
    const hashedPassword = await hash(dto.password);

    // store the user in db
    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        hash: hashedPassword,
      },
    });

    return { id: user.id, email: user.email, role: user.role };
  }

  async signin(dto: AuthDto) {
    const userFound = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!userFound) throw new ForbiddenException('Credentials incorrect');

    const passwordMatches = await verify(userFound.hash, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Credentials incorrect');

    return { id: userFound.id, email: userFound.email, role: userFound.role };
  }
}
