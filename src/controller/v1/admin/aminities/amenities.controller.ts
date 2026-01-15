import { RequestHandler } from 'express';
import db from '../../../../db';
import { amenities } from '../../../../db/schema';

export const getAllAmenities: RequestHandler = async (req, res, next) => {
    try {
        const data = await db.query.amenities.findMany({
            columns: {
                id: true,
                name: true,
            },
            orderBy: (amenities, { asc }) => [asc(amenities.name)],
        });

        res.status(200).json({
            message: 'Amenities fetched successfully',
            data,
        });
    } catch (error) {
        console.error('Get amenities error:', error);
        next(error);
    }
};

export const addAminities: RequestHandler = async (req, res, next) => {
    try {
        const { name } = req.body;
        const data = await db.insert(amenities).values({ name }).returning();

        res.status(201).json({
            message: 'Amenity added successfully',
            data,
        });
    } catch (error) {
        console.error('Add amenities error:', error);
        next(error);
    }
};
