import { HomePageUseCases } from '@/core/usecases/HomePage.usecase';
import { HomePageRepository } from '@/core/repositories/IHomePageRepository';
import { NextResponse } from 'next/server';

// Instantiate repository and use case (often done via a dependency injection container in larger apps)
const homepageRepository = new HomePageRepository();
const homepageUseCases = new HomePageUseCases(homepageRepository);

export async function GET() {
  try {
    const homepage = await homepageUseCases.getHomepage();
    if (!homepage) {
      return NextResponse.json({ message: 'Homepage not found or could not be created' }, { status: 404 });
    }
    return NextResponse.json(homepage, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json(); // This should be of type UpdateHomepageDTO
    const updatedHomepage = await homepageUseCases.updateHomePage(data);
    return NextResponse.json(updatedHomepage, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Error updating homepage' }, { status: 500 });
  }
}