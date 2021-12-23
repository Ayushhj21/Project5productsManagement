

const userAws = async (req, res)=>{
    try {
        let files = req.files;
        console.log(files)
        if (files && files.length > 0) {
            //upload to s3 and return true..incase of error in uploading this will goto catch block( as rejected promise)
            let uploadedFileURL = await uploadFile(files[0]); // expect this function to take file as input and give url of uploaded file as output 
            res.status(201).send({ status: true, data: uploadedFileURL });

        }
        else {
            res.status(400).send({ status: false, msg: "No file to write" });
        }
    }
    catch (e) {
        console.log("error is: ", e);
        res.status(500).send({ status: false, msg: "Error in uploading file to s3" });
    }
};

module.exports.userAws=userAws