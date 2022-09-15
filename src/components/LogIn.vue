<template>
    <section class="LogInContainer">
        <section class="Form">
            <form v-on:submit.prevent="processLogInUser">
                <input class='input' type="text" name="Username" placeholder="Username" v-model="user.username">
                <br>
                <input class='input' type="password" name="Password" placeholder="Password" v-model="user.password">
                <br>
                <center><button type="submit" class="boton"><b>logIn</b></button></center>
            </form>
        </section> 
    </section> 
</template>

<script>
import axios from 'axios';
import swal from 'sweetalert';

export default {  
    name: "LogIn",
    data: function(){
        return {
            user: {
                username:"",
                password:""
            },
            blanco: '#fafafa',
            gris: '#e3e3e3',
            veige: 'rgb(245,238,230)',
            piel: 'rgb(243,215,202)',
            rosaClaro: '#e6a4b4',
            rosaFuerte: '#c86b85',
            negro: 'rgb(0,0,0)',
        }
    },
    methods: {
        processLogInUser: function(){
            axios.post(
                "https://kositeria-be.herokuapp.com/login/",
                this.user,
                {headers: {}}
                )
                .then((result) => {
                    let token_access = result.data.access;
                    let token_refresh = result.data.refresh;
                    axios.get(
                        `https://kositeria-be.herokuapp.com/appModeUser/${this.user.username}/`,
                        {headers: {}}
                        )
                        .then((result) => {
                            let dataLogIn = {
                                password: this.user.password,
                                username: this.user.username,
                                token_access: token_access,
                                token_refresh: token_refresh,
                                appMode: result.data.appMode
                            }
                            this.$emit('completedLogIn', dataLogIn)
                        })
                        .catch((error) => {
                            swal('error',error,'error');
                        });
                })
                .catch((error) => {
                    swal('error',error,'error');
                });
        }
    }
}
</script>

<style>
    .LogInContainer {
        width: 100vw;
        height: 100vh;
        align-content: center;
        align-items: center;
        justify-content: center;
        justify-items: center;
        display: flex;
    }
    .Form {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20vw;
        height: 20vw;
        border-radius: 10px;
    }
    .input {
        text-align: center;
        transition: all 0.5s;
        margin: 20px 0px;
        border: none;
        color: v-bind(negro);
        border-radius: 5px;
    }
    .input::placeholder {
        transition: all 0.5s;
        color: v-bind(gris);
    }
    .input:hover {
        color: v-bind(rosaFuerte);
    }
    .input:hover::placeholder {
        color: v-bind(rosaClaro)
    }
    .boton b{
        color: v-bind(blanco)
    }
    .boton {
        cursor: pointer;
        margin: 20px 0px;
        transition: all 0.5s;
        display: flex;
        background-color: v-bind(negro);
        border: none;
        border-radius: 5px;
    }
    .boton:hover{
        color: v-bind(veige);
        background-color: v-bind(rosaFuerte);
    }
</style>