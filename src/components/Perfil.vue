<template>
  <section class="PerfilInnerPage">
    <section class="containerPerfilForm">
        <section class="title">
            <span>Mi Perfil</span>
        </section>
        <form class="form" v-on:submit.prevent="processUpdateUser">
            <span>Mi Tema de Aplicación</span>
            <div class="appmodecontainer"><div class="appmode" v-bind:title="titleAppMode" v-on:click="updateAppMode">
                <svg class="icon-paint-format"><use xlink:href="#icon-paint-format"></use></svg>
            </div></div>
            <br>
            <span>Mi Nombre</span>
            <input type="text" placeholder="Nombres" v-model="user.nameUser"/>
            <br>
            <span>Mi Apellido</span>
            <input type="text" placeholder="Apellidos" v-model="user.lastNameUser"/>
            <br>
            <span>Mi Username</span>
            <input type="text" placeholder="Username" v-model="user.username"/>
            <br>
            <span>Mi Contraseña</span>
            <input type="password" placeholder="Password" v-model="user.password" readonly/>
            <br>
            <span>Mi Correo</span>
            <input type="email" placeholder="Email" v-model="user.emailUser"/>
            <br>
            <span>Mi Fecha Nacimiento</span>
            <input type="date" v-model="user.dateBirthUser"/>
            <div class="appmodecontainer"><button class="submitButton" type="submit">
                Actualizar Perfil
            </button></div>
        </form>
    </section>
  </section>
</template>

<script>
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { functionTypeAnnotation } from "@babel/types";
import swal from 'sweetalert';

var bufferABase64 = buffer => btoa(String.fromCharCode(...new Uint8Array(buffer)));
var base64ABuffer = buffer => Uint8Array.from(atob(buffer), c => c.charCodeAt(0));
var LONGITUD_SAL = 16;
var LONGITUD_VECTOR_INICIALIZACION = LONGITUD_SAL;

export default {  
    name: "Perfil",
    data: function(){
        return {
            user: {
                username:"",
                password:"",
                nameUser: "",
                lastNameUser: "",
                emailUser: "",
                dateBirthUser: "",
                appMode: "",
            },
            blanco: '#fafafa',
            gris: '#e3e3e3',
            veige: 'rgb(245,238,230)',
            piel: 'rgb(243,215,202)',
            rosaClaro: '#e6a4b4',
            rosaFuerte: '#c86b85',
            colorPrincipal: localStorage.getItem('appMode') === 'true'|| !localStorage.getItem('appMode') ?'#c86b85':'#f3d7ca',
            colorSecundario: localStorage.getItem('appMode') === 'true' || !localStorage.getItem('appMode') ? '#f3d7ca':'#c86b85',
            colorPrincipal2: localStorage.getItem('appMode') === 'true' || !localStorage.getItem('appMode') ?'#f3d7ca':'#c86b85',
            colorSecundario2: localStorage.getItem('appMode') === 'true' || !localStorage.getItem('appMode') ? '#c86b85':'#f3d7ca',
            negro: 'rgb(0,0,0)',
            titleAppMode: localStorage.getItem('appMode') === 'true' || !localStorage.getItem('appMode') ? 'Claro':'Oscuro'
        }
    },
    methods: {
        async derivacionDeClaveBasadaEnContraseña (contraseña, sal, iteraciones, longitud, hash, algoritmo = 'AES-CBC') {
            const encoder = new TextEncoder();
            let keyMaterial = await window.crypto.subtle.importKey(
                'raw',
                encoder.encode(contraseña),
                { name: 'PBKDF2' },
                false,
                ['deriveKey']
            );
            return await window.crypto.subtle.deriveKey(
                {
                name: 'PBKDF2',
                salt: encoder.encode(sal),
                iterations: iteraciones,
                hash
                },
                keyMaterial,
                { name: algoritmo, length: longitud },
                false,
                ['encrypt', 'decrypt']
            );
        },
        async encriptar (contraseña, textoPlano) {
            const encoder = new TextEncoder();
            const sal = window.crypto.getRandomValues(new Uint8Array(16));
            const vectorInicializacion = window.crypto.getRandomValues(new Uint8Array(16));
            const bufferTextoPlano = encoder.encode(textoPlano);
            const clave = await this.derivacionDeClaveBasadaEnContraseña(contraseña, sal, 100000, 256, 'SHA-256');
            const encrypted = await window.crypto.subtle.encrypt(
                { name: "AES-CBC", iv: vectorInicializacion },
                clave,
                bufferTextoPlano
            );
            return bufferABase64([
                ...sal,
                ...vectorInicializacion,
                ...new Uint8Array(encrypted)
            ]);
        },
        async desencriptar (contraseña, encriptadoEnBase64) {
            const decoder = new TextDecoder();
            const datosEncriptados = base64ABuffer(encriptadoEnBase64);
            const sal = datosEncriptados.slice(0, LONGITUD_SAL);
            const vectorInicializacion = datosEncriptados.slice(0 + LONGITUD_SAL, LONGITUD_SAL + LONGITUD_VECTOR_INICIALIZACION);
            const clave = await this.derivacionDeClaveBasadaEnContraseña(contraseña, sal, 100000, 256, 'SHA-256');
            const datosDesencriptadosComoBuffer = await window.crypto.subtle.decrypt(
                { name: "AES-CBC", iv: vectorInicializacion },
                clave,
                datosEncriptados.slice(LONGITUD_SAL + LONGITUD_VECTOR_INICIALIZACION)
            );
            return decoder.decode(datosDesencriptadosComoBuffer);
        },
        loadUser: async function(){
            if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                this.$emit('LogOut');
                return;
            }

            await this.verifyToken();

            let token = await this.desencriptar("@McQfTjW", localStorage.getItem("token_access"));
            let userId = jwt_decode(token).user_id.toString();

            axios.get(`https://kositeria-be.herokuapp.com/detailUser/${userId}/`, {headers: {'Authorization': `Bearer ${token}`}})
                .then(async (result) => {
                    this.user.nameUser = result.data.nameUser;
                    this.user.lastNameUser = result.data.lastNameUser;
                    this.user.username = result.data.username;
                    var password = localStorage.getItem('password')
                    this.user.password = await this.desencriptar("@McQfTjW",password);
                    this.user.emailUser = result.data.emailUser;
                    this.user.dateBirthUser = result.data.dateBirthUser;
                    this.user.appMode = result.data.appMode;
                })    
                .catch((e) => {
                    alert(e);
                });
        },
        processUpdateUser: async function(){
            if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                this.$emit('LogOut');
                return;
            }

            await this.verifyToken();

            let token = await this.desencriptar("@McQfTjW", localStorage.getItem("token_access"));
            let userId = jwt_decode(token).user_id.toString();

            axios.put(`https://kositeria-be.herokuapp.com/updateUser/${userId}/${userId}/`,this.user, {headers: {'Authorization': `Bearer ${token}`}})
                .then(async (result) => {
                    this.user.nameUser = result.data.nameUser;
                    this.user.lastNameUser = result.data.lastNameUser;
                    this.user.username = result.data.username;
                    var password = localStorage.getItem('password')
                    this.user.password = await this.desencriptar("@McQfTjW",password);
                    this.user.emailUser = result.data.emailUser;
                    this.user.dateBirthUser = result.data.dateBirthUser;
                    this.user.appMode = result.data.appMode;
                    swal('Actualizar Perfil','Se ha actualizado correctamente su perfil', 'success')
                })    
                .catch((e) => {
                    alert(e);
                });
        },
        updateAppMode: async function() {
            if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                this.$emit('LogOut');
                return;
            }

            await this.verifyToken();

            let token = await this.desencriptar("@McQfTjW", localStorage.getItem("token_access"));
            let userId = jwt_decode(token).user_id.toString();

            var appMode = !this.user.appMode;
            this.user.appMode = appMode;
            axios.put(`https://kositeria-be.herokuapp.com/updateUser/${userId}/${userId}/`,this.user, {headers: {'Authorization': `Bearer ${token}`}})
                .then(async (result) => {
                    this.user.nameUser = result.data.nameUser;
                    this.user.lastNameUser = result.data.lastNameUser;
                    this.user.username = result.data.username;
                    var password = localStorage.getItem('password')
                    this.user.password = await this.desencriptar("@McQfTjW",password);
                    this.user.emailUser = result.data.emailUser;
                    this.user.dateBirthUser = result.data.dateBirthUser;
                    this.user.appMode = result.data.appMode;
                    localStorage.setItem('appMode',result.data.appMode);
                    swal({
                        title: "Actualizar tema",
                        text: "Se ha actualizado el tema de su aplicación",
                        icon: "success",
                    })
                    .then(() => {
                        window.location.reload();
                    });
                })    
                .catch((e) => {
                    alert(e);
                });
        },
        verifyToken: async function () {
            var token_refresh = await this.desencriptar("@McQfTjW", localStorage.getItem("token_refresh"));
            return axios.post("https://kositeria-be.herokuapp.com/refresh/", {refresh: token_refresh}, {headers: {}})
				.then(async (result) => {
					localStorage.setItem("token_access", await this.encriptar("@McQfTjW",result.data.access));		
				})
				.catch(() => {
					this.$emit('LogOut');
				});
        },
    },
    created: function(){
        this.loadUser();
    }
}
</script>

<style>
.PerfilInnerPage {
    padding: 10vh 0px;
    display: flex;
    width: 100%;
    min-height: 100vh;
    height: fit-content;
    justify-content: center;
}
.form {
    display: block;
}
.title span{
    font-size: 5vh;
}
.title {
    display: flex;
    justify-content: center;
}
.form input {
    width: 20vw;
    height: 4vh;
    background-color: whitesmoke;
    text-align: center;
    transition: all 0.5s;
    margin: 20px 0px;
    border: none;
    color: v-bind(negro);
    border-radius: 5px;
}
.form input::placeholder {
    transition: all 0.5s;
    color: v-bind(gris);
}
.form input:hover {
    color: v-bind(rosaFuerte);
}
.form input:hover::placeholder {
    color: v-bind(rosaClaro)
}
.appmode {
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 100px;
    height: 10vh;
    width: 10vh;
    display: flex;
    margin: 20px 0px;
    border-width: 0px;
    background-color: v-bind(colorPrincipal);
    transition: all 0.5s;
}
.appmode:hover{
    background-color: v-bind(colorPrincipal2);
}
.appmode:hover svg{
    stroke: v-bind(colorSecundario2);
    fill: v-bind(colorSecundario2);
}
.appmodecontainer {
    display: flex;
    justify-content: center;
}
.form span{
    justify-content: center;
    display: flex;
}
.icon-paint-format {
    display: flex;
    width: 5vh;
    height: 5vh;
    stroke-width: 0;
    stroke: v-bind(colorSecundario);
    fill: v-bind(colorSecundario);
}
.submitButton {
    color: v-bind(colorSecundario);
    background-color: v-bind(colorPrincipal);
    border: none;
    border-radius: 5px;
    height: 5vh;
    font-size: 3vh;
    cursor: pointer;
    transition: all 0.5s;
}
.submitButton:hover {
    color: v-bind(colorSecundario2);
    background-color: v-bind(colorPrincipal2);
}
</style>