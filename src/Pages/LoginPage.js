import React, { Component } from 'react';
import '../Styles/login.css';
import firebase from 'firebase';
import {AuthContext} from '../Components/Auth_Components/Auth'

export default class LoginPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			signUp: false,
			isAuth: false,
			tempPass:'',
			tempEmail:'',
			inputHasVal:false,
		}

		//Binds
		this.goToDash = this.goToDash.bind(this);
		this.toggleSignUp = this.toggleSignUp.bind(this);
		this.logInFirebase = this.logInFirebase.bind(this);
		this.signUpFirebase=this.signUpFirebase.bind(this);
		this.onFormChange=this.onFormChange.bind(this);
		this.logUser = this.logUser.bind(this);
	}

	
	toggleSignUp() {
		const { signUp } = this.state;
		this.setState({ signUp: !signUp });
	}

	goToDash() {
		this.props.history.push('/Dashboard');
	}

	logInFirebase(){
		const email = this.state.tempEmail;
		const pass = this.state.tempPass;

		firebase.auth().signInWithEmailAndPassword(email, pass).then((user)=> {
			this.goToDash()
		}, function(error) {
			alert(error);
		});

	}

	signUpFirebase(){
		const email = this.state.tempEmail;
		const pass = this.state.tempPass;

		firebase.auth().createUserWithEmailAndPassword(email, pass).then((user)=> {
			//this.logUser(user.user.email);
			this.goToDash();
		}, function(error) {
			alert(error);
		});
	}

	logUser(email){
		firebase.firestore().collection("stores").doc(email).collection("items");
	}

	onFormChange(event) {
        const value = event.target.value;
        const name = event.target.id;
		this.setState({ [name]: value });
		if(value){
			this.setState({inputHasVal:true});
		}
    }

	render() {
		
		return (
			<div class="wrap-login100">
				<form class="login100-form validate-form" autoComplete="off">
					<h class="login100-form-title">Welcome</h>

					<div class="wrap-input100">
						<input class="input100" type="text" id="tempEmail" onChange={this.onFormChange} />
						<span class="focus-input100" data-placeholder="Email"></span>
					</div>

					<div class="wrap-input100" >
						<input class="input100" type="password" id="tempPass" onChange={this.onFormChange}/>
						<span class="focus-input100" data-placeholder="Password"></span>
					</div>

					<div class="container-login100-form-btn">
						<div class="wrap-login100-form-btn">
							<div class="login100-form-bgbtn"></div>
							{   this.state.signUp ?
								(<button type="button" class="login100-form-btn" onClick={this.signUpFirebase}>Sign up</button>):
								(<button type="button" class="login100-form-btn" onClick={this.logInFirebase}>Log in</button>)
							}
						</div>
					</div>

					<div>
						{this.state.signUp ? (<div><p class="txt2" >Already have an account?</p> <p class="txt1" onClick = {this.toggleSignUp}>Log in</p></div>):
						(<div><p class="txt2">Don't have an account?</p> <p class="txt1" onClick={this.toggleSignUp}>Sign up</p></div>)}
					</div>

				</form>

			</div>



			
			
			
		)
	}
}