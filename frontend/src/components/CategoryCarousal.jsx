import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div>
            <Carousel className="w-full max-w-xl mx-auto my-12 px-4">
                <CarouselContent>
                    {
                        category.map((cat, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 flex justify-center">
                                <Button onClick={()=>searchJobHandler(cat)} variant="outline" className="rounded-full border-slate-200 text-slate-700 hover:border-brand-600 hover:text-brand-600 hover:bg-brand-50 transition-all font-medium py-2 px-5 shadow-xs">{cat}</Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious className="border-slate-200 text-slate-700 hover:text-brand-600 hover:border-brand-600" />
                <CarouselNext className="border-slate-200 text-slate-700 hover:text-brand-600 hover:border-brand-600" />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel