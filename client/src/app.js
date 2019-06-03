import React from 'react';
import { Box, Flex } from 'rebass'
import './app.css';

const axios = require('axios')

const SERVER_BASE_ADDRESS = 'http://localhost:5000'


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            // Page Displays
            displayLogin: true,
            displaySignup: false,
            displayPosts: false,
            displayPostsAdmin: false,
            displayUsersAdmin: false,

            // User Data
            email: '',
            password: '',
            confirmPassword: '',
            firstname: '',
            lastname: '',
            id: '',
            admin: false,

            // Page Data
            loginError: '',
            votingError: '',
            posts: [],
            profiles: [],
            newPost: ''
        }

        // Forum Input Handlers
        this.updateFirstname = this.updateFirstname.bind(this)
        this.updateLastname = this.updateLastname.bind(this)
        this.updateEmail = this.updateEmail.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
        this.updateConfirmPassword = this.updateConfirmPassword.bind(this)
        this.updateNewPost = this.updateNewPost.bind(this)

        // Account Function Handlers
        this.handleLoginRequest = this.handleLoginRequest.bind(this)
        this.handleSignupRequest = this.handleSignupRequest.bind(this)
        this.handleReturnLoginRequest = this.handleReturnLoginRequest.bind(this)
        this.handleCreateAccountRequest = this.handleCreateAccountRequest.bind(this)
        this.handleLogoutRequest = this.handleLogoutRequest.bind(this)
        this.handleAdminViewSwitchRequest = this.handleAdminViewSwitchRequest.bind(this)

        // User Function Handlers
        this.getData = this.getData.bind(this)
        this.handleUpVote = this.handleUpVote.bind(this)
        this.handleCreatePost = this.handleCreatePost.bind(this)

        // Admin Function Handlers
        this.handleRemovePost = this.handleRemovePost.bind(this)
        this.handlePromoteAdmin = this.handlePromoteAdmin.bind(this)
    }

    updateFirstname(event) {
        this.setState({ firstname: event.target.value })
    }

    updateLastname(event) {
        this.setState({ lastname: event.target.value })
    }

    updateEmail(event) {
        this.setState({ email: event.target.value })
    }

    updatePassword(event) {
        this.setState({ password: event.target.value })
    }

    updateConfirmPassword(event) {
        this.setState({ confirmPassword: event.target.value })
    }

    updateNewPost(event) {
        this.setState({ newPost: event.target.value })
    }

    handleLoginRequest() {
        axios.get(`${SERVER_BASE_ADDRESS}/api/profilelogin?email=${this.state.email}&password=${this.state.password}`)
            .then(response => {
                if (response.data.data === 0) {
                    this.setState({ loginError: "Invalid email or password" })
                } else {
                    const profile = response.data.data
                    this.setState({
                        firstname: profile.firstname,
                        lastname: profile.lastname,
                        admin: profile.admin,
                        id: profile._id,
                        loginError: ''
                    })
                    this.getData()
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleSignupRequest() {
        this.setState({
            displayLogin: false,
            displaySignup: true,
            loginError: ''
        })
    }

    handleReturnLoginRequest() {
        this.setState({
            displayLogin: true,
            displaySignup: false,
            loginError: ''
        })
    }

    handleCreateAccountRequest() {
        const data = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            password: this.state.password
        }
        if (!data.email.includes('@rice.edu')) {
            this.setState({ loginError: "Please enter a valid Rice email" })
        } else if (this.state.password !== this.state.confirmPassword) {
            this.setState({ loginError: "Passwords do not match" })
        } else {
            axios.post(`${SERVER_BASE_ADDRESS}/api/addprofile`, data)
                .then(response => {
                    if (response.data.data === 0) {
                        this.setState({ loginError: "An account already exists for this email" })
                    } else {
                        this.setState({ loginError: '' })
                        this.getData()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    handleLogoutRequest() {
        this.setState({
            displayLogin: true,
            displayAdmin: false,
            displayPosts: false,
            displayPostsAdmin: false,
            displayUsersAdmin: false,
            displaySignup: false,
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmPassword: '',
            id: '',
            admin: false,
            votingError: '',
            newPost: ''
        })
    }

    handleAdminViewSwitchRequest() {
        this.setState({
            displayPostsAdmin: !this.state.displayPostsAdmin,
            displayUsersAdmin: !this.state.displayUsersAdmin
        })
    }

    getData() {
        axios.get(`${SERVER_BASE_ADDRESS}/api/allposts`)
            .then(posts => {
                if (this.state.admin) {
                    axios.get(`${SERVER_BASE_ADDRESS}/api/getprofiles?email=${this.state.email}&password=${this.state.password}`)
                        .then(profiles => {
                            this.setState({
                                posts: posts.data.data,
                                profiles: profiles.data.data,
                                displayPosts: false,
                                displayPostsAdmin: true,
                                displayUsersAdmin: false,
                                displaySignup: false,
                                displayLogin: false,
                                newPost: ''
                            })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    this.setState({
                        posts: posts.data.data,
                        displayPosts: true,
                        displayPostsAdmin: false,
                        displayUsersAdmin: false,
                        displaySignup: false,
                        displayLogin: false,
                        newPost: ''
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleUpVote(postID) {
        const data = {
            id: postID,
            voter: this.state.id
        }
        axios.post(`${SERVER_BASE_ADDRESS}/api/upvotepost`, data)
            .then(response => {
                if (response.data.data === 0) {
                    this.setState({ votingError: postID })
                } else {
                    this.getData()
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleCreatePost() {
        const data = {
            message: this.state.newPost,
            user: this.state.firstname + ' ' + this.state.lastname
        }
        axios.post(`${SERVER_BASE_ADDRESS}/api/addpost`, data)
            .then(response => {
                this.getData()
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleRemovePost(postID) {
        const data = {
            email: this.state.email,
            password: this.state.password,
            id: postID
        }
        axios.post(`${SERVER_BASE_ADDRESS}/api/removepost`, data)
            .then(response => {
                this.getData()
            })
            .catch(err => {
                console.log(err)
            })
    }

    handlePromoteAdmin(userID) {
        const data = {
            email: this.state.email,
            password: this.state.password,
            id: userID
        }
        axios.post(`${SERVER_BASE_ADDRESS}/api/promoteadmin`, data)
            .then(response => {
                this.getData()
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <div className="app">
                <div className='header'>
                    <p className='hackrice-title'>HACKRICE<span className='nine'>9</span></p>
                </div>
                {
                    (this.state.displayLogin || this.state.displaySignup) ? (
                        <Box className='login' width={[0.8, 0.7, 0.5, 0.3]}>
                            <p className='forum-title'>forum</p>
                            {
                                this.state.loginError ? (
                                    <p className='error-message'>{this.state.loginError}</p>
                                ) : (
                                        null
                                    )
                            }
                            {
                                this.state.displaySignup ? (
                                    <div>
                                        <input className='input-field' value={this.state.firstname} onChange={this.updateFirstname} placeholder='Firstname' type='text' /> <br />
                                        <input className='input-field' value={this.state.lastname} onChange={this.updateLastname} placeholder='Lastname' type='text' /> <br />
                                    </div>
                                ) : (
                                        null
                                    )
                            }
                            <input className='input-field' value={this.state.email} onChange={this.updateEmail} placeholder='Email' type='text' /><br />
                            <input className='input-field' value={this.state.password} onChange={this.updatePassword} placeholder='Password' type='text' /><br />
                            {
                                this.state.displayLogin ? (
                                    <div>
                                        <div className='btn1' onClick={this.handleLoginRequest}>Login</div>
                                        <div className='btn2' onClick={this.handleSignupRequest}>Sign Up</div>
                                    </div>
                                ) : (
                                        null
                                    )
                            }
                            {
                                this.state.displaySignup ? (
                                    <div>
                                        <input className='input-field' value={this.state.confirmPassword} onChange={this.updateConfirmPassword} placeholder='Confirm Password' type='text' /><br />
                                        <div className='btn1' onClick={this.handleCreateAccountRequest}>Create Account</div>
                                        <div className='btn2' onClick={this.handleReturnLoginRequest}>Back to Login</div>
                                    </div>
                                ) : (
                                        null
                                    )
                            }
                        </Box>
                    ) : (
                            null
                        )
                }
                {
                    this.state.displayPosts ? (
                        <div>
                            <div className='logout-btn'>
                                <div className='btn1' onClick={this.handleLogoutRequest}>Logout</div>
                            </div>
                            {
                                this.state.posts.map(post => (
                                    <Box className='post' width={[0.9, 0.7, 0.6, 0.5]} key={post._id}>
                                        {
                                            (this.state.votingError === post._id) ? (
                                                <p className='error-message'>You have already voted for this post</p>
                                            ) : (
                                                    null
                                                )
                                        }
                                        <Flex flexDirection='row'>
                                            <p className='post-author'>{post.user}</p>
                                            <p className='vote-count'>{post.votes}</p>
                                            <div className='post-action-btn' onClick={() => this.handleUpVote(post._id)}>
                                                <img src='https://icon.now.sh/triangleUp/216363/40' alt='^' />
                                            </div>
                                        </Flex>
                                        <div className='line' />
                                        <p className='post-message'>{post.message}</p>
                                    </Box>
                                ))
                            }
                            <div className='create-post'>
                                <textarea cols='84' rows='4' onChange={this.updateNewPost} value={this.state.newPost} placeholder='Write a new post...' />
                                <div className='create-post-btn'>
                                    <div className='btn1' onClick={this.handleCreatePost}>Submit Idea</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                            null
                        )
                }
                {
                    this.state.displayPostsAdmin ? (
                        <div>
                            <div className='logout-btn'>
                                <div className='btn1' onClick={this.handleLogoutRequest}>Logout</div>
                            </div>
                            <div className='switch-admin-view-btn'>
                                <div className='btn1' onClick={this.handleAdminViewSwitchRequest}>View Users</div>
                            </div>
                            {
                                this.state.posts.map(post => (
                                    <Box className='post' width={[0.9, 0.7, 0.6, 0.5]} key={post._id}>
                                        <Flex flexDirection='row'>
                                            <p className='post-author'>{post.user}</p>
                                            <p className='vote-count'>{post.votes}</p>
                                            <div className='post-action-btn' onClick={() => this.handleRemovePost(post._id)}>
                                                <img src='https://icon.now.sh/trash/216363/25' alt='X' style={{ transform: 'translateY(9px)' }} />
                                            </div>
                                        </Flex>
                                        <div className='line' />
                                        <p className='post-message'>{post.message}</p>
                                    </Box>
                                ))
                            }
                        </div>
                    ) : (
                            null
                        )
                }
                {
                    this.state.displayUsersAdmin ? (
                        <div>
                            <div className='logout-btn'>
                                <div className='btn1' onClick={this.handleLogoutRequest}>Logout</div>
                            </div>
                            <div className='switch-admin-view-btn'>
                                <div className='btn1' onClick={this.handleAdminViewSwitchRequest}>View Posts</div>
                            </div>
                            {
                                this.state.profiles.map(profile => (
                                    <Box className='profile' width={[0.9, 0.7, 0.6, 0.5]} key={profile._id}>
                                        <p className='post-author'>{profile.firstname + ' ' + profile.lastname}</p>
                                        <div className='line' />
                                        <p className='profile-field'>Email: {profile.email}</p>
                                        <p className='profile-field'>Password: {profile.password}</p>
                                        {
                                            profile.admin ? (
                                                <p className='profile-field'>Admin</p>
                                            ) : (
                                                    <div className='promote-admin-btn'>
                                                        <div className='btn2' onClick={() => this.handlePromoteAdmin(profile._id)}>Promote to Admin</div>
                                                    </div>
                                                )
                                        }
                                    </Box>
                                ))
                            }
                        </div>
                    ) : (
                            null
                        )
                }
            </div>
        )
    }
}

export default App;
