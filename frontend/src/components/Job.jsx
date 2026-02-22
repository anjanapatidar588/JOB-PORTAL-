import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'



// const jobId = "yudjhfesjd"

const Job = ({job}) => {

    const navigate = useNavigate();
    const dayAgofunction = (mongodbTime) => {
      const createdAt = new Date(mongodbTime);
      const currentTime = new Date();
      const timeDifference = currentTime - createdAt;
      return Math.floor(timeDifference / (1000*24*60*60))
    }


    return (
        <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">

            {/* top row */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{dayAgofunction(job?.createdAt) == 0  ? "Today" : `${dayAgofunction(job?.createdAt)} days ago`}</p>
                <Button
                    variant="outline"
                    className="rounded-full"
                    size="icon"
                >
                    <Bookmark />
                </Button>
            </div>

            {/* company info */}
            <div className="flex items-center gap-2 my-4">
                <Button variant="outline" size="icon" className="p-0">
                    <Avatar>
                        <AvatarImage src="https://png.pngtree.com/png-vector/20190304/ourmid/pngtree-growth-business-company-logo-png-image_728232.jpg" />

                    </Avatar>
                </Button>

                <div>
                    <h1 className="font-medium text-lg">{job?.company?.name}</h1>
                    <p className="text-sm text-gray-500">India</p>
                </div>
            </div>

            <div>
                {/* job title */}
                <h1 className="font-bold text-lg my-2">{job?.title}</h1>

                {/* description */}
                <p className="text-sm text-gray-600">
                   {job?.description}
                </p>
            </div>

            <div className="flex items-center gap-2 mt-4">
                <Badge className={"text-blue-700 font-bold"} variant="ghost">
                    {job?.position} Positions
                </Badge>
                <Badge className={"text-orange-500 font-bold"} variant="ghost">
                   {job?.jobtype}
                </Badge>
                <Badge className={"text-purple-700 font-bold"} variant="ghost">
                    {job?.salary} LPA
                </Badge>
            </div>

            <div className="flex items-center gap-4 mt-4">
                <Button
                    onClick={() => navigate(`/description/${job?._id}`)}
                    variant="outline"
                >
                    Details
                </Button>

                <Button className="bg-green-700 hover:bg-green-900">
                    Save For Later
                </Button>
            </div>

        </div>
    )
}

export default Job

