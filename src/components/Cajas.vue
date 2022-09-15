<template>
  <section class="PerfilInnerPage">
    <section class="containerPerfilForm">
        <section class="title">
            <span>Mis Cajas</span>
        </section>
        <form class="formCajas" v-on:submit.prevent="loadCajas">
            <input type="date" class="filterDate" v-model="filter.date" required/>
            <input type="radio" id='radio' value="week" v-model="filter.weekormonth"/>
            <label for="Semana">Semana</label>
            <input type="radio"  id='radio' value="month" v-model="filter.weekormonth"/>
            <label for="Mes">Mes</label>
            <button type="submit" class="submitButtonCajas">Buscar</button>
        </form>
        <section class="title2">
            <span>Total vendido en el periodo: ${{Number(totales.totalSold).toLocaleString()}}</span>
        </section>
        <section class="backgroundModalCaja" id="backgroundModalCaja">
            <section class="modalCaja" id="modalCaja">
                <section class="crosscontainer">
                    <section>
                        <svg class="icon-cross2-caja" v-on:click="cerrarModalCaja"><use xlink:href="#icon-cross"></use></svg>
                    </section>
                </section>
                <form class="formModal" v-on:submit.prevent="updateCaja">
                    <span>Fecha</span>
                    <input type="date" v-model="caja.date" required/>
                    <br>
                    <span>Papeleria</span>
                    <input type="text" v-model="caja.papeleria" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" v-on:change="calculartotalSold" required/>
                    <br>
                    <span>Dulces</span>
                    <input type="text" v-model="caja.dulces" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" v-on:change="calculartotalSold" required/>
                    <br>
                    <span>CIR</span>
                    <input type="text" v-model="caja.cir" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" v-on:change="calculartotalSold" required/>
                    <br>
                    <span>Total Vendido</span>
                    <input type="text" v-model="caja.totalSold" readonly required/>
                    <br>
                    <section class="buttonContainer">
                        <button type="submit" class="submitButtonCajas">Actualizar</button>
                    </section>
                    
                </form>
            </section>
        </section>
        <section class="backgroundModalCajaCrear" id="backgroundModalCajaCrear">
            <section class="modalCajaCrear" id="modalCajaCrear">
                <section class="crosscontainer">
                    <section>
                        <svg class="icon-cross2-caja" v-on:click="cerrarModalCajaCrear"><use xlink:href="#icon-cross"></use></svg>
                    </section>
                </section>
                <form class="formModal" v-on:submit.prevent="CrearCaja">
                    <span>Fecha</span>
                    <input type="date" v-model="caja.date" required/>
                    <br>
                    <span>Papeleria</span>
                    <input type="text" v-model="caja.papeleria" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" v-on:change="calculartotalSold" required/>
                    <br>
                    <span>Dulces</span>
                    <input type="text" v-model="caja.dulces" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" v-on:change="calculartotalSold" required/>
                    <br>
                    <span>CIR</span>
                    <input type="text" v-model="caja.cir" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" v-on:change="calculartotalSold" required/>
                    <br>
                    <span>Total Vendido</span>
                    <input type="text" v-model="caja.totalSold" readonly required/>
                    <br>
                    <section class="buttonContainer">
                        <button type="submit" class="submitButtonCajas">Añadir Caja</button>
                    </section>
                    
                </form>
            </section>
        </section>
        <section class="backgroundModalCajaMensual" id="backgroundModalCajaMensual">
            <section class="modalCajaMensual" id="modalCajaMensual">
                <section class="crosscontainer">
                    <section>
                        <svg class="icon-cross2-caja" v-on:click="cerrarModalCajaMensual"><use xlink:href="#icon-cross"></use></svg>
                    </section>
                </section>
                <section class="warningMsg">** Recuerda que el valor de 'Total Ganancias' corresponde al 'Total vendido' - 'Total Gastos' - 'Total Deudas' + 'Total Ganancias del mes anterior'**</section>
                <form class="formModal" v-on:submit.prevent="updateCajaMensual">
                    <span>Fecha</span>
                    <input type="date" v-model="cajaMensual.date" required/>
                    <br>
                    <span>Total Ganancias</span>
                    <input type="text" v-model="cajaMensual.totalSold" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" readonly required/>
                    <br>
                    <span>Mes</span>
                    <select v-on:change="loadValorGanancias" v-model="cajaMensual.month" required>
                        <option disabled value="">Seleccione un elemento</option>
                        <option value="1">Enero</option>
                        <option value="2">Febrero</option>
                        <option value="3">Marzo</option>
                        <option value="4">Abril</option>
                        <option value="5">Mayo</option>
                        <option value="6">Junio</option>
                        <option value="7">Julio</option>
                        <option value="8">Agosto</option>
                        <option value="9">Septiembre</option>
                        <option value="10">Octubre</option>
                        <option value="11">Noviembre</option>
                        <option value="12">Diciembre</option>
                    </select>
                    <br>
                    <span>Año</span>
                    <input v-on:change="loadValorGanancias" type="text" v-model="cajaMensual.year" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" required/>
                    <br>
                    <section class="buttonContainer">
                        <button type="submit" class="submitButtonCajas">Actualizar</button>
                    </section>
                </form>
            </section>
        </section>
        <section class="backgroundModalCajaMensualCrear" id="backgroundModalCajaMensualCrear">
            <section class="modalCajaMensualCrear" id="modalCajaMensualCrear">
                <section class="crosscontainer">
                    <section>
                        <svg class="icon-cross2-caja" v-on:click="cerrarModalCajaMensualCrear"><use xlink:href="#icon-cross"></use></svg>
                    </section>
                </section>
                <section class="warningMsg">** Recuerda que el valor de 'Total Ganancias' corresponde al 'Total vendido' - 'Total Gastos' - 'Total Deudas' + 'Total Ganancias del mes anterior'**</section>
                <form class="formModal" v-on:submit.prevent="crearCajaMensual">
                    <span>Fecha</span>
                    <input type="date" v-model="cajaMensual.date" required/>
                    <br>
                    <span>Total Ganancias</span>
                    <input type="text" v-model="cajaMensual.totalSold" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" readonly required/>
                    <br>
                    <span>Mes</span>
                    <select v-on:change="loadValorGanancias" v-model="cajaMensual.month" required>
                        <option disabled value="">Seleccione un elemento</option>
                        <option value="1">Enero</option>
                        <option value="2">Febrero</option>
                        <option value="3">Marzo</option>
                        <option value="4">Abril</option>
                        <option value="5">Mayo</option>
                        <option value="6">Junio</option>
                        <option value="7">Julio</option>
                        <option value="8">Agosto</option>
                        <option value="9">Septiembre</option>
                        <option value="10">Octubre</option>
                        <option value="11">Noviembre</option>
                        <option value="12">Diciembre</option>
                    </select>
                    <br>
                    <span>Año</span>
                    <input v-on:change="loadValorGanancias" type="text" v-model="cajaMensual.year" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" required/>
                    <br>
                    <section class="buttonContainer">
                        <button type="submit" class="submitButtonCajas">Cerrar Caja</button>
                    </section>
                </form>
            </section>
        </section>
        <section class="InnerContainerCajas">
            <section class="containerTableAndGraphs">
                <section class="title2">
                    <span>Cajas</span>
                </section>
                <table class="table-fill">
                    <thead>
                        <tr>
                            <th class="text-left">Fecha</th>
                            <th class="text-left">Papeleria</th>
                            <th class="text-left">Dulces y Aceo</th>
                            <th class="text-left">CIR</th>
                            <th class="text-left">Total Vendido</th>
                            <th class="text-left">Dia de la Semana</th>
                            <th class="text-left"></th>
                            <th class="text-left"></th>
                        </tr>
                    </thead>
                    <tbody class="table-hover" id="table-hover">
                        <tr v-for="caja in cajas" :key="caja.id">
                            <td class="text-left">{{caja.date}}</td>
                            <td class="text-left">${{Number(caja.papeleria).toLocaleString()}}</td>
                            <td class="text-left">${{Number(caja.dulces).toLocaleString()}}</td>
                            <td class="text-left">${{Number(caja.cir).toLocaleString()}}</td>
                            <td class="text-left">${{Number(caja.totalSold).toLocaleString()}}</td>
                            <td class="text-left">{{dias[caja.dayName]}}</td>
                            <td class="text-left" title="Editar" v-on:click="editarCaja(caja)">
                                <svg class="icon icon-pencil-caja"><use xlink:href="#icon-pencil"></use></svg>
                            </td>
                            <td class="text-left" title="Borrar" v-on:click="borrarCaja(caja)">
                                <svg class="icon icon-cross-caja"><use xlink:href="#icon-cross"></use></svg>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <section class="containerTableAndGraphs" id="containerTableAndGraphs">
                <section class="containerButtons">
                    <button class="buttonCaja" v-on:click="abrirModalCrearCaja">Añadir Caja</button><button class="buttonCaja" v-on:click="abrirModalCrearCajaMensual">Cerrar Caja Mensual</button>
                </section>
                <section class="containerTableAndGraphs">
                    <section class="title2">
                        <span>Cajas Mensuales</span>
                    </section>
                    <table class="table-fill">
                        <thead>
                            <tr>
                                <th class="text-left">Fecha</th>
                                <th class="text-left">Mes</th>
                                <th class="text-left">Total Ganancias</th>
                                <th class="text-left">Año</th>
                                <th class="text-left"></th>
                                <th class="text-left"></th>
                            </tr>
                        </thead>
                        <tbody class="table-hover" id="table-hover">
                            <tr v-for="cajaAnual in cajasAnual" :key="cajaAnual.id">
                                <td class="text-left">{{cajaAnual.date}}</td>
                                <td class="text-left">{{meses[cajaAnual.month]}}</td>
                                <td class="text-left">${{Number(cajaAnual.totalSold).toLocaleString()}}</td>
                                <td class="text-left">{{cajaAnual.year}}</td>
                                <td class="text-left" title="Editar" v-on:click="editarCajaMensual(cajaAnual)">
                                    <svg class="icon icon-pencil-caja"><use xlink:href="#icon-pencil"></use></svg>
                                </td>
                                <td class="text-left" title="Borrar" v-on:click="borrarCajaMensual(cajaAnual)">
                                    <svg class="icon icon-cross-caja"><use xlink:href="#icon-cross"></use></svg>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <canvas id="myChart" v-bind:width="width" v-bind:height="height"></canvas>
            </section>
        </section>
    </section>
  </section>
</template>

<script>
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { functionTypeAnnotation } from "@babel/types";
import swal from 'sweetalert';
import moment from 'moment';
import Chart from 'chart.js/auto';

var bufferABase64 = buffer => btoa(String.fromCharCode(...new Uint8Array(buffer)));
var base64ABuffer = buffer => Uint8Array.from(atob(buffer), c => c.charCodeAt(0));
var LONGITUD_SAL = 16;
var LONGITUD_VECTOR_INICIALIZACION = LONGITUD_SAL;
var myChart = null;

export default {  
    name: "Cajas",
    data: function(){
        return {
            filter: {
                date: "",
                weekormonth: "week"
            },
            dias: {
                'Monday':'Lunes',
                'Tuesday':'Martes',
                'Wednesday':'Miercoles',
                'Thursday':'Jueves',
                'Friday':'Viernes',
                'Saturday':'Sabado',
                'Sunday':'Domingo',
            },
            meses: {
                '1':'Enero',
                '2':'Febrero',
                '3':'Marzo',
                '4':'Abril',
                '5':'Mayo',
                '6':'Junio',
                '7':'Julio',
                '8':'Agosto',
                '9':'Septiembre',
                '10':'Octubre',
                '11':'Noviembre',
                '12':'Diciembre',
            },
            validarNumeroMes: {
                '1':'01',
                '2':'02',
                '3':'03',
                '4':'04',
                '5':'05',
                '6':'06',
                '7':'07',
                '8':'08',
                '9':'09',
                '10':'10',
                '11':'11',
                '12':'12',
            },
            cajaMensual: {},
            caja: {},
            cajas: [],
            cajasAnual: [],
            totales: [],
            blanco: '#fafafa',
            gris: '#e3e3e3',
            veige: 'rgb(245,238,230)',
            piel: 'rgb(243,215,202)',
            rosaClaro: '#e6a4b4',
            rosaFuerte: '#c86b85',
            colorVentas : localStorage.getItem('appMode') === 'true'|| !localStorage.getItem('appMode') ? "#acdeaa":'#a7d129',
            colorGastos: localStorage.getItem('appMode') === 'true' || !localStorage.getItem('appMode') ?"#f46060":'#8f1d14',
            colorPrincipal: localStorage.getItem('appMode') === 'true'|| !localStorage.getItem('appMode') ?'#c86b85':'#f3d7ca',
            colorSecundario: localStorage.getItem('appMode') === 'true' || !localStorage.getItem('appMode') ? '#f3d7ca':'#c86b85',
            colorPrincipal2: localStorage.getItem('appMode') === 'true' || !localStorage.getItem('appMode') ?'#f3d7ca':'#c86b85',
            colorSecundario2: localStorage.getItem('appMode') === 'true' || !localStorage.getItem('appMode') ? '#c86b85':'#f3d7ca',
            negro: 'rgb(0,0,0)',
            titleAppMode: localStorage.getItem('appMode') === 'true' || !localStorage.getItem('appMode') ? 'Claro':'Oscuro',
            width: screen.width <= 1366 ? '400' : '600',
            height: screen.height <= 768 ? '400' : '600',
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
        editarCaja: function(caja){
            this.caja = caja;
            document.getElementById('modalCaja').style.opacity = '1';
            document.getElementById('modalCaja').style.visibility = 'visible';
            document.getElementById('backgroundModalCaja').style.opacity = '1';
            document.getElementById('backgroundModalCaja').style.visibility = 'visible';
        },
        abrirModalCrearCaja: function(){
            document.getElementById('modalCajaCrear').style.opacity = '1';
            document.getElementById('modalCajaCrear').style.visibility = 'visible';
            document.getElementById('backgroundModalCajaCrear').style.opacity = '1';
            document.getElementById('backgroundModalCajaCrear').style.visibility = 'visible';
        },
        editarCajaMensual: function(caja){
            this.cajaMensual = caja;
            document.getElementById('modalCajaMensual').style.opacity = '1';
            document.getElementById('modalCajaMensual').style.visibility = 'visible';
            document.getElementById('backgroundModalCajaMensual').style.opacity = '1';
            document.getElementById('backgroundModalCajaMensual').style.visibility = 'visible';
        },
        abrirModalCrearCajaMensual: function(){
            document.getElementById('modalCajaMensualCrear').style.opacity = '1';
            document.getElementById('modalCajaMensualCrear').style.visibility = 'visible';
            document.getElementById('backgroundModalCajaMensualCrear').style.opacity = '1';
            document.getElementById('backgroundModalCajaMensualCrear').style.visibility = 'visible';
        },
        crearCajaMensual: function(){
            var Data = {
                'date':this.cajaMensual.date,
                'totalSold':Number(this.cajaMensual.totalSold),
                'month':Number(this.cajaMensual.month),
                'year':Number(this.cajaMensual.year)
            }
            if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                this.$emit('LogOut');
                return;
            }

            axios.post(`https://kositeria-be.herokuapp.com/createCajaMensual/`,Data,{headers: {}})
                .then(async (result) => {
                    this.loadCajasAnual()
                    swal('Crear Caja Mensual', 'Se ha creado la caja mensual correctamente', 'success').then(()=>{this.cerrarModalCajaMensualCrear()})
                })    
                .catch((e) => {
                    swal(''+e.response.status+'',e.response.statusText,'error');
                });
        },
        calculartotalSold: function() {
            var papeleria = Number(this.caja.papeleria);
            var dulces = Number(this.caja.dulces);
            var cir = Number(this.caja.cir);
            this.caja.papeleria = isNaN(papeleria)?0:papeleria;
            this.caja.dulces = isNaN(dulces)?0:dulces;
            this.caja.cir = isNaN(cir)?0:cir;
            this.caja.totalSold = this.caja.papeleria + this.caja.dulces + this.caja.cir
        },
        updateCaja: function(){
            swal({
                title: "¿Estas seguro?",
                text: "Una vez modificado no se podrá revertir!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                        this.$emit('LogOut');
                        return;
                    }

                    var Caja = this.caja
                    var Data = {
                        'date': this.caja.date,
                        'papeleria': this.caja.papeleria,
                        'dulces':this.caja.dulces,
                        'cir':this.caja.cir,
                        'totalSold':this.caja.totalSold,
                    }
                    var id = this.caja.id;
                    axios.put(`https://kositeria-be.herokuapp.com/updateCaja/${id}/`,Data,{headers: {}})
                        .then(async (result) => {
                            this.loadCajas()
                            swal('Modificar Caja', 'Se ha modificado la caja correctamente', 'success').then(()=>{this.cerrarModalCaja()})
                        })    
                        .catch((e) => {
                            swal(''+e.response.status+'',e.response.statusText,'error');
                        });
                } else {
                    swal("Has cancelado la acción");
                }
            });
            
        },
        updateCajaMensual: function(){
            swal({
                title: "¿Estas seguro?",
                text: "Una vez modificado no se podrá revertir!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                        this.$emit('LogOut');
                        return;
                    }

                    var Data = {
                        'date': this.cajaMensual.date,
                        'totalSold': Number(this.cajaMensual.totalSold),
                        'month': Number(this.cajaMensual.month),
                        'year': Number(this.cajaMensual.year),
                    }
                    var id = this.cajaMensual.id;
                    axios.put(`https://kositeria-be.herokuapp.com/updateCajaMensual/${id}/`,Data,{headers: {}})
                        .then(async (result) => {
                            this.loadCajasAnual()
                            swal('Modificar Caja Mensual', 'Se ha modificado la caja mensual correctamente', 'success').then(()=>{this.cerrarModalCajaMensual()})
                        })    
                        .catch((e) => {
                            swal(''+e.response.status+'',e.response.statusText,'error');
                        });
                } else {
                    swal("Has cancelado la acción");
                }
            });
        },
        loadValorGanancias: function(){
            if(!isNaN(Number(this.cajaMensual.month)) && !isNaN(Number(this.cajaMensual.year))){
                var month = this.validarNumeroMes[this.cajaMensual.month];
                var year = Number(this.cajaMensual.year);
                var date = year + '-' + month + '-01'

                if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                    this.$emit('LogOut');
                    return;
                }

                axios.get(`https://kositeria-be.herokuapp.com/detailTotalMonth/${date}/`, {headers: {}})
                    .then(async (result) => {
                        this.cajaMensual.totalSold = result.data.totalMonthWithDeudas;
                    })    
                    .catch((e) => {
                        swal('error',e,'error');
                    });
                }
        },
        cerrarModalCaja: function(){
            document.getElementById('modalCaja').style.opacity = '0';
            document.getElementById('modalCaja').style.visibility = 'hidden';
            document.getElementById('backgroundModalCaja').style.opacity = '0';
            document.getElementById('backgroundModalCaja').style.visibility = 'hidden';
            this.caja = {}
        },
        cerrarModalCajaCrear: function(){
            document.getElementById('modalCajaCrear').style.opacity = '0';
            document.getElementById('modalCajaCrear').style.visibility = 'hidden';
            document.getElementById('backgroundModalCajaCrear').style.opacity = '0';
            document.getElementById('backgroundModalCajaCrear').style.visibility = 'hidden';
            this.caja = {}
        },
        cerrarModalCajaMensual: function(){
            document.getElementById('modalCajaMensual').style.opacity = '0';
            document.getElementById('modalCajaMensual').style.visibility = 'hidden';
            document.getElementById('backgroundModalCajaMensual').style.opacity = '0';
            document.getElementById('backgroundModalCajaMensual').style.visibility = 'hidden';
            this.cajaMensual = {}
        },
        cerrarModalCajaMensualCrear: function(){
            document.getElementById('modalCajaMensualCrear').style.opacity = '0';
            document.getElementById('modalCajaMensualCrear').style.visibility = 'hidden';
            document.getElementById('backgroundModalCajaMensualCrear').style.opacity = '0';
            document.getElementById('backgroundModalCajaMensualCrear').style.visibility = 'hidden';
            this.cajaMensual = {}
        },
        borrarCaja: function(caja){
            swal({
                title: "¿Estas seguro?",
                text: "Una vez eliminado no se podrá recuperar!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                        this.$emit('LogOut');
                        return;
                    }

                    var id = caja.id
                    axios.delete(`https://kositeria-be.herokuapp.com/deleteCaja/${id}/`,{headers: {}})
                        .then(async (result) => {
                            this.loadCajas()
                            swal('Borrar Caja', 'Se ha borrado la caja correctamente', 'success')
                        })    
                        .catch((e) => {
                            console.log(e)
                        });
                } else {
                    swal("Has cancelado la acción");
                }
            });
            
        },
        borrarCajaMensual: function(cajaMensual){
            swal({
                title: "¿Estas seguro?",
                text: "Una vez eliminado no se podrá recuperar!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                        this.$emit('LogOut');
                        return;
                    }

                    var id = cajaMensual.id
                    axios.delete(`https://kositeria-be.herokuapp.com/deleteCajaMensual/${id}/`,{headers: {}})
                        .then(async (result) => {
                            this.loadCajasAnual()
                            swal('Borrar Caja', 'Se ha borrado la caja correctamente', 'success')
                        })    
                        .catch((e) => {
                            console.log(e)
                        });
                } else {
                    swal("Has cancelado la acción");
                }
            });
            
        },
        loadCajas:async function(){
            if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                this.$emit('LogOut');
                return;
            }
            var date = this.filter.date
            var weekormonth = this.filter.weekormonth
            var urlCajas = "";
            var urlTotales = "";

            if(weekormonth === 'week' && date){
                urlCajas = `https://kositeria-be.herokuapp.com/detailWeekCaja/${date}/`
                urlTotales = `https://kositeria-be.herokuapp.com/detailTotalWeek/${date}/`
            } else {
                if(weekormonth === 'month' && date){
                    urlCajas = `https://kositeria-be.herokuapp.com/detailMonthCaja/${date}/`
                    urlTotales = `https://kositeria-be.herokuapp.com/detailTotalMonth/${date}/`    
                } else {
                    var today = moment().format('YYYY-MM-DD');
                    urlCajas = `https://kositeria-be.herokuapp.com/detailWeekCaja/${today}/`
                    urlTotales = `https://kositeria-be.herokuapp.com/detailTotalWeek/${today}/`
                }
            }
            axios.get(urlCajas, {headers: {}})
                .then(async (result) => {
                    this.cajas = result.data;
                    var Data = result.data;

                    var fechas = [0];
                    var valores = [0];
                    for (var i in Data){
                        fechas.push(Data[i].date)
                        valores.push(Data[i].totalSold)
                    }
                    if(myChart instanceof Chart)
                    {
                        myChart.destroy();
                        
                        document.getElementById('myChart').remove();
                        var mycanvas = document.createElement('canvas')
                        mycanvas.setAttribute('id', 'myChart')
                        document.getElementById('containerTableAndGraphs').append(mycanvas);
                    }
                    const ctx = document.getElementById('myChart').getContext('2d');
                    myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: fechas,
                            datasets: [{
                                label: 'Ventas por fecha',
                                data: valores,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                ],
                                borderColor: [
                                    'rgba(200, 107, 133, 1)',
                                ],
                                borderWidth: 2,
                                fill: true,
                            }]
                        },
                        plugins: [
                            {
                                id: 'custom_canvas_background_color',
                                beforeDraw: (chart) => {
                                    const {ctx} = chart;
                                    ctx.save();
                                    ctx.globalCompositeOperation = 'destination-over';
                                    ctx.fillStyle = '#fafafa';
                                    ctx.fillRect(0, 0, chart.width, chart.height);
                                    ctx.restore();
                                }
                            }
                        ],
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                })    
                .catch((e) => {
                    swal('error',e,'error');
                });
            axios.get(urlTotales, {headers: {}})
                .then(async (result) => {
                    this.totales = result.data;
                })    
                .catch((error) => {
                    swal('error',error,'error');
                });
        },
        loadCajasAnual:async function(){
            if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                this.$emit('LogOut');
                return;
            }
            var today = moment().year();
            axios.get(`https://kositeria-be.herokuapp.com/detailYearCajaMensual/${today}/`, {headers: {}})
                .then(async (result) => {
                    this.cajasAnual = result.data;
                })    
                .catch((e) => {
                    swal('error',e,'error');
                });
        },
        CrearCaja: async function(){
            if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                this.$emit('LogOut');
                return;
            }

            var Caja = this.caja
            axios.post(`https://kositeria-be.herokuapp.com/createCaja/`,Caja,{headers: {}})
                .then(async (result) => {
                    this.loadCajas()
                    swal('Crear Caja', 'Se ha creado la caja correctamente', 'success').then(()=>{this.cerrarModalCajaCrear()})
                })    
                .catch((e) => {
                    swal(''+e.response.status+'',e.response.statusText,'error');
                });
        },
    },
    created: function(){
        var today = moment().format('YYYY-MM-DD');
        this.filter.date = today
        this.loadCajas();
        this.loadCajasAnual();
    }
}
</script>

<style>
.PerfilInnerPage {
    padding: 10vh 0px;
    display: flex;
    width: 100vw;
    min-height: 100vh;
    height: fit-content;
    justify-content: center;
}
.formCajas {
    display: flex;
    align-items: center;
    justify-content: center;
}
.title span{
    font-size: 5vh;
}
.title {
    display: flex;
    justify-content: center;
}
.title2 {
    display: flex;
    justify-content: center;
}
.title2 span{
    font-size: 3vh;
}
.formCajas input {
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
.formCajas input::placeholder {
    transition: all 0.5s;
    color: v-bind(gris);
}
.formCajas input:hover {
    color: v-bind(rosaFuerte);
}
.formCajas input:hover::placeholder {
    color: v-bind(rosaClaro)
}
.formCajas span{
    justify-content: center;
    display: flex;
}
.submitButtonCajas {
    margin: 0px 20px;
    color: v-bind(colorSecundario);
    background-color: v-bind(colorPrincipal);
    border: none;
    border-radius: 5px;
    height: 3vh;
    font-size: 2vh;
    cursor: pointer;
    transition: all 0.5s;
}
.submitButtonCajas:hover {
    color: v-bind(colorSecundario2);
    background-color: v-bind(colorPrincipal2);
}
#radio {
    margin: 0px;
    width: 5vh;
    height: 2vh;
}
/*** Table Styles **/

.table-fill {
    background: white;
    border-radius:3px;
    border-collapse: collapse;
    height: fit-content;
    margin: auto;
    max-width: 60vw;
    padding:5px;
    width: 100%;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    animation: float 5s infinite;
}
th {
    color:#D5DDE5;;
    background:#1b1e24;
    border-bottom:4px solid #9ea7af;
    border-right: 1px solid #343a45;
    font-size:23px;
    font-weight: 100;
    padding:24px;
    text-align:left;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    vertical-align:middle;
}

th:first-child {
    border-top-left-radius:3px;
}
th:last-child {
    border-top-right-radius:3px;
    border-right:none;
}
tr {
    border-top: 1px solid #C1C3D1;
    border-bottom-: 1px solid #C1C3D1;
    color:#666B85;
    font-size:16px;
    font-weight:normal;
    text-shadow: 0 1px 1px rgba(256, 256, 256, 0.1);
}
tr:hover td {
    cursor: pointer;
    background:#4E5066;
    color: #fafafa;
    border-top: 1px solid #22262e;
}
tr:first-child {
    border-top:none;
}
tr:last-child {
    border-bottom:none;
}
tr:nth-child(odd) td {
    background:#EBEBEB;
}
tr:nth-child(odd):hover td {
    background:#4E5066;
}
tr:last-child td:first-child {
    border-bottom-left-radius:3px;
}
tr:last-child td:last-child {
    border-bottom-right-radius:3px;
}
td {
    background:#FFFFFF;
    padding:20px;
    text-align:left;
    vertical-align:middle;
    font-weight:300;
    font-size:18px;
    text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
    border-right: 1px solid #C1C3D1;
}

td:last-child {
    border-right: 0px;
}

th.text-left {
    text-align: left;
}

th.text-center {
    text-align: center;
}

th.text-right {
    text-align: right;
}

td.text-left {
    text-align: left;
}

td.text-center {
    text-align: center;
}

td.text-right {
    text-align: right;
}
.icon-pencil-caja {
    display: inline-block;
    width: 1em;
    height: 1em;
    stroke-width: 0;
    stroke: v-bind(colorVentas);
    fill: v-bind(colorVentas);
}
.icon-cross-caja {
    display: inline-block;
    width: 1em;
    height: 1em;
    stroke-width: 0;
    stroke: v-bind(colorGastos);
    fill: v-bind(colorGastos);
}

.InnerContainerCajas {
    width: 80%;
    display: inline-flex;
    justify-content: center;
}
.containerTableAndGraphs {
    display: block;
    padding: 5%;
}
.containerButtons {
    width: 100%;
    display: inline-flex;
    justify-content: center;
}
.buttonCaja {
    border-radius: 5px;
    cursor: pointer;
    margin: 1vw;
}
.modalCaja {
    z-index: 17;
    visibility: hidden;
    transform: translateX(45vw) translateY(30vh);
    -webkit-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
    background-color: v-bind(blanco);
    display: grid;
    position: absolute;
    height: 50vh;
    width: 50vh;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: all 0.5s ease-out;
}
.backgroundModalCaja {
    z-index: 16;
    visibility: hidden;
    transform: translateX(-20vw) translateY(-28vh);
    opacity: 0;
    height: 110vh;
    width: 110vw;
    position: fixed;
    display: flex;
    background-color: rgba(0,0,0,0.75);
    transition: all 0.5s ease-out;
}
.modalCajaCrear  {
    z-index: 17;
    visibility: hidden;
    transform: translateX(45vw) translateY(30vh);
    -webkit-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
    background-color: v-bind(blanco);
    display: grid;
    position: absolute;
    height: 50vh;
    width: 50vh;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: all 0.5s ease-out;
}
.backgroundModalCajaCrear {
    z-index: 16;
    visibility: hidden;
    transform: translateX(-20vw) translateY(-28vh);
    opacity: 0;
    height: 110vh;
    width: 110vw;
    position: fixed;
    display: flex;
    background-color: rgba(0,0,0,0.75);
    transition: all 0.5s ease-out;
}
.modalCajaMensual {
    z-index: 17;
    visibility: hidden;
    transform: translateX(45vw) translateY(30vh);
    -webkit-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
    background-color: v-bind(blanco);
    display: grid;
    position: absolute;
    height: 50vh;
    width: 50vh;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: all 0.5s ease-out;
}
.backgroundModalCajaMensual {
    z-index: 16;
    visibility: hidden;
    transform: translateX(-20vw) translateY(-28vh);
    opacity: 0;
    height: 110vh;
    width: 110vw;
    position: fixed;
    display: flex;
    background-color: rgba(0,0,0,0.75);
    transition: all 0.5s ease-out;
}
.modalCajaMensualCrear {
    z-index: 17;
    visibility: hidden;
    transform: translateX(45vw) translateY(30vh);
    -webkit-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
    background-color: v-bind(blanco);
    display: grid;
    position: absolute;
    height: 50vh;
    width: 50vh;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: all 0.5s ease-out;
}
.backgroundModalCajaMensualCrear {
    z-index: 16;
    visibility: hidden;
    transform: translateX(-20vw) translateY(-28vh);
    opacity: 0;
    height: 110vh;
    width: 110vw;
    position: fixed;
    display: flex;
    background-color: rgba(0,0,0,0.75);
    transition: all 0.5s ease-out;
}
.formModal {
    display: block;
}
.formModal input {
    width:10vw;
    height: 2vh;
    background-color: whitesmoke;
    text-align: center;
    transition: all 0.5s;
    margin: 20px 0px;
    border: none;
    color: v-bind(negro);
    border-radius: 5px;
}
.formModal input::placeholder {
    transition: all 0.5s;
    color: v-bind(gris);
}
.formModal input:hover {
    color: v-bind(rosaFuerte);
}
.formModal input:hover::placeholder {
    color: v-bind(rosaClaro)
}
.formModal span{
    justify-content: center;
    display: flex;
}
.formModal select {
    text-align: center;
}
.crosscontainer {
    display: block;
}
.crosscontainer section {
    position: absolute;
    right: 10%;
}
.icon-cross2-caja {
    cursor: pointer;
    display: inline-block;
    width: 1em;
    height: 1em;
    stroke-width: 0;
    stroke: v-bind(negro);
    fill: v-bind(negro);
}
.buttonContainer {
    display: flex;
    justify-content: center;
}
.warningMsg {
    border-style: solid;
    border-width: 2px;
    border-color: rgba(255,169,0);
    border-radius: 5px;
    background-color: rgba(255,169,0,0.7);
    width: 20vw;
    top: 5%;
    left: 5%;
    display: flex;
    text-align: center;
    position: absolute;
}
/*Responsive */
@media screen and (min-width: 1366px) and (max-width: 1920px) and (min-height:640px) and (max-height:1080px) {
    .table-fill {
        background: white;
        border-radius:3px;
        border-collapse: collapse;
        height: fit-content;
        margin: auto;
        max-width: 40vw;
        padding:5px;
        width: auto;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        animation: float 5s infinite;
    }
    th {
        color:#D5DDE5;;
        background:#1b1e24;
        border-bottom:4px solid #9ea7af;
        border-right: 1px solid #343a45;
        font-size:1vw;
        font-weight: 100;
        padding:1vw;
        text-align:left;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        vertical-align:middle;
    }

    th:first-child {
        border-top-left-radius:3px;
    }
    th:last-child {
        border-top-right-radius:3px;
        border-right:none;
    }
    tr {
        border-top: 1px solid #C1C3D1;
        border-bottom-: 1px solid #C1C3D1;
        color:#666B85;
        font-size:1vw;
        font-weight:normal;
        text-shadow: 0 1px 1px rgba(256, 256, 256, 0.1);
    }
    tr:hover td {
        cursor: pointer;
        background:#4E5066;
        color: #fafafa;
        border-top: 1px solid #22262e;
    }
    tr:first-child {
        border-top:none;
    }
    tr:last-child {
        border-bottom:none;
    }
    tr:nth-child(odd) td {
        background:#EBEBEB;
    }
    tr:nth-child(odd):hover td {
        background:#4E5066;
    }
    tr:last-child td:first-child {
        border-bottom-left-radius:3px;
    }
    tr:last-child td:last-child {
        border-bottom-right-radius:3px;
    }
    td {
        background:#FFFFFF;
        padding:1vw;
        text-align:left;
        vertical-align:middle;
        font-weight:300;
        font-size:1vw;
        text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
        border-right: 1px solid #C1C3D1;
    }

    td:last-child {
        border-right: 0px;
    }

    th.text-left {
        text-align: left;
    }

    th.text-center {
        text-align: center;
    }

    th.text-right {
        text-align: right;
    }

    td.text-left {
        text-align: left;
    }

    td.text-center {
        text-align: center;
    }

    td.text-right {
        text-align: right;
    }
    .containerTableAndGraphs {
        display: block;
        padding: 0px;
    }
    .InnerContainerCajas {
        width: 100%;
        display: inline-flex;
        justify-content: center;
    }
    #myChart {
        height: 400px;
        width: 400px;
    }
    .formModal input {
        width:10vw;
        height: 4vh;
        background-color: whitesmoke;
        text-align: center;
        transition: all 0.5s;
        margin: 20px 0px;
        border: none;
        color: v-bind(negro);
        border-radius: 5px;
    }
    .modalCaja {
        z-index: 17;
        visibility: hidden;
        transform: translateX(45vw) translateY(20vh);
        -webkit-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        background-color: v-bind(blanco);
        display: grid;
        position: absolute;
        height: fit-content;
        width: 50vh;
        border-radius: 8px;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: all 0.5s ease-out;
    }
    .backgroundModalCaja {
        z-index: 16;
        visibility: hidden;
        transform: translateX(-20vw) translateY(-35vh);
        opacity: 0;
        height: 110vh;
        width: 110vw;
        position: fixed;
        display: flex;
        background-color: rgba(0,0,0,0.75);
        transition: all 0.5s ease-out;
    }
    .modalCajaCrear  {
        z-index: 17;
        visibility: hidden;
        transform: translateX(45vw) translateY(20vh);
        -webkit-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        background-color: v-bind(blanco);
        display: grid;
        position: absolute;
        height: fit-content;
        width: 50vh;
        border-radius: 8px;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: all 0.5s ease-out;
    }
    .backgroundModalCajaCrear {
        z-index: 16;
        visibility: hidden;
        transform: translateX(-20vw) translateY(-35vh);
        opacity: 0;
        height: 110vh;
        width: 110vw;
        position: fixed;
        display: flex;
        background-color: rgba(0,0,0,0.75);
        transition: all 0.5s ease-out;
    }
    .modalCajaMensual .crosscontainer{
        height: 30vh;
    }
    .modalCajaMensual input {
        width: 100%;
    }
    .modalCajaMensual {
        z-index: 17;
        visibility: hidden;
        transform: translateX(45vw) translateY(5vh);
        -webkit-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        background-color: v-bind(blanco);
        display: grid;
        position: absolute;
        height: 90vh;
        width: 50vh;
        border-radius: 8px;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: all 0.5s ease-out;
    }
    .backgroundModalCajaMensual {
        z-index: 16;
        visibility: hidden;
        transform: translateX(-20vw) translateY(-35vh);
        opacity: 0;
        height: 110vh;
        width: 110vw;
        position: fixed;
        display: flex;
        background-color: rgba(0,0,0,0.75);
        transition: all 0.5s ease-out;
    }
    .modalCajaMensualCrear .crosscontainer{
        height: 30vh;
    }
    .modalCajaMensualCrear input {
        width: 100%;
    }
    .warningMsg {
        font-size: 3vh;
    }
    .modalCajaMensualCrear {
        z-index: 17;
        visibility: hidden;
        transform: translateX(45vw) translateY(5vh);
        -webkit-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        background-color: v-bind(blanco);
        display: grid;
        position: absolute;
        height: 90vh;
        width: 50vh;
        border-radius: 8px;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: all 0.5s ease-out;
    }
    .backgroundModalCajaMensualCrear {
        z-index: 16;
        visibility: hidden;
        transform: translateX(-20vw) translateY(-35vh);
        opacity: 0;
        height: 110vh;
        width: 110vw;
        position: fixed;
        display: flex;
        background-color: rgba(0,0,0,0.75);
        transition: all 0.5s ease-out;
    }
}
@media screen and (min-height: 640px) and (max-height: 3600px) and (min-width: 360px) and (max-width: 1080px) { 
    .formCajas {
        display: table-caption;
        width: 90vw;
    }
    .formCajas select{
        width: 20vw;
    }
    .formCajas .filterDate {
        width: 40vw;
    }
    .formCajas .labelSelect {
        margin: 0px 20px;
    }
    .InnerContainerCajas {
        width: 90vw;
        display: grid;
        justify-content: center;
    }
    .table-fill {
        background: white;
        border-radius:3px;
        border-collapse: collapse;
        height: fit-content;
        margin: auto;
        max-width: 90vw;
        padding:5px;
        width: auto;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        animation: float 5s infinite;
    }
    th {
        color:#D5DDE5;;
        background:#1b1e24;
        border-bottom:4px solid #9ea7af;
        border-right: 1px solid #343a45;
        font-size:3vw;
        font-weight: 100;
        padding:1vw;
        text-align:left;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        vertical-align:middle;
    }

    th:first-child {
        border-top-left-radius:3px;
    }
    th:last-child {
        border-top-right-radius:3px;
        border-right:none;
    }
    tr {
        border-top: 1px solid #C1C3D1;
        border-bottom-: 1px solid #C1C3D1;
        color:#666B85;
        font-size:3vw;
        font-weight:normal;
        text-shadow: 0 1px 1px rgba(256, 256, 256, 0.1);
    }
    tr:hover td {
        cursor: pointer;
        background:#4E5066;
        color: #fafafa;
        border-top: 1px solid #22262e;
    }
    tr:first-child {
        border-top:none;
    }
    tr:last-child {
        border-bottom:none;
    }
    tr:nth-child(odd) td {
        background:#EBEBEB;
    }
    tr:nth-child(odd):hover td {
        background:#4E5066;
    }
    tr:last-child td:first-child {
        border-bottom-left-radius:3px;
    }
    tr:last-child td:last-child {
        border-bottom-right-radius:3px;
    }
    td {
        background:#FFFFFF;
        padding:1vw;
        text-align:left;
        vertical-align:middle;
        font-weight:300;
        font-size:3vw;
        text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
        border-right: 1px solid #C1C3D1;
    }

    td:last-child {
        border-right: 0px;
    }

    th.text-left {
        text-align: left;
    }

    th.text-center {
        text-align: center;
    }

    th.text-right {
        text-align: right;
    }

    td.text-left {
        text-align: left;
    }

    td.text-center {
        text-align: center;
    }

    td.text-right {
        text-align: right;
    }.containerTableAndGraphs {
        display: block;
        padding: 0px;
    }
    #myChart {
        height: 400px;
        width: 400px;
    }
    .formModal input {
        width:10vw;
        height: 4vh;
        background-color: whitesmoke;
        text-align: center;
        transition: all 0.5s;
        margin: 20px 0px;
        border: none;
        color: v-bind(negro);
        border-radius: 5px;
    }
    .modalCaja {
        z-index: 17;
        visibility: hidden;
        transform: translateX(0vw) translateY(20vh);
        -webkit-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        background-color: v-bind(blanco);
        display: grid;
        position: absolute;
        height: fit-content;
        width: 50vh;
        border-radius: 8px;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: all 0.5s ease-out;
    }
    .modalCaja input{
        width: 100%;
    }
    .backgroundModalCaja {
        z-index: 16;
        visibility: hidden;
        transform: translateX(-10vw) translateY(-35vh);
        opacity: 0;
        height: 110vh;
        width: 110vw;
        position: fixed;
        display: flex;
        background-color: rgba(0,0,0,0.75);
        transition: all 0.5s ease-out;
    }
    .modalCajaCrear  {
        z-index: 17;
        visibility: hidden;
        transform: translateX(0vw) translateY(20vh);
        -webkit-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        background-color: v-bind(blanco);
        display: grid;
        position: absolute;
        height: fit-content;
        width: 50vh;
        border-radius: 8px;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: all 0.5s ease-out;
    }
    .modalCajaCrear input{
        width: 100%;
    }
    .backgroundModalCajaCrear {
        z-index: 16;
        visibility: hidden;
        transform: translateX(-10vw) translateY(-35vh);
        opacity: 0;
        height: 110vh;
        width: 110vw;
        position: fixed;
        display: flex;
        background-color: rgba(0,0,0,0.75);
        transition: all 0.5s ease-out;
    }
    .modalCajaMensual .crosscontainer{
        height: 30vh;
    }
    .modalCajaMensual input {
        width: 100%;
    }
    .modalCajaMensual {
        z-index: 17;
        visibility: hidden;
        transform: translateX(0vw) translateY(3vh);
        -webkit-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        background-color: v-bind(blanco);
        display: grid;
        position: absolute;
        height: 90vh;
        width: 50vh;
        border-radius: 8px;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: all 0.5s ease-out;
    }
    .backgroundModalCajaMensual {
        z-index: 16;
        visibility: hidden;
        transform: translateX(-10vw) translateY(-35vh);
        opacity: 0;
        height: 110vh;
        width: 110vw;
        position: fixed;
        display: flex;
        background-color: rgba(0,0,0,0.75);
        transition: all 0.5s ease-out;
    }
    .modalCajaMensualCrear .crosscontainer{
        height: 30vh;
    }
    .modalCajaMensualCrear input {
        width: 100%;
    }
    .warningMsg {
        font-size: 3vh;
        width: 30vh;
        left: 10%;
    }
    
    .modalCajaMensualCrear {
        z-index: 17;
        visibility: hidden;
        transform: translateX(0vw) translateY(3vh);
        -webkit-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.75);
        background-color: v-bind(blanco);
        display: grid;
        position: absolute;
        height: 90vh;
        width: 50vh;
        border-radius: 8px;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: all 0.5s ease-out;
    }
    .backgroundModalCajaMensualCrear {
        z-index: 16;
        visibility: hidden;
        transform: translateX(-10vw) translateY(-35vh);
        opacity: 0;
        height: 110vh;
        width: 110vw;
        position: fixed;
        display: flex;
        background-color: rgba(0,0,0,0.75);
        transition: all 0.5s ease-out;
    }
}
</style>