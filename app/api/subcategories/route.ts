import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SubCategory from '@/model/subCategoryModel';
import Category from '@/model/categoryModel';
import { connectDB } from '@/lib/db'; // Your DB connection utility7


export async function GET(request: NextRequest) {
  try {


    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');


    if (!categoryId) {
      return NextResponse.json(
        { error: 'categoryId is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const subCategories = await SubCategory.find({
      category: categoryId
    })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: subCategories.length,
      subCategories
    });

  } catch (error) {
    console.error('GET subcategories error:', error);
    return NextResponse.json(
      { error: 'Server error fetching subcategories' },
      { status: 500 }
    );
  }
}



// POST create new subcategory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // console.log(body)
    
    // Validation
    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Validate category exists
    const categoryExists = await Category.findById(body.category);
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Parent category not found' },
        { status: 404 }
      );
    }

    // Check for existing subcategory
    const existingSubCategory = await SubCategory.findOne({
      name: body.name,
      category: body.category
    });

    if (existingSubCategory) {
      return NextResponse.json(
        { error: 'Subcategory already exists for this category' },
        { status: 409 }
      );
    }

    // Create new subcategory
    const newSubCategory = await SubCategory.create({
      name: body.name,
      category: body.category
    });

    // console.log(newSubCategory)


    return NextResponse.json(
      { success: true, subCategory: newSubCategory },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST subcategory error:', error);
    return NextResponse.json(
      { error: 'Server error creating subcategory' },
      { status: 500 }
    );
  }
}
