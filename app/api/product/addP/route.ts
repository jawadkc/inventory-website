import { NextRequest, NextResponse } from "next/server";
import createProductModel from "@/models/productModel"; // Import your Product model here
//import { getPhoneFromToken } from "@/helpers/getPhoneFromToken";
import jwt from "jsonwebtoken";

const getPhoneFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || '';
        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
        return decodedToken.phone;
    } catch (error: any) {
        throw new Error(error.message);
    }

}


// Add a product to the database
export async function POST(request: any) {
    let phone = await getPhoneFromToken(request);
    let body = await request.json();

    try {
        let Product = createProductModel(phone);
        // Create a new product using the Product model
        const newProduct = new Product(body);
        // Save the new product to the database
        const savedProduct = await newProduct.save();
        Product.db.close();
        return NextResponse.json({ savedProduct });
    } catch (error) {
        console.error("Error adding a product:", error);

        return new NextResponse("Internal server error", { status: 500 });
    }
}


