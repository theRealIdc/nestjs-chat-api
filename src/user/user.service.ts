import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async getUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return users;
    // console.log(users);
    // return [
    //   {
    //     id: 1,
    //     name: 'John Doe',
    //     email: 'idc@gmail.com',
    //   },
    // ];
  }
  getUser({ userId }: { userId: string }) {
    const user = this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return user;
  }
}
