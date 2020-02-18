const express=require('express')
const router=express.Router()
const auth=require('../../middleware/auth')
const Profile=require('../../models/profile')
const User = require('../../models/User');

const { check, validationResult } = require('express-validator');

// @route    GET api/profile/me
// @desc     get my profile
// @access   private

router.get ('/me', auth, async(req,res)=>{
try {
    const myProfile= await Profile.findOne({user:req.user.id}).populate('user',['name','avatar'])
    if(!myProfile){
    return res.status(400).json({
        msg:'there is no profile for you'
    })

        }
        res.json(myProfile)


} catch (err) {
    console.error(err.message)
    res.status(500).send('server error ')
}
});
//post  api/profile
//create and update profile
//private(nead to be auth(login))

router.post('/',[auth,[
    check('status','please give us your  status ').not().isEmpty(),
    check('skills','please tell us your skills ').not().isEmpty()
    ]],async(req,res)=>{
    //check error validation
        const errors=validationResult(req)
            if(!errors.isEmpty()){
              return  res.status(400).json({errors:errors.array()})

                }
            const{
                company,
                website,
                location,
                bio,
                status,
                githubusername,
                skills,
                youtube,
                facebook,
                twitter,
                instgrame,
                linkedin,
                
        } = req.body
        
        //build profile object
        const profileFields = {}
        profileFields.user = req.user.id
        if (company) profileFields.company = company
        if (website) profileFields.website = website
        if (location) profileFields.location = location
        if (bio) profileFields.bio = bio
        if (status) profileFields.status = status
        if(githubusername) profileFields.githubusername=githubusername
        if (skills) {
             profileFields.skills=skills.split(',').map(skill=>skill.trim())
        }   
  
        
        // build social object
         profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube
        if (twitter) profileFields.social.twitter = twitter
        if (facebook) profileFields.social.facebook = facebook
        if (linkedin) profileFields.social.linkedin = linkedin
       // if (instagram) profileFields.social.instagram = instagram
    
        
        try {
              
            let profile = await Profile.findOne({ user: req.user.id })
            if (profile) {
                //update profile fiels 
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true },
                    
                )
                return res.json(profile)
            }
            //create profile
            try {
               profile = new Profile(profileFields)
                
                        await profile.save()
                      res.json(profile)

            } catch (error) {
                console.error(error.message);
                        res.status(400).send('profile doesnt created')
            }

           

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
            
        }
     }
)
//get  api/profile
//get all profile with user [name and avatar]
//puplic

router.get('/',async (req, res) => {
    
try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json({numofprofile:profiles.length,profiles})

} catch (err) {
     console.error(err.message);
            res.status(500).send('Server Error')
}



})
//get  api/profile/user/:user_id
//get profile by user id 
//puplic

router.get('/user/:user_id',async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar'])
  
        
        if(!profile) 
        return res.status(400).json({msg:'profile not found'})
        

        res.json(profile)
    
    } catch (err) {
         console.error(err.message);
         if(err.kind !=='ObjecId'){
            return res.status(400).json({msg:'profile with that id not found'})
         }
         res.status(500).send('Server Error')
    }
    
})


//delete  api/profile
//removed profile with his user name and his posts 
//private

router.delete('/',auth,async(req,res)=>{
    try {
        //remove profile
        await Profile.findOneAndRemove({user:req.user.id})

        //delete user profile owner
        await User.findOneAndRemove({_id:req.user.id})

        res.json('user and his profile is deleted')

    } catch (err) {
        console.error(err.message);
        res.status(500).send('serever erroe')
        
    }
})


//put  api/profile/experince
//put experience array  inside prfile 
//private
router.put('/experience',[auth,[
    check('title','title is required ').not().isEmpty(),
    check('company','company is requires').not().isEmpty(),
    check('from','from date  is requires').not().isEmpty()

    ]],async(req,res)=>{

const errors=validationResult(req)
if(!errors.isEmpty()){
   return res.status(400).json({errors:errors.array()})
}
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }=req.body

    const newExp={
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        
        const profile=await Profile.findOne({user:req.user.id})
        //i cat user push put unshift put new experience at the end of array
        profile.experience.unshift(newExp)

         await profile.save()

         res.status(200).json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
    }
        
    })

//delete  api/profile/experince/:id
//delete experience from prfile 
//private


router.delete('/experience/:exp_id',auth,async(req,res)=>{

    try {
        const profile=await Profile.findOne({user:req.user.id})
        //get removed index
        const removedExp=profile.experience
        .map(el=>{el.id})
        .indexOf(req.params.exp_id)


        profile.experience.splice(removedExp,1)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
    }
})

//////add eduaction

//put  api/profile/experince
//put education array  inside prfile 
//private




router.put('/education',[auth,[
    check('school','school is required ').not().isEmpty(),
    check('degree','degree is requires').not().isEmpty(),
    check('fieldofstudy','fieldofstudy date  is requires').not().isEmpty()

    ]],async(req,res)=>{

const errors=validationResult(req)
if(!errors.isEmpty()){
   return res.status(400).json({errors:errors.array()})
}
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }=req.body

    const newEducation={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        
        const profile=await Profile.findOne({user:req.user.id})
        //i can use push put unshift put new experience at the end of array
        profile.education.unshift(newEducation)

         await profile.save()

         res.status(200).json({length:profile.education.length,profile})

    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
    }
        
    })

//delete  api/profile/experince/:id
//delete experience from prfile 
//private


router.delete('/experience/:exp_id',auth,async(req,res)=>{

    try {
        const profile=await Profile.findOne({user:req.user.id})
        //get removed index
        const removedExp=profile.experience
        .map(el=>{el.id})
        .indexOf(req.params.exp_id)


        profile.experience.splice(removedExp,1)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
    }
})





module.exports = router;