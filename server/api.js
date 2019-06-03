const express = require('express')
const router = express.Router()

const bcrpyt = require('bcrypt')
const saltRounds = 10

const Profile = require('./profile')
const Post = require('./post')

router.get('/getprofiles', (req, res) => {
    Profile.find({ email: req.query.email, admin: true })
        .then(profile => {
            if (profile.length === 0) {
                return res.json({
                    confirmation: 'Invalid Admin Credentials',
                    data: "must be admin to access profiles"
                })
            } else {
                bcrpyt.compare(req.query.password, profile[0].passwordHash, (err, correct) => {
                    if (err) {
                        return res.json({
                            confirmation: 'Hashing Failure',
                            error: err
                        })
                    } else if (correct) {
                        Profile.find()
                            .then(profiles => {
                                return res.json({
                                    confirmation: 'Profiles Retrieved',
                                    data: profiles
                                })
                            })
                            .catch(err => {
                                return res.json({
                                    confirmation: 'Unable to Retrieve Profiles',
                                    error: err
                                })
                            })
                    } else {
                        return res.json({
                            confirmation: 'Invalid Admin Credentials',
                            data: "must be admin to access profiles"
                        })
                    }
                })

            }
        })
        .catch(err => {
            return res.json({
                confirmation: 'Request Error',
                error: err
            })
        })
})

router.get('/profilelogin', (req, res) => {
    Profile.find({ email: req.query.email })
        .then(profile => {
            if (profile.length === 0) {
                return res.json({
                    confirmation: 'Invalid Login Credentials Entered',
                    data: 0
                })
            }
            bcrpyt.compare(req.query.password, profile[0].passwordHash, (err, correct) => {
                if (err) {
                    return res.json({
                        confirmation: 'Hashing Failure',
                        data: 0
                    })
                } else if (correct) {
                    return res.json({
                        confirmation: 'Login Attempt Successful',
                        data: profile[0]
                    })
                } else {
                    return res.json({
                        confirmation: 'Invalid Login Credentials Entered',
                        data: 0
                    })
                }
            })
        })
        .catch(err => {
            return res.json({
                confirmation: 'Request Error',
                error: err
            })
        })
})

router.post('/addprofile', (req, res) => {
    bcrpyt.genSalt(saltRounds)
        .then(salt => {
            bcrpyt.hash(req.body.password, salt)
                .then(hash => {
                    const data = {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        passwordHash: hash,
                        admin: false
                    }
                    Profile.find({ email: req.body.email })
                        .then(profile => {
                            if (profile.length !== 0) {
                                return res.json({
                                    confirmation: 'Email Already in Use',
                                    data: 0
                                })
                            } else {
                                Profile.create(data)
                                    .then(profile => {
                                        return res.json({
                                            confirmation: 'Account Created',
                                            data: profile
                                        })
                                    })
                                    .catch(err => {
                                        return res.json({
                                            confirmation: 'Error Creating Account',
                                            error: err
                                        })
                                    })
                            }
                        })
                        .catch(err => {
                            return res.json({
                                confirmation: 'Request Error',
                                error: err
                            })
                        })
                })
                .catch(err => {
                    return res.json({
                        confirmation: 'Hashing Error',
                        error: err
                    })
                })
        })
        .catch(err => {
            return res.json({
                confirmation: 'Hashing Error',
                error: err
            })
        })
})

router.get('/allposts', (req, res) => {
    Post.find()
        .then(posts => {
            return res.json({
                confirmation: 'Posts Retrieved',
                data: posts
            })
        })
        .catch(err => {
            return res.json({
                confirmation: 'Request Error',
                error: err
            })
        })
})

router.post('/upvotepost', (req, res) => {
    Post.findById(req.body.id)
        .then(post => {
            let newVoters = post.voters
            let newVotes = post.votes
            if (newVoters.includes(req.body.voter)) {
                return res.json({
                    confirmation: 'User has already voted for this post',
                    data: 0
                })
            } else {
                newVoters.push(req.body.voter)
                newVotes = newVotes + 1
                Post.findByIdAndUpdate(post._id, {
                    voters: newVoters,
                    votes: newVotes
                }, { new: true })
                    .then(post => {
                        return res.json({
                            confirmation: 'Vote Cast',
                            data: post
                        })
                    })
                    .catch(err => {
                        return res.json({
                            confirmation: 'Error Updating with Vote Info',
                            error: err
                        })
                    })
            }
        })
        .catch(err => {
            return res.json({
                confirmation: 'Request Error',
                error: err
            })
        })
})

router.post('/addpost', (req, res) => {
    Post.create(req.body)
        .then(post => {
            return res.json({
                confirmation: 'Post Created',
                data: post
            })
        })
        .catch(err => {
            return res.json({
                confirmation: 'Post Error',
                error: err
            })
        })
})

router.post('/removepost', (req, res) => {
    Profile.find({ email: req.body.email, admin: true })
        .then(profile => {
            if (profile.length === 0) {
                return res.json({
                    confirmation: 'Invalid Admin Credentials',
                    data: "must be admin to delete post"
                })
            } else {
                bcrpyt.compare(req.body.password, profile[0].passwordHash, (err, correct) => {
                    if (err) {
                        return res.json({
                            confirmation: 'Hashing Error',
                            error: err
                        })
                    } else if (correct) {
                        Post.findByIdAndRemove(req.body.id)
                            .then(response => {
                                return res.json({
                                    confirmation: 'Post Removed',
                                    data: req.body.id
                                })
                            })
                            .catch(err => {
                                return res.json({
                                    confirmation: 'Error Removing Post',
                                    error: err
                                })
                            })
                    } else {
                        return res.json({
                            confirmation: 'Invalid Admin Credentials',
                            data: "must be admin to delete post"
                        })
                    }
                })
            }
        })
        .catch(err => {
            return res.json({
                confirmation: 'failure',
                error: err
            })
        })
})

router.post('/promoteadmin', (req, res) => {
    Profile.find({ email: req.body.email, admin: true })
        .then(profile => {
            if (profile.length === 0) {
                return res.json({
                    confirmation: 'Invalid Admin Credentials',
                    data: "must be admin to promote admin"
                })
            } else {
                bcrpyt.compare(req.body.password, profile[0].passwordHash, (err, correct) => {
                    if (err) {
                        return res.json({
                            confirmation: 'Hashing Error',
                            error: err
                        })
                    } else if (correct) {
                        Profile.findByIdAndUpdate(req.body.id, { admin: true }, { new: true })
                            .then(response => {
                                return res.json({
                                    confirmation: 'User Promoted to Admin',
                                    data: response
                                })
                            })
                            .catch(err => {
                                return res.json({
                                    confirmation: 'Error Updating User Profile',
                                    error: err
                                })
                            })
                    } else {
                        return res.json({
                            confirmation: 'Invalid Admin Credentials',
                            data: "must be admin to promote admin"
                        })
                    }
                })
            }
        })
        .catch(err => {
            return res.json({
                confirmation: 'Request Error',
                error: err
            })
        })
})

// router.get('/makeadmin', (req, res) => {
//     Profile.findByIdAndUpdate(req.query.id, { admin: true }, { new: true })
//         .then(response => {
//             return res.json({
//                 confirmation: 'success',
//                 data: response
//             })
//         })
//         .catch(err => {
//             return res.json({
//                 confirmation: 'failure',
//                 error: err
//             })
//         })
// })

// router.get('/unmakeadmin', (req, res) => {
//     Profile.findByIdAndUpdate(req.query.id, { admin: false }, { new: true })
//         .then(response => {
//             return res.json({
//                 confirmation: 'success',
//                 data: response
//             })
//         })
//         .catch(err => {
//             return res.json({
//                 confirmation: 'failure',
//                 error: err
//             })
//         })
// })

module.exports = router