<template>
    <section class="PerfilInnerPage">
        <section class="containerPerfilForm">
            <section class="title">
                <span>Mis Deudas</span>
            </section>
            <form class="formCajas" v-on:submit.prevent="loadDeudas">
                <input type="date" class="filterDate" v-model="filter.date" required/>
                <input type="radio" id='radio' value="week" v-model="filter.weekormonth"/>
                <label for="Semana">Semana</label>
                <input type="radio"  id='radio' value="month" v-model="filter.weekormonth"/>
                <label for="Mes">Mes</label>
                <button type="submit" class="submitButtonDeudas">Buscar</button>
            </form>
            <section class="title2">
                <span>Total deudas en el periodo: ${{Number(valorTotal).toLocaleString()}}</span>
            </section>
            <section class="backgroundModalEditarDeuda" id="backgroundModalEditarDeuda">
                <section class="modalEditarDeuda" id="modalEditarDeuda">
                    <section class="crosscontainer">
                        <section>
                            <svg class="icon-cross2-deudas" v-on:click="cerrarModalEditarDeuda"><use xlink:href="#icon-cross"></use></svg>
                        </section>
                    </section>
                    <form class="formModal" v-on:submit.prevent="updateDeuda">
                        <span>Fecha</span>
                        <input type="date" v-model="deuda.date" required/>
                        <br>
                        <span>Valor</span>
                        <input type="text" v-model="deuda.amount" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" required/>
                        <br>
                        <span>Detalle</span>
                        <input type="text" v-model="deuda.detail" required/>
                        <br>
                        <section class="buttonContainer">
                            <button type="submit" class="submitButtonDeudas">Actualizar</button>
                        </section>
                    </form>
                </section>
            </section>
            <section class="backgroundModalCrearDeuda" id="backgroundModalCrearDeuda">
                <section class="modalCrearDeuda" id="modalCrearDeuda">
                    <section class="crosscontainer">
                        <section>
                            <svg class="icon-cross2-deudas" v-on:click="cerrarModalCrearDeuda"><use xlink:href="#icon-cross"></use></svg>
                        </section>
                    </section>
                    <form class="formModal" v-on:submit.prevent="CrearDeuda">
                        <span>Fecha</span>
                        <input type="date" v-model="deuda.date" required/>
                        <br>
                        <span>Valor</span>
                        <input type="text" v-model="deuda.amount" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" required/>
                        <br>
                        <span>Detalle</span>
                        <input type="text" v-model="deuda.detail" required/>
                        <br>
                        <section class="buttonContainer">
                            <button type="submit" class="submitButtonDeudas">Añadir Deuda</button>
                        </section>
                        
                    </form>
                </section>
            </section>
            <section class="InnerContainerCajas">
                <section class="containerTableAndGraphs">
                    <section class="title2">
                        <span>Deudas</span>
                    </section>
                    <table class="table-fill">
                        <thead>
                            <tr>
                                <th class="text-left">Fecha</th>
                                <th class="text-left">Detalle</th>
                                <th class="text-left">Valor</th>
                                <th class="text-left"></th>
                                <th class="text-left"></th>
                            </tr>
                        </thead>
                        <tbody class="table-hover" id="table-hover">
                            <tr v-for="deuda in deudas" :key="deuda.id">
                                <td class="text-left">{{deuda.date}}</td>
                                <td class="text-left">{{deuda.detail}}</td>
                                <td class="text-left">${{Number(deuda.amount).toLocaleString()}}</td>
                                <td class="text-left" title="Editar" v-on:click="abrirModalEditarDeuda(deuda)">
                                    <svg class="icon icon-pencil-deudas"><use xlink:href="#icon-pencil"></use></svg>
                                </td>
                                <td class="text-left" title="Borrar" v-on:click="borrarDeuda(deuda)">
                                    <svg class="icon icon-cross-deudas"><use xlink:href="#icon-cross"></use></svg>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section class="containerTableAndGraphs" id="containerTableAndGraphs">
                    <section class="containerButtons">
                        <button class="buttonCaja" v-on:click="abrirModalCrearDeuda">Añadir Deuda</button>
                    </section>
                    <canvas id="myChart" width="600" height="600"></canvas>
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
        name: "Deudas",
        data: function(){
            return {
                filter: {
                    date: "",
                    weekormonth: "month",
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
                valorTotal: 0,
                deuda: {},
                deudas: [],
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
            loadDeudas:async function(){
                if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                    this.$emit('LogOut');
                    return;
                }
                var date = this.filter.date
                var weekormonth = this.filter.weekormonth
                var urlDeudas = "";
                var urlTotales = "";

                if(weekormonth === 'week' && date){
                    urlDeudas = `https://kositeria-be.herokuapp.com/detailWeekDeuda/${date}/`
                    urlTotales = `https://kositeria-be.herokuapp.com/detailTotalWeek/${date}/`
                } else {
                    if(weekormonth === 'month' && date){
                        urlDeudas = `https://kositeria-be.herokuapp.com/detailMonthDeuda/${date}/`
                        urlTotales = `https://kositeria-be.herokuapp.com/detailTotalMonth/${date}/`    
                    } else {
                        var today = moment().format('YYYY-MM-DD');
                        urlDeudas = `https://kositeria-be.herokuapp.com/detailWeekDeuda/${today}/`
                        urlTotales = `https://kositeria-be.herokuapp.com/detailTotalWeek/${today}/`
                    }
                }

                axios.get(urlDeudas, {headers: {}})
                    .then(async (result) => {
                        this.deudas = result.data;
                        var Data = result.data;

                        var fechas = [0];
                        var valores = [0];
                        for (var i in Data){
                            fechas.push(Data[i].date)
                            valores.push(Data[i].amount)
                        }
                        if(myChart instanceof Chart)
                        {
                            myChart.destroy();
                            
                            document.getElementById('myChart').remove();
                            var mycanvas = document.createElement('canvas')
                            mycanvas.setAttribute('id', 'myChart')
                            mycanvas.setAttribute('height', '600')
                            mycanvas.setAttribute('width', '600')
                            document.getElementById('containerTableAndGraphs').append(mycanvas);
                        }
                        const ctx = document.getElementById('myChart').getContext('2d');
                        myChart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: fechas,
                                datasets: [{
                                    label: 'Deudas por fecha',
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
                        this.valorTotal = result.data.totalDeudas
                    })    
                    .catch((error) => {
                        swal('error',error,'error');
                    });
            },
            CrearDeuda: async function(){
                if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                    this.$emit('LogOut');
                    return;
                }

                var Deuda = this.deuda
                axios.post(`https://kositeria-be.herokuapp.com/createDeuda/`,Deuda,{headers: {}})
                    .then(async (result) => {
                        this.loadDeudas()
                        swal('Crear Deuda', 'Se ha creado la deuda correctamente', 'success').then(()=>{this.cerrarModalCrearDeuda()})
                    })    
                    .catch((e) => {
                        swal(''+e.response.status+'',e.response.statusText,'error');
                    });
            },
            updateDeuda: function(){
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

                        var Deuda = this.deuda
                        var Data = {
                            'date': this.deuda.date,
                            'amount':this.deuda.amount,
                            'detail':this.deuda.detail
                        }
                        var id = this.deuda.id;
                        axios.put(`https://kositeria-be.herokuapp.com/updateDeuda/${id}/`,Data,{headers: {}})
                            .then(async (result) => {
                                this.loadDeudas()
                                swal('Modificar Deuda', 'Se ha modificado la deuda correctamente', 'success').then(()=>{this.cerrarModalEditarDeuda()})
                            })    
                            .catch((e) => {
                                swal(''+e.response.status+'',e.response.statusText,'error');
                            });
                    } else {
                        swal("Has cancelado la acción");
                    }
                });
                
            },
            borrarDeuda: function(deuda){
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

                        var id = deuda.id
                        axios.delete(`https://kositeria-be.herokuapp.com/deleteDeuda/${id}/`,{headers: {}})
                            .then(async (result) => {
                                this.loadDeudas()
                                swal('Borrar Deuda', 'Se ha borrado la deuda correctamente', 'success')
                            })    
                            .catch((e) => {
                                console.log(e)
                            });
                    } else {
                        swal("Has cancelado la acción");
                    }
                });
                
            },
            abrirModalEditarDeuda: function(deuda){
                this.deuda = deuda;
                document.getElementById('modalEditarDeuda').style.opacity = '1';
                document.getElementById('modalEditarDeuda').style.visibility = 'visible';
                document.getElementById('backgroundModalEditarDeuda').style.opacity = '1';
                document.getElementById('backgroundModalEditarDeuda').style.visibility = 'visible';
            },
            abrirModalCrearDeuda: function(){
                document.getElementById('modalCrearDeuda').style.opacity = '1';
                document.getElementById('modalCrearDeuda').style.visibility = 'visible';
                document.getElementById('backgroundModalCrearDeuda').style.opacity = '1';
                document.getElementById('backgroundModalCrearDeuda').style.visibility = 'visible';
            },
            cerrarModalEditarDeuda: function(){
                document.getElementById('modalEditarDeuda').style.opacity = '0';
                document.getElementById('modalEditarDeuda').style.visibility = 'hidden';
                document.getElementById('backgroundModalEditarDeuda').style.opacity = '0';
                document.getElementById('backgroundModalEditarDeuda').style.visibility = 'hidden';
                this.deuda = {}
            },
            cerrarModalCrearDeuda: function(){
                document.getElementById('modalCrearDeuda').style.opacity = '0';
                document.getElementById('modalCrearDeuda').style.visibility = 'hidden';
                document.getElementById('backgroundModalCrearDeuda').style.opacity = '0';
                document.getElementById('backgroundModalCrearDeuda').style.visibility = 'hidden';
                this.deuda = {}
            },
        },
        created: function(){
            var today = moment().format('YYYY-MM-DD');
            this.filter.date = today
            this.loadDeudas();
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
    .submitButtonDeudas {
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
    .submitButtonDeudas:hover {
        color: v-bind(colorSecundario2);
        background-color: v-bind(colorPrincipal2);
    }
    #radio {
        margin: 0px;
        width: 5vh;
        height: 2vh;
    }
    .icon-pencil-deudas {
        display: inline-block;
        width: 1em;
        height: 1em;
        stroke-width: 0;
        stroke: v-bind(colorVentas);
        fill: v-bind(colorVentas);
    }
    .icon-cross-deudas {
        display: inline-block;
        width: 1em;
        height: 1em;
        stroke-width: 0;
        stroke: v-bind(colorGastos);
        fill: v-bind(colorGastos);
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
    .modalEditarDeuda {
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
    .backgroundModalEditarDeuda {
        z-index: 16;
        visibility: hidden;
        transform: translateX(-35vw) translateY(-28vh);
        opacity: 0;
        height: 110vh;
        width: 110vw;
        position: fixed;
        display: flex;
        background-color: rgba(0,0,0,0.75);
        transition: all 0.5s ease-out;
    }
    .modalCrearDeuda {
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
    .backgroundModalCrearDeuda {
        z-index: 16;
        visibility: hidden;
        transform: translateX(-35vw) translateY(-28vh);
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
    .crosscontainer {
        display: block;
    }
    .crosscontainer section {
        position: absolute;
        right: 10%;
    }
    .icon-cross2-deudas {
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
/*Responsive */
@media screen and (min-width: 1366px) and (max-width: 1920px) and (min-height:640px) and (max-height:1080px) {
    .modalEditarDeuda input {
        width: 100%;
    }
    .modalEditarDeuda {
        z-index: 17;
        visibility: hidden;
        transform: translateX(45vw) translateY(30vh);
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
    .backgroundModalEditarDeuda {
        z-index: 16;
        visibility: hidden;
        transform: translateX(-25vw) translateY(-35vh);
        opacity: 0;
        height: 110vh;
        width: 110vw;
        position: fixed;
        display: flex;
        background-color: rgba(0,0,0,0.75);
        transition: all 0.5s ease-out;
    }
    .modalCrearDeuda  {
        z-index: 17;
        visibility: hidden;
        transform: translateX(45vw) translateY(30vh);
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
    .modalCrearDeuda input {
        width: 100%;
    }
    .backgroundModalCrearDeuda {
        z-index: 16;
        visibility: hidden;
        transform: translateX(-25vw) translateY(-35vh);
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
    .modalEditarDeuda {
        transform: translateX(0vw) translateY(20vh);
    }
    .modalEditarDeuda input{
        width: 100%;
    }
    .backgroundModalEditarDeuda {
        transform: translateX(-10vw) translateY(-35vh);
    }
    .modalCrearDeuda  {
        transform: translateX(0vw) translateY(20vh);
    }
    .modalCrearDeuda  input{
        width: 100%;
    }
    .backgroundModalCrearDeuda {
        transform: translateX(-10vw) translateY(-35vh);
    }
}
</style>