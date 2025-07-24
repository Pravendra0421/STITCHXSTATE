import { NextResponse } from "next/server";
import { PrismaUserRepository } from "@/core/repositories/IUserRepository";
import { GetUserByIdUseCase } from "@/core/usecases/GetUserById.usecase";
import { UpdateUserUseCase } from "@/core/usecases/UpdateUser.usecase";
import { UpdateUserDto } from "@/core/dtos/User.dto";
import { DeleteUserUseCase } from "@/core/usecases/DeleteUser.usecase";

const userRepository = new PrismaUserRepository;
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUsecase = new DeleteUserUseCase(userRepository);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
){
    try{
        const {id} = await params;
        if(!id){
            return NextResponse.json({message:"missing user id in request "},{status:400});
        }
        const user = await getUserByIdUseCase.execute(id);
        if(!user){
            return NextResponse.json({message:'user not found '},{status:404});
        }
        return NextResponse.json(user,{status:200});
    }
    catch(error: unknown){
        console.error('Error fetching user by id :', error);
        return NextResponse.json({ message: "failed  to fetch user ", error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

export async function PUT(
    request:Request,{params}:{params:Promise<{id:string}>}
){
    try{
        const {id} = await params;
        if(!id){
            return NextResponse.json({message:"missing user id in request "},{status:400});
        }
        const body:UpdateUserDto = await request.json();
        const updatedUser = await updateUserUseCase.execute(id,body);
        if(!updatedUser){
            return NextResponse.json({message:"user not found "},{status:404});
        }
        return NextResponse.json(updatedUser,{status:200});      
    }
    catch(error: unknown){
        console.error('error updating user ', error);
        return NextResponse.json({ message: 'Failed  to update user ', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: 'Missing user id in request' }, { status: 400 });
    }

    const deleted = await deleteUserUsecase.execute(id); // return the boolean either true or false

    if (!deleted) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Failed to delete user', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
