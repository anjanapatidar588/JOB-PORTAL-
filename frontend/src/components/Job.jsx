import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'



const jobId = "yudjhfesjd"

const Job = () => {

    const navigate = useNavigate();
    return (
        <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">

            {/* top row */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">2 days ago</p>
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
                    <h1 className="font-medium text-lg">Company Name</h1>
                    <p className="text-sm text-gray-500">India</p>
                </div>
            </div>

            <div>
                {/* job title */}
                <h1 className="font-bold text-lg my-2">Title</h1>

                {/* description */}
                <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Assumenda eos provident a, dolorem perferendis ducimus
                    deserunt nesciunt quae sequi. Ab?
                </p>
            </div>

            <div className="flex items-center gap-2 mt-4">
                <Badge className={"text-blue-700 font-bold"} variant="ghost">
                    12 Positions
                </Badge>
                <Badge className={"text-orange-500 font-bold"} variant="ghost">
                    Part Time
                </Badge>
                <Badge className={"text-purple-700 font-bold"} variant="ghost">
                    24 LPA
                </Badge>
            </div>

            <div className="flex items-center gap-4 mt-4">
                <Button
                    onClick={() => navigate(`/description/${jobId}`)}
                    variant="outline"
                >
                    Details
                </Button>

                <Button className="bg-purple-700 hover:bg-purple-900">
                    Save For Later
                </Button>
            </div>

        </div>
    )
}

export default Job

