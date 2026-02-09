import { Badge } from './ui/badge'
import React from 'react'

const LatestJobCards = ({job}) => {
    return (
        <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer">
            <div>
                <h1 className="font-semibold text-lg">{job?.company?.name}</h1>
                <p className="text-sm text-gray-500">India</p>
            </div>

            <div>
                <h1 className="font-medium"> { job?.title}</h1>
                <p className="text-sm text-gray-600">
                  {job?.description}
                </p>
            </div>

            <div className="flex items-center gap-2 mt-4">
                <Badge  className={"text-blue-700 font-bold"} variant="ghost">
                   {job?.position} Positions
                </Badge>
                <Badge  className={"text-orange-500 font-bold"} variant="ghost">
                    {job?.jobtype}
                </Badge>
                <Badge  className={"text-purple-700 font-bold"} variant="ghost">
                    {job?.salary}
                </Badge>
            </div>
        </div>
    )
}


export default LatestJobCards
