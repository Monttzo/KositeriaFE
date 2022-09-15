<template>
    <section class="PerfilInnerPage">
        <section class="containerPerfilForm">
            <section class="title">
                <span>Totales</span>
            </section>
            <form class="formCajas" v-on:submit.prevent="loadTotales">
                <input type="date" class="filterDate" v-model="filter.date" required/>
                <input type="radio" id='radio' value="week" v-model="filter.weekormonth"/>
                <label for="Semana">Semana</label>
                <input type="radio"  id='radio' value="month" v-model="filter.weekormonth"/>
                <label for="Mes">Mes</label>
                <button type="submit" class="submitButtonTotales">Buscar</button>
            </form>
            <section class="InnerContainerCajas">
                <section class="containerTableAndGraphs" id="containerTableAndGraphs">
                    <canvas id="myChart" width="600" height="600"></canvas>
                </section>
                <section class="containerTableAndGraphs" id="containerTableAndGraphs">
                    <section class="conSinContainer">
                        <section class="radioContainer">
                            <input type="radio" id='radio' value="con" v-model="ConSin" v-on:click="loadValoresGrafica('con')"/><label for="con">Total con Gastos</label>
                        </section>
                        <section class="radioContainer">
                            <input type="radio"  id='radio' value="sin" v-model="ConSin" v-on:click="loadValoresGrafica('sin')"/><label for="sin">Total sin Gastos</label>
                        </section>
                    </section>
                    <section class="conSinContainer">
                        <section class="titleVentas">Totales Ventas</section>
                        <section class="valoresVentas">
                            Papeleria: ${{Number(this.totales.papeleria).toLocaleString()}}
                            <br>
                            Dulces: ${{Number(this.totales.dulces).toLocaleString()}}
                            <br>
                            CIR: ${{Number(this.totales.cir).toLocaleString()}}
                            <br>
                            Total: ${{Number(this.totales.totalSold).toLocaleString()}}
                        </section>
                        <section class="titleGastos">Totales Gastos</section>
                        <section class="valoresGastos">
                            Inventario: ${{Number(this.totales.inventario).toLocaleString()}}
                            <br>
                            Plataforma: ${{Number(this.totales.plataforma).toLocaleString()}}
                            <br>
                            Dulces y Aceo: ${{Number(this.totales.Gdulces).toLocaleString()}}
                            <br>
                            Varios: ${{Number(this.totales.varios).toLocaleString()}}
                            <br>
                            Total: ${{Number(this.totales.totalGastos).toLocaleString()}}
                        </section>
                        <section class="titleTotales">Totales</section>
                        <section class="valoresTotales">
                            Total Vendido: ${{Number(this.totales.totalSold).toLocaleString()}}
                            <br>
                            Total Gastos: ${{Number(this.totales.totalGastos).toLocaleString()}}
                            <br>
                            Total Papeleria con Gastos: ${{this.filter.weekormonth === 'week'? Number(this.totales.papeleriaWithoutgastos).toLocaleString():Number(this.totales.papeleriaWithgastos).toLocaleString()}}
                            <br>
                            Total Dulces con Gastos: ${{this.filter.weekormonth === 'week'? Number(this.totales.dulcesWithoutgastos).toLocaleString():Number(this.totales.dulcesWithgastos).toLocaleString()}}
                            <br>
                            Total CIR con Gastos: ${{this.filter.weekormonth === 'week'? Number(this.totales.cirWithoutgastos).toLocaleString():Number(this.totales.cirWithgastos).toLocaleString()}}
                            <br>
                            Total Vendido con Gastos: ${{this.filter.weekormonth === 'week'? Number(this.totales.totalWithoutGastos).toLocaleString():Number(this.totales.totalSoldWithGastos).toLocaleString()}}
                            <br>
                            Rango de Fechas: {{this.totales.initialDate}} - {{this.totales.finalDate}}
                        </section>
                        <section class="titleTotales">Totales Mensuales</section>
                        <section class="valoresTotales">
                            Total Deudas: ${{Number(this.totales.totalDeudas).toLocaleString()}}
                            <br>
                            Total vendido con mes anterior: ${{Number(this.totales.totalSoldWithPreviousMonth).toLocaleString()}}
                            <br>
                            Total Mes con Deudas: ${{Number(this.totales.totalMonthWithDeudas).toLocaleString()}}
                        </section>
                    </section>
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
                valores: [],
                ConSin: "con",
                valorTotal: 0,
                totales: [],
                blanco: '#fafafa',
                gris: '#e3e3e3',
                veige: 'rgb(245,238,230)',
                piel: 'rgb(243,215,202)',
                rosaClaro: '#e6a4b4',
                rosaFuerte: '#c86b85',
                colorDeudas: localStorage.getItem('appMode') === 'true' || !localStorage.getItem('appMode') ?"#c86b85":'#4e2161',
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
            loadTotales:async function(){
                if (localStorage.getItem("token_access") === null || localStorage.getItem("token_refresh") === null){
                    this.$emit('LogOut');
                    return;
                }
                var date = this.filter.date
                var weekormonth = this.filter.weekormonth
                var urlDeudas = "";
                var urlTotales = "";

                if(weekormonth === 'week' && date){
                    urlTotales = `https://kositeria-be.herokuapp.com/detailTotalWeek/${date}/`
                } else {
                    if(weekormonth === 'month' && date){
                        urlTotales = `https://kositeria-be.herokuapp.com/detailTotalMonth/${date}/`    
                    } else {
                        var today = moment().format('YYYY-MM-DD');
                        urlTotales = `https://kositeria-be.herokuapp.com/detailTotalMonth/${today}/`
                    }
                }

                axios.get(urlTotales, {headers: {}})
                    .then(async (result) => {
                        this.totales = result.data;
                        var Data = result.data;

                        if(weekormonth === 'week'){
                            this.valores = [Data.papeleriaWithoutgastos,Data.dulcesWithoutgastos,Data.cirWithoutgastos];
                        }else {
                            this.valores = [Data.papeleriaWithgastos,Data.dulcesWithgastos,Data.cirWithgastos];
                        }
                        this.ConSin = "con"
                        this.tipos = ['Papeleria','Dulces','CIR']
                        
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
                            type: 'pie',
                            data: {
                                labels: this.tipos,
                                datasets: [{
                                    label: 'Tipos por Total vendido '+this.ConSin+' gastos',
                                    data: this.valores,
                                    backgroundColor: [
                                        'rgba(200, 107, 133, 1)',
                                        'rgba(230, 164, 180, 1)',
                                        'rgba(243, 215, 202, 1)',
                                    ],
                                    borderColor: [
                                        'rgba(200, 107, 133, 1)',
                                        'rgba(230, 164, 180, 1)',
                                        'rgba(243, 215, 202, 1)',
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
            },
            loadValoresGrafica: function(consin){
                var ConSin = consin;
                var weekormonth = this.filter.weekormonth;
                this.valores = []
                if(ConSin === 'con' && weekormonth === 'week'){
                    this.valores = [this.totales.papeleriaWithoutgastos,this.totales.dulcesWithoutgastos,this.totales.cirWithoutgastos]
                } else {
                    if(ConSin === 'sin' && weekormonth === "week"){
                        this.valores = [this.totales.papeleria,this.totales.dulces,this.totales.cir]
                    } else {
                        if(ConSin === 'con' && weekormonth === "month"){
                            this.valores = [this.totales.papeleriaWithgastos,this.totales.dulcesWithgastos,this.totales.cirWithgastos]
                        } else {
                            if(ConSin === "sin" && weekormonth === "month"){
                                this.valores = [this.totales.papeleria,this.totales.dulces,this.totales.cir]
                            }
                        }
                    }
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
                    type: 'pie',
                    data: {
                        labels: this.tipos,
                        datasets: [{
                            label: 'Tipos por Total vendido '+this.ConSin+' gastos',
                            data: this.valores,
                            backgroundColor: [
                                'rgba(200, 107, 133, 1)',
                                'rgba(230, 164, 180, 1)',
                                'rgba(243, 215, 202, 1)',
                            ],
                            borderColor: [
                                'rgba(200, 107, 133, 1)',
                                'rgba(230, 164, 180, 1)',
                                'rgba(243, 215, 202, 1)',
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
            }
        },
        created: function(){
            var today = moment().format('YYYY-MM-DD');
            this.filter.date = today
            this.loadTotales();
        }
    }
</script>

<style>
    .titleTotales {
        font-size: 3vw;
        text-align: center;
        color: v-bind(colorDeudas);
    }
    .valoresTotales {
        width: 100%;
        text-align: left;
        color: v-bind(colorDeudas);
    }
    .valoresVentas {
        width: 100%;
        text-align: left;
        color: v-bind(colorVentas);
    }
    .valoresGastos {
        width: 100%;
        text-align: left;
        color: v-bind(colorGastos);
    }
    .titleVentas {
        font-size: 3vw;
        text-align: center;
        color: v-bind(colorVentas);
    }
    .titleGastos {
        font-size: 3vw;
        text-align: center;
        color: v-bind(colorGastos);
    }
    .conSinContainer {
        padding: 5% 0px;
        width: 20vw;
        justify-content: center;
    }
    .radioContainer {
        display: block;
    }
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
    #radio {
        margin: 0px;
        width: 5vh;
        height: 2vh;
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
    .InnerContainerCajas {
        justify-content: flex-start;
    }
    .submitButtonTotales {
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
    .submitButtonTotales:hover {
        color: v-bind(colorSecundario2);
        background-color: v-bind(colorPrincipal2);
    }
/*Responsive */
@media screen and (min-width: 1366px) and (max-width: 1920px) and (min-height:640px) and (max-height:1080px) {
    
}
@media screen and (min-height: 640px) and (max-height: 3600px) and (min-width: 360px) and (max-width: 1080px) {
    .conSinContainer {
        padding: 5% 0px;
        width: 90vw;
        justify-content: center;
    } 
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
}
</style>