import { NextResponse } from 'next/server';
import { PrismaUserRepository } from '@/core/repositories/IUserRepository';
import { GetAllUsersUseCase } from '@/core/usecases/GetAllUser.usecase';
import { CreateUserUseCase } from '@/core/usecases/CreateUser.usecase';
import { CreateUserDto } from '@/core/dtos/User.dto';


const userRepository = new PrismaUserRepository();
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);

export async function GET() {
  try {
    const users = await getAllUsersUseCase.execute();
    return NextResponse.json(users, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Failed to fetch users', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateUserDto = await request.json();

    if (!body.firstName || !body.lastName || !body.email || !body.password) {
      return NextResponse.json({ message: 'Missing required fields: firstName, lastName, email, password' }, { status: 400 });
    }

    const newUser = await createUserUseCase.execute(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    if (error instanceof Error && error.message.includes('email already exists')) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to create user', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}