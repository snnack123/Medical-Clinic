<template>
  <div>
      <br /><br />
      <h1 style='text-align:center; font-size:200%; text-decoration: underline;'>DATE UTILIZATOR</h1>
      <br /><br /><br /><br />
      <form>
          <h2 style='text-decoration: underline;'>INFORMATII GENERALE</h2>
          <br />
          <div><b>Nume:</b> {{this.my_client.name}}</div>
          <div><b>Varsta:</b> <input type='text' id='yearsOld' :value=this.yearsOld disabled/></div>
          <div><b>Numar de telefon:</b> <input type='text' id='phoneNumber' :value=this.phone disabled /></div>
          <div><b>Adresa email:</b> {{this.my_client.email}}</div>
          <br />
          <button type='submit' @click.prevent="editData()" id='editData' style='padding: 5px;'>Editeaza datele personale</button>
          <button type='submit' @click.prevent="cancelEdit()" id='cancelEdit' v-if='this.edit' style='color:tomato; border: 1px solid; margin-left:10px; padding: 5px;'>Anuleaza</button>
          <div>{{this.message}}</div>
      </form>
      <br /><br /><br />
      <div>
          <h2 style='text-decoration: underline;'>SCURT ISTORIC</h2>
          <br />
          <div><b>Numar total programari inregistrate:</b> {{this.my_appointments.length}}</div>
          <br />
          <div><b>Dintre care:</b> </div>
          <br />
          <div><b> - Programari finalizate:</b> {{this.finished_app}}</div>
          <div><b> - Programari nefinalizate:</b> {{this.unfinished_app}}</div>
      </div>
      <br /><br /><br /><br />
      <div>Pentru mai multe detalii puteti vedea aici tot istoricul programarilor dumnevoastra: <a href='/my_appointments'>Vizualizare istoric</a></div>
      <make-fetch style="visible:none" :get_email ="this.fetch_get_email" :get_appointments ="this.fetch_get_appointments" />
  </div>
</template>

<script>
import MakeFetch from '../components/MakeFetch.vue';
import utils from '../utils';
export default {
    name: 'ChangeUserData',
    components: {
        MakeFetch,
    },
    data() {
        return {
            fetch_get_appointments: 0,
            fetch_get_email: 0,
            my_appointments: [],
            my_client: {},
            finished_app: 0,
            unfinished_app: 0,
            edit: 0,
            message: '',
            yearsOld: '',
            phone: '',
        }
    },
    computed: {
        this_client() {
            return this.$store.state.client;
        },
        all_appointments() {
            return this.$store.state.all_appointments;
        },
    },
    created() {
        if(typeof this.this_client.email ==="undefined") {
            console.log('O sa fac rost de datele clientului pentru tine!');
            this.fetch_get_email =1;
        }
        else{
            console.log("Am deja datele clientului, multumesc!");
        }
        console.log('O sa fac rost de toate programarile pentru tine!');
        this.fetch_get_appointments = 1;
        setTimeout(() => {this.searchData()}, 1000);
    },
    methods: {
        searchData() {
            let appointments_length = this.all_appointments.length;
            for( let i = 0; i < appointments_length; i++ ) {
                if (this.all_appointments[i].pacientName === this.this_client.name) {
                    let day = parseInt(`${this.all_appointments[i].date.split("-")[0]}`);
                    let month = parseInt(`${this.all_appointments[i].date.split("-")[1]}`)
                    let year = parseInt(`${this.all_appointments[i].date.split("-")[2]}`)
                    let date = new Date(year, month-1, day);
                    if ( date.setHours(0,0,0,0) >= new Date().setHours(0,0,0,0) ) {
                        this.unfinished_app += 1;
                    } else {
                        this.finished_app += 1;
                    }
                    let appointment = {};
                    appointment.id= this.all_appointments[i].id;
                    appointment.doctorName = this.all_appointments[i].doctorName;
                    appointment.doctorSpecialization =  this.all_appointments[i].doctorSpecialization;
                    appointment.pacientName = this.all_appointments[i].pacientName;
                    appointment.pacientYearsOld = this.all_appointments[i].pacientYearsOld;
                    appointment.hour = this.all_appointments[i].hour;
                    appointment.date = date;
                    appointment.price = this.all_appointments[i].price;
                    this.my_appointments.push(appointment);
                }
            }
            this.my_client.id = this.this_client.id;
            this.my_client.name = this.this_client.name;
            this.my_client.yearsOld = this.this_client.yearsOld;
            this.my_client.email = this.this_client.email;
            this.my_client.phone = this.this_client.phone;

            this.yearsOld = this.this_client.yearsOld;
            this.phone = this.this_client.phone;
        },
        editData() {
            this.message = "";
            if(document.getElementById('editData').innerHTML === 'Editeaza datele personale') {
                this.edit = 1;
                document.getElementById('yearsOld').disabled = false;
                document.getElementById('yearsOld').style.border = '1px solid black';
                document.getElementById('phoneNumber').disabled = false;
                document.getElementById('phoneNumber').style.border = '1px solid black';
                document.getElementById('editData').innerHTML = 'Salveaza';
                document.getElementById('editData').style.color = 'green';
                document.getElementById('editData').style.border = '1px solid green';
            } else {
                this.edit = 0;
                document.getElementById('yearsOld').disabled = true;
                document.getElementById('yearsOld').style.border = '0';
                document.getElementById('phoneNumber').disabled = true;
                document.getElementById('phoneNumber').style.border = '0';
                document.getElementById('editData').innerHTML = 'Editeaza datele personale';
                document.getElementById('editData').style.color = 'black';
                document.getElementById('editData').style.border = '1px solid black';
                let nr = 0;
                if(this.my_client.yearsOld === document.getElementById('yearsOld').value) { nr = nr +1;}
                if(this.my_client.phone === document.getElementById('phoneNumber').value) { nr = nr +1;}
                if( nr === 2) {
                    console.log('Datele nu au fost modificate!');
                    this.message = 'Datele nu au fost modificate deoarece contin aceleasi valori!';
                } else {
                    let url = utils.url;
                    let requestParameters = utils.globalRequestParameters;
                    let token = window.localStorage.getItem('token');
                    requestParameters.headers.Authorization = 'Bearer ' + token;
                    requestParameters.method = 'PUT';

                    let data = {};
                    data.id = this.my_client.id;
                    data.name = this.my_client.name;
                    data.email = this.my_client.email;
                    data.phone = document.getElementById('phoneNumber').value;
                    data.yearsOld = document.getElementById('yearsOld').value;

                    requestParameters.body = JSON.stringify(data);

                    console.log("Vreau sa editez programarea: " + data.id);

                    fetch(url + 'edit_client/' + data.id, requestParameters)
                    .then( res => res.json())
                    .then( res => {
                        if (res.message === 'Decoding error!' || res.message === "Your token expired!")
                        console.log('Probleme cu token-ul la editare!');
                        else {
                        console.log(res.message);
                        this.message = 'S-a modificat cu succes!';
                        this.my_client.phone = document.getElementById('phoneNumber').value;
                        this.my_client.yearsOld = document.getElementById('yearsOld').value;
                        this.yearsOld = data.yearsOld;
                        this.phone = data.phone;
                        this.$store.dispatch("editClient", data);
                        }
                    })
                }
            }
        },
        cancelEdit() {
            this.edit = 0;
            document.getElementById('yearsOld').disabled = true;
            document.getElementById('yearsOld').style.border = '0';
            document.getElementById('phoneNumber').disabled = true;
            document.getElementById('phoneNumber').style.border = '0';
            document.getElementById('editData').innerHTML = 'Editeaza datele personale';
            document.getElementById('editData').style.color = 'black';
            document.getElementById('editData').style.border = '1px solid black';
            this.message = 'S-a anulat modificarea!';
        }
    },
}
</script>

<style>

#yearsOld, #phoneNumber {
    border: 0;
}

</style>