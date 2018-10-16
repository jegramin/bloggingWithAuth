import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import Firebase from 'firebase';
// import { stat } from 'fs';

const FireApp = Firebase.initializeApp({
  apiKey: "AIzaSyD8ILoLnBCY8N-GrfXi4V7Br4b7UBT4spQ",
  authDomain: "week4blogging.firebaseapp.com",
  databaseURL: "https://week4blogging.firebaseio.com",
  projectId: "week4blogging",
  storageBucket: "week4blogging.appspot.com",
  messagingSenderId: "978471937389"
})


const Firestore = FireApp.firestore();
Firestore.settings({timestampsInSnapshots: true})


class SignUp extends React.Component{
  constructor(){
    super()
    this.state = {
      email: '',
      password: '',
      blog: '',
      component: ''
    }
  }
  CreateNewUser = () => {
    Firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
  }
  signIn = () => {
    Firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
  }
  emailChanged = (email) => {
    this.setState({
      email: email.target.value
    })
  }
  passwordChanged = (password) => {
    this.setState({
      password: password.target.value
    })
  }
  componentDidMount(){
    Firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        this.setState({
          blog: 'none'
        })
      } else {
        this.setState({
          component: 'none'
        })
      }
    })
  }
  render(){
    return(
      <div>
        <div style={{
          display: this.state.component
        }}>
          <Blogs />
        </div>
        <div style={{
          display: this.state.blog
        }}>
          <h1>{this.state.blog}</h1>
          <input name={'email'} type={'email'} placeholder={'email'} onChange={this.emailChanged}></input>
          <input name={'password'} type={'password'} placeholder={'password'} onChange={this.passwordChanged}></input>
          <button name={'Sign In'} onClick={this.signIn}>Sign In</button>
          <button name={'Sign Up'} onClick={this.CreateNewUser}>Sign Up</button>
      </div>
      </div>
    )
  }
}


class Blogs extends React.Component{
  constructor(){
    super();
    this.state={
      category: '',
      title: '',
      body: '',
      list: []
    }
  }

  componentDidMount() {
    Firestore.collection('blogs')
      .onSnapshot(snap => {
        this.setState({
          list: snap.docs.map(doc => {
            return {
              ...doc.data()
            }
          })
        })
      })
  }
  clickHandler = () =>{
    Firestore.collection('blogs')
      .add({
        category: this.state.category,
        title: this.state.title,
        body: this.state.body
      })
  }
  categoryChanged = category => {
    this.setState({
      category: category.target.value
    })
  }
  titleChanged = title => {
    this.setState({
      title: title.target.value
    })
  }
  bodyChanged = body => {
    this.setState({
      body: body.target.value
    })
  }
  getColumnsFromObject = obj => {
    return Object.keys(obj).map(x => (
      <td>{obj[x]}</td>
    ))
  }
  render(){
    return(
      <div>
        <div style={{
          float: 'right',
          width: '30%'
        }}>
        <input type={'text'} placeholder={'Category'} onChange={this.categoryChanged} style={{
          width: '100%'
        }}></input>
        <input type={'text'} placeholder={'Title'} onChange={this.titleChanged} style={{
          width: '100%'
        }}></input>
        <textarea rows={'7'} placeholder={'Body'} onChange={this.bodyChanged} style={{
          width: '100%'
        }}></textarea>
        <button onClick={this.clickHandler}>Post</button>
      </div>
        <div>
          {
             this.state.list.map(x => <p>{this.getColumnsFromObject(x)}</p>)
          }
        </div>
      </div>
    )
  }
}


const IndexPage = () => (
  <Layout>
    <SignUp />
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
