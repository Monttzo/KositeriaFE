<template>
    <section class="PerfilInnerPage">
        <section class="containerPerfilForm">
            <section class="title">
                <span>Mis Gastos</span>
            </section>
            <form class="formCajas" v-on:submit.prevent="loadGastos">
                <input type="date" class="filterDate" v-model="filter.date" required/>
                <input type="radio" id='radio' value="week" v-model="filter.weekormonth"/>
                <label for="Semana">Semana</label>
                <input type="radio"  id='radio' value="month" v-model="filter.weekormonth"/>
                <label for="Mes">Mes</label>
                <label for="Tipo" class="labelSelect">Tipo</label>
                <select v-model="filter.type" required>
                    <option disabled value="">Seleccione un elemento</option>
                    <option value="todos">Todos</option>
                    <option value="inventario">Inventario</option>
                    <option value="dulces">Dulces y Aceo</option>
                    <option value="plataforma">Plataforma</option>
                    <option value="varios">Varios</option>
                </select>
                <button type="submit" class="submitButtonGastos">Buscar</button>
            </form>
            <section class="title2">
                <span>Total gastos en el periodo: ${{Number(valorTotal).toLocaleString()}}</span>
            </section>
            <section class="backgroundModalEditarGasto" id="backgroundModalEditarGasto">
                <section class="modalEditarGasto" id="modalEditarGasto">
                    <section class="crosscontainer">
                        <section>
                            <svg class="icon-cross2" v-on:click="cerrarModalEditarGasto"><use xlink:href="#icon-cross"></use></svg>
                        </section>
                    </section>
                    <form class="formModal" v-on:submit.prevent="updateGasto">
                        <span>Fecha</span>
                        <input type="date" v-model="gasto.date" required/>
                        <br>
                        <span>Valor</span>
                        <input type="text" v-model="gasto.amount" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" required/>
                        <br>
                        <span>Detalle</span>
                        <input type="text" v-model="gasto.detail" required/>
                        <br>
                        <span>Tipo</span>
                        <select v-model="gasto.type" required>
                            <option disabled value="">Seleccione un elemento</option>
                            <option value="inventario">Inventario</option>
                            <option value="dulces">Dulces y Aceo</option>
                            <option value="plataforma">Plataforma</option>
                            <option value="varios">Varios</option>
                        </select>
                        <br>
                        <section class="buttonContainer">
                            <button type="submit" class="submitButtonGastos">Actualizar</button>
                        </section>
                    </form>
                </section>
            </section>
            <section class="backgroundModalCrearGasto" id="backgroundModalCrearGasto">
                <section class="modalCrearGasto" id="modalCrearGasto">
                    <section class="crosscontainer">
                        <section>
                            <svg class="icon-cross2" v-on:click="cerrarModalCrearGasto"><use xlink:href="#icon-cross"></use></svg>
                        </section>
                    </section>
                    <form class="formModal" v-on:submit.prevent="CrearGasto">
                        <span>Fecha</span>
                        <input type="date" v-model="gasto.date" required/>
                        <br>
                        <span>Valor</span>
                        <input type="text" v-model="gasto.amount" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" required/>
                        <br>
                        <span>Detalle</span>
                        <input type="text" v-model="gasto.detail" required/>
                        <br>
                        <span>Tipo</span>
                        <select v-model="gasto.type" required>
                            <option disabled value="">Seleccione un elemento</option>
                            <option value="inventario">Inventario</option>
                            <option value="dulces">Dulces y Aceo</option>
                            <option value="plataforma">Plataforma</option>
                            <option value="varios">Varios</option>
                        </select>
                        <br>
                        <section class="buttonContainer">
                            <button type="submit" class="submitButtonGastos">Añadir Gasto</button>
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
                                <th class="text-left">Tipo</th>
                                <th class="text-left">Detalle</th>
                                <th class="text-left">Valor</th>
                                <th class="text-left"></th>
                                <th class="text-left"></th>
                            </tr>
                        </thead>
                        <tbody class="table-hover" id="table-hover">
                            <tr v-for="gasto in gastos" :key="gasto.id">
                                <td class="text-left">{{gasto.date}}</td>
                                <td class="text-left">{{this.tipos[gasto.type]}}</td>
                                <td class="text-left">{{gasto.detail}}</td>
                                <td class="text-left">${{Number(gasto.amount).toLocaleString()}}</td>
                                <td class="text-left" title="Editar" v-on:click="abrirModalEditarGasto(gasto)">
                                    <svg class="icon icon-pencil"><use xlink:href="#icon-pencil"></use></svg>
                                </td>
                                <td class="text-left" title="Borrar" v-on:click="borrarGasto(gasto)">
                                    <svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section class="containerTableAndGraphs" id="containerTableAndGraphs">
                    <section class="containerButtons">
                        <button class="buttonCaja" v-on:click="abrirModalCrearGasto">Añadir Gasto</button>
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
        name: "Gastos",
        data: function(){
            return {
                filter: {
                    date: "",
                    weekormonth: "week",
                    type: "todos",
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
                tipos: {
                    'inventario':'Inventario',
                    'plataforma':'Plataforma',
                    'dulces':'Dulces y Aceo',
                    'varios':'Varios',
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
                gasto: {},
                gastos: [],
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
            loadGastos:async function(){
                if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                    this.$emit('LogOut');
                    return;
                }
                var type = this.filter.type
                var date = this.filter.date
                var weekormonth = this.filter.weekormonth
                var urlGastos = "";
                var urlTotales = "";

                if(weekormonth === 'week' && date && type != "" && type != "todos"){
                    urlGastos = `https://kositeria-be.herokuapp.com/detailWeekTypeGasto/${date}/${type}/`
                    urlTotales = `https://kositeria-be.herokuapp.com/detailTotalWeek/${date}/`
                } else {
                    if(weekormonth === 'month' && date && type != "" && type != "todos"){
                        urlGastos = `https://kositeria-be.herokuapp.com/detailMonthTypeGasto/${date}/`
                        urlTotales = `https://kositeria-be.herokuapp.com/detailTotalMonth/${date}/`    
                    } else {
                        if(weekormonth === 'week' && date){
                            urlGastos = `https://kositeria-be.herokuapp.com/detailWeekGasto/${date}/`
                            urlTotales = `https://kositeria-be.herokuapp.com/detailTotalWeek/${date}/`
                        } else {
                            if(weekormonth === 'month' && date){
                                urlGastos = `https://kositeria-be.herokuapp.com/detailMonthGasto/${date}/`
                                urlTotales = `https://kositeria-be.herokuapp.com/detailTotalMonth/${date}/`    
                            } else {
                                var today = moment().format('YYYY-MM-DD');
                                urlGastos = `https://kositeria-be.herokuapp.com/detailWeekGasto/${today}/`
                                urlTotales = `https://kositeria-be.herokuapp.com/detailTotalWeek/${today}/`
                            }
                        }
                        
                    }
                }

                axios.get(urlGastos, {headers: {}})
                    .then(async (result) => {
                        this.gastos = result.data;
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
                                    label: 'Gastos por fecha',
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
                        switch (type) {
                            case 'inventario':
                                this.valorTotal = result.data.inventario
                                break;
                            case 'plataforma':
                                this.valorTotal = result.data.plataforma
                                break;
                            case 'dulces':
                                this.valorTotal = result.data.dulces
                                break;
                            case 'varios':
                                this.valorTotal = result.data.varios
                                break;
                            default:
                                this.valorTotal = result.data.totalGastos
                                break;
                        }
                    })    
                    .catch((error) => {
                        swal('error',error,'error');
                    });
            },
            CrearGasto: async function(){
                if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                    this.$emit('LogOut');
                    return;
                }

                var Gasto = this.gasto
                axios.post(`https://kositeria-be.herokuapp.com/createGasto/`,Gasto,{headers: {}})
                    .then(async (result) => {
                        this.loadGastos()
                        swal('Crear Gastos', 'Se ha creado el gasto correctamente', 'success').then(()=>{this.cerrarModalCrearGasto()})
                    })    
                    .catch((e) => {
                        swal(''+e.response.status+'',e.response.statusText,'error');
                    });
            },
            updateGasto: function(){
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

                        var Gasto = this.gasto
                        var Data = {
                            'date': this.gasto.date,
                            'type': this.gasto.type,
                            'amount':this.gasto.amount,
                            'detail':this.gasto.detail
                        }
                        var id = this.gasto.id;
                        axios.put(`https://kositeria-be.herokuapp.com/updateGasto/${id}/`,Data,{headers: {}})
                            .then(async (result) => {
                                this.loadGastos()
                                swal('Modificar Gasto', 'Se ha modificado el gasto correctamente', 'success').then(()=>{this.cerrarModalEditarGasto()})
                            })    
                            .catch((e) => {
                                swal(''+e.response.status+'',e.response.statusText,'error');
                            });
                    } else {
                        swal("Has cancelado la acción");
                    }
                });
                
            },
            borrarGasto: function(gasto){
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

                        var id = gasto.id
                        axios.delete(`https://kositeria-be.herokuapp.com/deleteGasto/${id}/`,{headers: {}})
                            .then(async (result) => {
                                this.loadGastos()
                                swal('Borrar Gasto', 'Se ha borrado el gasto correctamente', 'success')
                            })    
                            .catch((e) => {
                                console.log(e)
                            });
                    } else {
                        swal("Has cancelado la acción");
                    }
                });
                
            },
            abrirModalEditarGasto: function(gasto){
                this.gasto = gasto;
                document.getElementById('modalEditarGasto').style.opacity = '1';
                document.getElementById('modalEditarGasto').style.visibility = 'visible';
                document.getElementById('backgroundModalEditarGasto').style.opacity = '1';
                document.getElementById('backgroundModalEditarGasto').style.visibility = 'visible';
            },
            abrirModalCrearGasto: function(){
                document.getElementById('modalCrearGasto').style.opacity = '1';
                document.getElementById('modalCrearGasto').style.visibility = 'visible';
                document.getElementById('backgroundModalCrearGasto').style.opacity = '1';
                document.getElementById('backgroundModalCrearGasto').style.visibility = 'visible';
            },
            cerrarModalEditarGasto: function(){
                document.getElementById('modalEditarGasto').style.opacity = '0';
                document.getElementById('modalEditarGasto').style.visibility = 'hidden';
                document.getElementById('backgroundModalEditarGasto').style.opacity = '0';
                document.getElementById('backgroundModalEditarGasto').style.visibility = 'hidden';
                this.gasto = {}
            },
            cerrarModalCrearGasto: function(){
                document.getElementById('modalCrearGasto').style.opacity = '0';
                document.getElementById('modalCrearGasto').style.visibility = 'hidden';
                document.getElementById('backgroundModalCrearGasto').style.opacity = '0';
                document.getElementById('backgroundModalCrearGasto').style.visibility = 'hidden';
                this.gasto = {}
            },
        },
        created: function(){
            var today = moment().format('YYYY-MM-DD');
            this.filter.date = today
            this.loadGastos();
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
    .submitButtonGastos {
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
    .submitButtonGastos:hover {
        color: v-bind(colorSecundario2);
        background-color: v-bind(colorPrincipal2);
    }
    #radio {
        margin: 0px;
        width: 5vh;
        height: 2vh;
    }
    .icon-pencil {
        display: inline-block;
        width: 1em;
        height: 1em;
        stroke-width: 0;
        stroke: v-bind(colorVentas);
        fill: v-bind(colorVentas);
    }
    .icon-cross {
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
    .modalEditarGasto {
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
    .backgroundModalEditarGasto {
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
    .modalCrearGasto  {
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
    .backgroundModalCrearGasto {
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
    .icon-cross2 {
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
    .modalEditarGasto input {
        width: 100%;
    }
    .modalEditarGasto {
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
    .backgroundModalEditarGasto {
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
    .modalCrearGasto  {
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
    .modalCrearGasto input {
        width: 100%;
    }
    .backgroundModalCrearGasto {
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
    .modalEditarGasto {
        transform: translateX(0vw) translateY(20vh);
    }
    .modalEditarGasto input{
        width: 100%;
    }
    .backgroundModalEditarGasto {
        transform: translateX(-10vw) translateY(-35vh);
    }
    .modalCrearGasto  {
        transform: translateX(0vw) translateY(20vh);
    }
    .modalCrearGasto  input{
        width: 100%;
    }
    .backgroundModalCrearGasto {
        transform: translateX(-10vw) translateY(-35vh);
    }
}
</style>