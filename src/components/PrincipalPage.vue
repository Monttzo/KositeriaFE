<template>
    <section class="PrincipalPageContainer">
        <section class="PrincipalHeader">
            <section class="TitlePrincipalPage">
                <h1 class="TitleWelcome">Hola!, {{username}}</h1>
            </section>
        </section>
        <section class="InnerPage">
            <section class="innerContainer">
                <section class="Header">
                    <section class="TitlePrincipalPage">
                        <h1 class="TitleVendido">Mis ventas del mes</h1>
                    </section>
                </section>
                <section class="Header">
                    <section class="TitlePrincipalPage">
                        <h1 class="Vendido">${{Number(totalSold).toLocaleString()}}</h1>
                    </section>
                </section>
                <section class="Header">
                    <section class="TitlePrincipalPage">
                        <h1 class="TitleGastos">Mis gastos del mes</h1>
                    </section>
                </section>
                <section class="Header">
                    <section class="TitlePrincipalPage">
                        <h1 class="Gastado">${{Number(totalGastos).toLocaleString()}}</h1>
                    </section>
                </section>
                <section class="Header">
                    <section class="TitlePrincipalPage">
                        <h1 class="TitleDeudas">Mis deudas del mes</h1>
                    </section>
                </section>
                <section class="Header">
                    <section class="TitlePrincipalPage">
                        <h1 class="Deudas">${{Number(totalDeudas).toLocaleString()}}</h1>
                    </section>
                </section>
                <section class="Header">
                    <section class="TitlePrincipalPage">
                        <h1 class="TitleTotalMonth">Total con mes anterior</h1>
                    </section>
                </section>
                <section class="Header">
                    <section class="TitlePrincipalPage">
                        <h1 class="TotalMonth">${{Number(totalMonthWithDeudas).toLocaleString()}}</h1>
                    </section>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
import jwt_decode from "jwt-decode";
import axios from 'axios';
import swal from 'sweetalert';
import moment from 'moment';

var bufferABase64 = buffer => btoa(String.fromCharCode(...new Uint8Array(buffer)));
var base64ABuffer = buffer => Uint8Array.from(atob(buffer), c => c.charCodeAt(0));
var LONGITUD_SAL = 16;
var LONGITUD_VECTOR_INICIALIZACION = LONGITUD_SAL;

export default {
    name: 'PrincipalPage',
    data: function(){
         return {
            colorVentas : localStorage.getItem('appMode') === 'true'|| !localStorage.getItem('appMode') ? "#acdeaa":'#a7d129',
            colorGastos: localStorage.getItem('appMode') === 'true' || !localStorage.getItem('appMode') ?"#f46060":'#8f1d14',
            colorDeudas: localStorage.getItem('appMode') === 'true' || !localStorage.getItem('appMode') ?"#c86b85":'#4e2161',
            colorTotal: localStorage.getItem('appMode') === 'true' || !localStorage.getItem('appMode') ?"#264e70":'#10316b',
            nameUser: "",
            lastNameUser: "",
            username: "",
            password: "",
            emailUser: "",
            cellPhoneUser: "",
            dateBirthUser: "",
            genderUser: "",
            statusUser: true,
            userType: "",
            imageUser: "",
            loaded: false,
            totalSold: "",
            totalGastos: "",
            totalDeudas: "",
            totalMonthWithDeudas: "",
        }
    },
    methods:{
        async loadVariables (){
            var username = localStorage.getItem('username');
            var decriptedUsername =  await this.desencriptar("@McQfTjW", username);
            this.username = decriptedUsername;
            return;
        },
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
        getData: async function(){
            if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                this.$emit('LogOut');
                return;
            }

            await this.verifyToken();

            let token = await this.desencriptar("@McQfTjW", localStorage.getItem("token_access"));
            let userId = jwt_decode(token).user_id.toString();
            var today = moment().format('YYYY-MM-DD');

            axios.get(`https://kositeria-be.herokuapp.com/detailTotalMonth/${today}/`, {headers: {}})
                .then((result) => {
                    this.nameUser = result.data.nameUser;
                    this.totalSold = result.data.totalSold;
                    this.totalGastos = result.data.totalGastos;
                    this.totalDeudas = result.data.totalDeudas;
                    this.totalMonthWithDeudas = result.data.totalMonthWithDeudas;
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
        this.getData();
        this.loadVariables();
    },
}
</script>

<style>
.Header {
    justify-content: center;
    font-size: 20px;
    width: 100%;
    display: flex;
}
.PrincipalHeader {
    justify-content: center;
    font-size: 20px;
    width: 100%;
    display: flex;
    height: 10vh;
}
.TitlePrincipalPage {
    width: fit-content;
    display: inline-flex;
}
.TitleVendido {
    margin: 0px;
    color: v-bind(colorVentas);
}
.Vendido {
    margin: 0px;
    font-size: 10vh;
    color: v-bind(colorVentas);
}
.TitleGastos {
    margin: 0px;
    color: v-bind(colorGastos);
}
.Gastado {
    margin: 0px;
    font-size: 10vh;
    color: v-bind(colorGastos);
}
.TitleDeudas {
    margin: 0px;
    color: v-bind(colorDeudas);
}
.Deudas {
    margin: 0px;
    font-size: 10vh;
    color: v-bind(colorDeudas);
}
.TitleTotalMonth {
    margin: 0px;
    color: v-bind(colorTotal);
}
.TotalMonth {
    margin: 0px;
    font-size: 10vh;
    color: v-bind(colorTotal);
}
.InnerPage {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
    width: 100%;
}
.innerContainer {
    display: block;
}
</style>