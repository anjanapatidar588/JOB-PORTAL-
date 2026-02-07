import { JOB } from '../models/job.model.js';
 

export const postJob = async (req,res) => {
    try {
        const {title,description,requirments,salary,location,jobtype,experience,position,companyId} = req.body;

        const userId = req.id;

        if(!title || !description || !requirments || !salary || !location || !jobtype || !experience || !position || !companyId ){
            return res.status(404).json({
                message : "Somthing is missing",
                success : false
            });
        };

        // create job for student

        const job = await JOB.create({
            title,
            description,
            requirments,
            
            salary : Number(salary), //if salary string me aati h
            location,
            jobtype,
            experienceLevel:experience,
            position,
            company : companyId,
            created_by : userId
        });

        return res.status(201).json({
            message : "new job created successfully.",
            job,
            success : true
        });


    } catch (error) {
        console.log(error);
    }
}

//get all jobs for student
//filter using query
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ]
    };


    //using populate we get information of company

    const jobs = await JOB.find(query).populate({
        path : "company"
    }).sort({createdAt : -1});

    if (jobs.length === 0) {
      return res.status(404).json({
        message: "Jobs not found",
        success: false
      });
    }

    return res.status(200).json({
      jobs,
      success: true
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};
                       

//get jobs by id

export const getJobById = async(req,res) => {
    try {
        const jobId = req.params.id;
        const job = await JOB.findById(jobId);

        if(!job){
            return res.status(404).json({
                message : "Jobs not found.",
                success : false
            });
        };

        return res.status(200).json({
            job,
            success : true,
        });
    } catch (error) {
        console.log(error);
    }
}

//job for admin --> admin kine job post kiya abhi tkk

export const getAdminJobs = async (req,res) => {
    try {
        const adminId = req.id;
        const jobs = await JOB.find({created_by : adminId});

        if(!jobs){
                  return res.status(404).json({
                message : "Jobs not found.",
                success : false
            });
        };

        return res.status(200).json({
            jobs,
            success : true
        });
    } catch (error) {
        console.log(error);
    }
}