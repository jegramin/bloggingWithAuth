import React from 'react'

import styles from './styles.module.css'

import Layout from '../components/layout'
import Firebase from 'firebase';


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


class Header extends React.Component{
  constructor(){
    super();
    this.state={
      signOut: ''
    }
  }
  componentDidMount(){
    Firebase.auth().onAuthStateChanged(firebaseUser => {
      if (!firebaseUser) {
        this.setState({
          signOut: 'none'
        })
      } else {
        this.setState({
          signOut: ''
        })
      } 
    })
  }
  signOut = () => {
    Firebase.auth().signOut()
  }
  render(){
    return(
      <div style={{
        margin: '0 0 20px 0',
        height: '90px',
        backgroundColor: 'purple'
      }}>
      <button onClick={this.signOut} style={{
          float: 'right',
          margin: '15px 30px 0 0',
          width: '110px',
          backgroundColor: '#111e6c',
          border: 'none',
          color: '#ccc',
          borderRadius: '5px',
          display: this.state.signOut
      }}>Sign Out</button>

        <div style={{
          margin: '0 auto',
          maxWidth: 960,
          padding: '10px 0',
          color: '#fff'
        }}>
          <h1>Blogging System</h1>
        </div>
      </div>
    )
  }
}


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
          blog: 'none',
          component: ''
        })
      } else {
        this.setState({
          component: 'none',
          blog: ''
        })
      }
    })
  }
  render(){
    return(
      <div style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '0px 1.0875rem 1.45rem',
      }}>
        <div style={{
          display: this.state.component
        }}>
          <Blogs />
        </div>
        <div style={{
          display: this.state.blog,
          margin: '60px auto'
        }}>
          <input name={'email'} type={'email'} placeholder={'email'} onChange={this.emailChanged} style={{
            width: '55%',
            margin: '5px auto',
            border: '1px solid gray',
            borderRadius: '4px',
            padding: '5px',
            backgroundColor: '#eee'
          }}></input>
          <input name={'password'} type={'password'} placeholder={'password'} onChange={this.passwordChanged} style={{
            width: '55%',
            margin: '5px auto',
            border: '1px solid gray',
            borderRadius: '4px',
            padding: '5px',
            backgroundColor: '#eee'
          }}></input><br></br>
          <button name={'Sign In'} onClick={this.signIn} style={{width: '95px',margin: '5px 0'}}>Sign In</button>
          <button name={'Sign Up'} onClick={this.CreateNewUser} style={{width: '95px',margin: '5px 0'}}>Sign Up</button>
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
      <div style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '0px 1.0875rem 1.45rem',
      }}>
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


class Main extends React.Component{
  constructor(){
    super();
    this.state={
      inputVal: '',
      list: []
    }
  }

  componentDidMount() {
    Firestore.collection('messages')
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

  onChange =(data)=>{
    this.setState({
      inputVal: data.target.value
    })
  }
  getColumnsFromObject = obj => {
    return Object.keys(obj).map(x => (
      
      <td>{obj[x]}</td> 
      
    ))
  }
  onEnter = event => {
    if (event.keyCode === 13) {
      if(this.state.inputVal){
        Firestore.collection('messages')
      .add({
        message: this.state.inputVal
      })
      }
    }
  }
  render(){
    return(
      <div className={styles.main}>
      <table className={styles.messages}>
          {
             this.state.list.map(x => <tr>{this.getColumnsFromObject(x)}</tr>)
          }
        </table>
        <input type='text' onChange={this.onChange} onKeyDown={this.onEnter} placeholder={'Group Chat'}></input>
        
      </div>
    )
  }
}

const IndexPage = () => (
  <Layout>
    <Header />
    <SignUp />
    <Main />
    
  </Layout>
)

export default IndexPage
