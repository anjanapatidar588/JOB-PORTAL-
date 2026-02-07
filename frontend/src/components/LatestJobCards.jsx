import { Badge } from './ui/badge'
import React from 'react'

const LatestJobCards = () => {
    return (
        <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer">
            <div>
                <h1 className="font-semibold text-lg">Company Name</h1>
                <p className="text-sm text-gray-500">India</p>
            </div>

            <div>
                <h1 className="font-medium">Job Title</h1>
                <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit  dkjhy hfduj jdf ksjihi kjgkg.
                </p>
            </div>

            <div className="flex items-center gap-2 mt-4">
                <Badge  className={"text-blue-700 font-bold"} variant="ghost">
                    12 Positions
                </Badge>
                <Badge  className={"text-orange-500 font-bold"} variant="ghost">
                    Part Time
                </Badge>
                <Badge  className={"text-purple-700 font-bold"} variant="ghost">
                    24 LPA
                </Badge>
            </div>
        </div>
    )
}


export default LatestJobCards
