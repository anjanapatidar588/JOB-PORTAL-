import React from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from '@radix-ui/react-label'


const filterData = [
    {
        filterType: "location",
        array: ["Delhi NCR", "Banglore", "Pune", "Mumbai"]
    },

    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend", "Fullstack", "Data Science"]
    },

    {
        filterType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh-5lakh"]
    }
]
const FilterCard = () => {
    return (
        <div className='w-full bg-white p-3 rounded-mg'>
            <h1 className='text-lg ml-12 font-bold'>Filter Jobs</h1>
            <hr className='mt-3' />
            <RadioGroup >
                {
                    filterData.map((data, index) => (
                        <div >
                            <h1 className='font-bold text-lg ml-12'>{data.filterType}</h1>
                            <div className='ml-7'>
                                {
                                data.array.map((item, index) => {
                                    return (
                                        <div className='flex items-center space-x-2 my-2 '>

                                            <RadioGroupItem value={item} />
                                            <Label>{item}</Label>
                                        </div>
                                        )

                                })
                            }
                            </div>
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
    )
}

export default FilterCard
