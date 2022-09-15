<template>
  <header></header>
  <div id="app" class="app">
    <section class="containerLogIn" v-if="!is_auth">
      <router-view
      v-on:completedLogIn="completedLogIn">
      </router-view>
    </section>
    <section class="containerLogged" v-if="is_auth">
      <section id="Menu" v-on:mouseenter="Menuenter()" v-on:mouseleave="Menuleave()">
        <section class="MenuBody">
          <ol class="listMenu">
            <ol type="A">
              <li class="internalList"><div class="internalDiv" v-on:click="LoadPrincipalPage"><svg class="icon icon-home3"><use xlink:href="#icon-home3"></use></svg><span class="labelMenu" id="labelMenu">Home</span></div></li>
              <li class="internalList"><div class="internalDiv" v-on:click="loadCajasPage"><svg class="icon icon-calendar"><use xlink:href="#icon-calendar"></use></svg><span class="labelMenu" id="labelMenu">Caja</span></div></li>
              <li class="internalList"><div class="internalDiv" v-on:click="loadGastosPage"><svg class="icon icon-upload"><use xlink:href="#icon-upload"></use></svg><span class="labelMenu" id="labelMenu">Gastos</span></div></li>
              <li class="internalList"><div class="internalDiv" v-on:click="loadDeudasPage"><svg class="icon icon-clipboard"><use xlink:href="#icon-clipboard"></use></svg><span class="labelMenu" id="labelMenu">Deudas</span></div></li>
              <li class="internalList"><div class="internalDiv" v-on:click="loadTotalesPage"><svg class="icon icon-coin-dollar"><use xlink:href="#icon-coin-dollar"></use></svg><span class="labelMenu" id="labelMenu">Totales</span></div></li>
            </ol>
            <ol type="A" class="bottomList" id="bottomList">
              <li class="internalList"><div class="internalDiv" v-on:click="ButtonPerfil"><svg class="icon icon-user"><use xlink:href="#icon-user"></use></svg><span class="labelMenu" id="labelMenu">Perfil</span></div></li>
              <li class="internalList"><div class="internalDiv" v-on:click="ButtonLogOut"><svg class="icon icon-exit"><use xlink:href="#icon-exit"></use></svg><span class="labelMenu" id="labelMenu">Logout</span></div></li>
            </ol>
          </ol>
          
        </section> 
      </section>
      <section id="main-component">
        <router-view
        v-on:LogOut="ButtonLogOut">
        </router-view>
      </section>
    </section>
  </div>
</template>

<script>
import swal from 'sweetalert';

var bufferABase64 = buffer => btoa(String.fromCharCode(...new Uint8Array(buffer)));
var base64ABuffer = buffer => Uint8Array.from(atob(buffer), c => c.charCodeAt(0));
var LONGITUD_SAL = 16;
var LONGITUD_VECTOR_INICIALIZACION = LONGITUD_SAL;
export default {
  name: 'App',

  data: function() {
    return {
      //colores de mas claro a mas oscuro en rgb
      blanco: localStorage.getItem('appMode') === 'true'|| !localStorage.getItem('appMode')? '#fafafa' : '#9a9b94',
      gris: localStorage.getItem('appMode') === 'true' || !localStorage.getItem('appMode') ? '#e3e3e3' : '#52524e',
      veige: 'rgb(245,238,230)',
      piel: 'rgb(243,215,202)',
      rosaClaro: 'rgb(230,164,180)',
      rosaFuerte: 'rgb(200,107,133)',
      negro: 'rgb(0,0,0)',
      nameUser:  'none',
      username: localStorage.getItem('username') || 'none',
      is_auth: localStorage.getItem('isAuth') || false
      // is_auth: true,
    }
  },
  methods:{
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
    verifyAuth: function(){
      this.is_auth = localStorage.getItem("isAuth") || false;
      if(this.is_auth == false)
        this.LoadLogIn();
      else
        this.LoadPrincipalPage();
    },
    LoadLogIn: function(){
      this.$router.push({name: "LogIn"});
    },
    LoadPrincipalPage: function(){
      this.$router.push({name: "PrincipalPage"});
    },
    loadCajasPage: function(){
      this.$router.push({name: "Cajas"});
    },
    loadGastosPage: function(){
      this.$router.push({name: "Gastos"});
    },
    loadDeudasPage: function(){
      this.$router.push({name: "Deudas"});
    },
    loadTotalesPage: function(){
      this.$router.push({name: "Totales"});
    },
    Menuenter: function() {
      document.getElementById('Menu').style.width = '10vw';
      document.getElementById('main-component').style.width = '90%';
      document.getElementById('main-component').style.left = '10%';
    },
    Menuleave: function() {
      document.getElementById('Menu').style.width = '5%';
      document.getElementById('main-component').style.width = '95%';
      document.getElementById('main-component').style.left = '5%';
    },
    async completedLogIn (data) {
      localStorage.setItem("reloaded", "false"),
      localStorage.setItem("isAuth", true);
      localStorage.setItem("appMode", data.appMode);
      localStorage.setItem("password", await this.encriptar("@McQfTjW",data.password));
      localStorage.setItem("username", await this.encriptar("@McQfTjW",data.username));
      localStorage.setItem("token_access", await this.encriptar("@McQfTjW",data.token_access));
      localStorage.setItem("token_refresh", await this.encriptar("@McQfTjW",data.token_refresh));
      swal('Iniciar Sesión','Inicio sesión correctamente', 'success').then(()=>{window.location.reload()})
      this.verifyAuth();
    },
    ButtonLogOut: function(){
      localStorage.clear();
      swal('Cerrar Sesión','Cerro sesión correctamente', 'success').then(()=>{
        window.location.reload()
      })
      this.verifyAuth();
    },
    ButtonPerfil: function(){
      this.$router.push({name: "Perfil"});
    },
    reloadPage: function(){
      window.location.reload();
    },
  },
  created: function(){
    this.verifyAuth();
  }
}

</script>

<style>
* {
  font-family: 'Dosis', sans-serif;
  color: v-bind(negro);
  font-size: x-large;
  font-weight: bold;
}
#app {
  top: 0px;
  position: absolute;
  background-color: v-bind(blanco);
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: fit-content;
  display: flex;
  min-height: 100vh;
  overflow-x: hidden;
}
body {
  margin: 0 0 0 0;
  padding: 0px;
}
header {
  margin: 0px 0px 0px 0px;
  padding: 0px;
}
#Menu {
  width: 5%;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: v-bind(gris);
  transition: all 0.5s;
}
#main-component {
  left: 5%;
  top: 0px;
  width: 95%;
  position: absolute;
  transition: all 0.5s;
}
.MenuBody {
  height: 100%;
  text-align: center;
  align-content: center;
  align-items: center;
  justify-items: center;
  display: flex;
  padding: 5%;
}
ol {
  list-style: none;
}
li {
  margin: 0px 0px 40px 0px;
}
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
}
#Menu:hover .labelMenu{
  visibility: visible;
  opacity: 1;
  display: flex;
}
.labelMenu {
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s;
  margin:  0px 20px;
  display: flex;
}
.bottomList {
  align-self: flex-end;
}
.listMenu {
  align-items: flex-end;
  padding: 0px;
  height: 100%;
  display: inline-grid;
}
.internalDiv:hover .icon{
  stroke: v-bind(rosaFuerte);
  fill: v-bind(rosaFuerte);
  color: v-bind(rosaFuerte);
  transition: all 0.5s;
}
.internalDiv:hover span{
  color: v-bind(rosaFuerte);
  transition: all 0.5s;
}
.internalDiv {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}
.internalList {
  display: flex;
  justify-content: flex-start;
}
/*Responsive */
@media screen and (min-height: 640px) and (max-height: 3600px) and (min-width: 360px) and (max-width: 1080px) {   
  .listMenu ol{
    margin: 0px 0px 0px -10vw;
  }
  #bottomList {
    align-self: flex-start;
  }
  #labelMenu {
    display: none;
  }
  #Menu:hover .labelMenu{
    visibility: hidden;
    opacity: 0;
    display: flex;
  }
}
@media screen and (min-width: 1366px) and (max-width: 1920px) and (min-height:640px) and (max-height:1080px) {
  .listMenu .labelMenu{
    font-size: 1vw;
  }
  .listMenu .icon{
    height: 3vh;
    width: 3vh;
  }
}
</style>