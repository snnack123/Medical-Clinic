<template>
  <div>
    <br /><br />
    <h1>Creeaza o noua programare</h1>
    <br /><br /><br /><br />
    <form>
      <h2>Alegeti o specializare</h2>
      <br /><br />
      <span v-for="elem in this_doctors" :key="elem">
        <input
          type="radio"
          v-bind:id=elem.id
          name="list_of_doctors"
          @click="chooseDoctor(elem)"
        />
        <label for="elem.id" class="doctors_label"
          ><b>{{ elem.specialization }}</b></label
        >
      </span>
    </form>
    <br /><br /><br /><br /><br />
    <form v-show="this.show_calendar">
      <h2 style="text-align: center">
        Alegeti o zi pentru a putea face o programare
      </h2>
      <br /><br />
      <div>
        <div class="appointment">
          <h3>DETALII PACIENT</h3>
          <br />
          <div>
            <label id="clientName">Nume: {{ this.clients.name }}</label>
          </div>
          <div>
            <label>Varsta: {{ this.clients.yearsOld }}</label>
          </div>
          <div>
            <label>Telefon: {{ this.clients.phone }}</label>
          </div>
          <br />
          <h3>OPTIUNI ALESE</h3>
          <br />
          <div>
            <label id="app_spec"
              >Specializare: {{ this.my_doctor.specialization }}</label
            >
          </div>
          <div>
            <label
              >Nume Medic: <span v-if="this.my_doctor.name">Dr.</span>
              {{ this.my_doctor.name }}</label
            >
          </div>
          <div>
            <label id="app_date"
              >Data:
              <span v-if="this.app_day">
                {{ this.app_day }}
              </span></label
            >
          </div>
          <div v-if="this.app_day">
            <span>Trimitere medicala?</span>
            <select id="chooseReferral" v-if="this.app_day" @change="selectReferral($event)">
              <option></option>
              <option v-if="this.app_day" value="yes">Da</option>
              <option v-if="this.app_day" value="no">Nu</option>
            </select>
          </div>
          <br />
          <div v-if="this.referral">Pret: {{this.price}} lei</div>
          <div v-if="this.days_with_app.length < 4" >
            <label v-if="this.app_day">Alege data:</label>
            <select id="selectDate" v-if="this.app_day">
              <option
                v-for="(elem, index) in this.free_hours"
                :key="elem"
                v-bind:value="index"
              >
                {{ elem }}
              </option>
            </select>
          </div>
          <br /><br /><br />
          <button
            type="submit"
            @click.prevent="submitAppointment"
            v-if="this.days_with_app.length < 4"
            v-show="this.submit_button"
            id="submit_appointment"
            
          >
            Creeaza o noua programare
          </button>
          <div v-else style="color: tomato" id="full_day_error">
            Aceasta zi este plina cu programari!. <br />
            Va rugam sa alegeti alta zi disponibila!
          </div>
          <div id="error_message">{{ this.message }}</div>
        </div>
        <calendar
          @spec_appointments_list="setDaysWithSpec"
          @setAppointmentsOnDate="setAppointmentsOnDate"
          :specialization="this.my_doctor.specialization"
        />
        <div class="appointment" v-show="this.show_days_with_app">
          <h3 style="text-align: center" v-if="this.app_day">
            Lista programari din ziua <br />
            {{ this.app_day }}
          </h3>
          <br />
          <div v-for="(elem, index) in days_with_app" :key="elem">
            <div>
              <u>Programarea cu numarul: {{ index + 1 }}</u>
            </div>
            <div>
              Data:
              {{ elem.date }}
            </div>
            <div>Medic: Dr. {{ elem.doctorName }}</div>
            <div>Specializarea: {{ elem.doctorSpecialization }}</div>
            <div>Ora: {{ elem.hour }}</div>
            <br />
          </div>
        </div>
      </div>
    </form>
    <!-- <button type="submit" @click.prevent="testeaza">Click</button> -->
    <make-fetch style="visible:none" :get_email ="this.fetch_get_email" :get_appointments ="this.fetch_get_appointments" />
  </div>
</template>

<script>
import utils from "../utils.js";
import Calendar from "../components/Calendar.vue";
import MakeFetch from '../components/MakeFetch.vue';

export default {
  name: "Appointment",
  data() {
    return {
      this_doctors: [],
      this_client: {},
      my_doctor: {},
      app_day: "",
      message: "",
      all_days_with_app_on_spec: [],
      days_with_app: [],
      show_days_with_app: 0,
      show_calendar: 0,
      submit_button: 0,
      busy_hours: [],
      free_hours: [],
      search_specialization: "",
      referral: 0,
      price: 0,
      fetch_get_email: 0,
      fetch_get_appointments: 0,
      edit_specialization: '',
      edit_my_appointment: {},
    };
  },
  components: {
    Calendar,
    MakeFetch
  },
  computed: {
    clients() {
      return this.$store.state.client;
    },
    doctors() {
      return this.$store.state.doctors;
    },
    appointments() {
      return this.$store.state.all_appointments;
    },
    edit_appointment() {
      return this.$store.state.edit_appointment;
    },
  },
  created() {
    if(typeof this.clients.email ==="undefined") {
      console.log('O sa fac rost de datele clientului pentru tine!');
      this.fetch_get_email =1;
    }
    else{
      console.log("Am deja datele clientului, multumesc!");
    }
    if(this.appointments.length === 0) {
      console.log('O sa fac rost de toate programarile pentru tine!');
      this.fetch_get_appointments = 1;
    }
    else {
      console.log("Am deja toate programarile, multumesc!");
    }
    this.searchDoctors();
    this.getEmailFromStore();
  },
  methods: {
    setDaysWithSpec(spec_appointments) {
      while (this.all_days_with_app_on_spec.length)
        this.all_days_with_app_on_spec.pop();
      for (let i = 0; i < spec_appointments.length; i++) {
        this.all_days_with_app_on_spec.push(spec_appointments[i]);
      }
    },
    setAppointmentsOnDate(new_date) {
      let date = `${new Date(new_date).getDate()}-${
        new Date(new_date).getMonth() + 1
      }-${new Date(new_date).getFullYear()}`;
      while (this.days_with_app.length) this.days_with_app.pop();
      for (let i = 0; i < this.all_days_with_app_on_spec.length; i++) {
        if (this.all_days_with_app_on_spec[i].date === date) {
          this.days_with_app.push(this.all_days_with_app_on_spec[i]);
          this.busy_hours.push(this.all_days_with_app_on_spec[i].hour);
        }
      }
      if( new Date(new_date).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)){
        this.app_day = date;
        this.submit_button = 1;
        this.show_days_with_app = 1;
        this.setFreeHours();
        this.message = "";
      } else {
        this.message = "Nu se pot face programari in trecut!";
        document.getElementById('error_message').style.color = "tomato";
        document.getElementById('error_message').style.fontWeight = "bold";
        this.app_day = ""
        while(this.days_with_app.length) this.days_with_app.pop();
        this.submit_button = 0;
        this.price = 0;
      }
    },
    searchDoctors() {
      let url = utils.url;
      let requestParam = { ...utils.globalRequestParameters };
      requestParam.method = "GET";
      requestParam.body = null;
      fetch(url + "doctors", requestParam).then((res) =>
        res.json().then((res) => {
          for (let i = 0; i < res.length; i++) {
            this.this_doctors.push(res[i]);
            this.$store.dispatch("setDoctors", res[i]);
          }
        })
      );
    },
    getEmailFromStore() {
      this.this_client.email = this.clients.email;
      this.this_client.name = this.clients.name;
      this.this_client.phone = this.clients.phone;
      this.this_client.yearsOld = this.clients.yearsOld;
    },
    chooseDoctor(elem) {
      this.my_doctor = elem;
      this.$store.dispatch("setMyDoctor", elem);
      this.show_calendar = 1;
      this.search_specialization = elem.specialization;
      this.app_day = "";
      this.price = 0;
      this.referral = 0;

      while(this.days_with_app.length) 
        this.days_with_app.pop();
      this.submit_button = 0;
    },
    setFreeHours() {
      while (this.free_hours.length) {
        this.free_hours.pop();
      }
      let hours = ["10:00", "11:00", "12:00", "13:00"];

      hours = hours.filter((val) => !this.busy_hours.includes(val));
      for (let i = 0; i < hours.length; i++) {
        this.free_hours.push(hours[i]);
      }
    },
    submitAppointment() {
      if( document.getElementById('chooseReferral').value.length < 1) {
        this.message = "Trebuie sa selectati daca aveti trimitere medicala!";
        document.getElementById("error_message").style.color = "tomato";
        document.getElementById("error_message").style.fontWeight = "bold";
      } else {
        this.message = "";
      }
      if(this.message === "") {

        let data = {};
        data.date = this.app_day;
        data.doctorName = this.my_doctor.name;
        data.doctorSpecialization = this.my_doctor.specialization;
        data.pacientName = this.this_client.name;
        data.pacientYearsOld = this.this_client.yearsOld;
        data.hour = this.free_hours[parseInt(document.getElementById("selectDate").value)];
        data.price = this.price.toString();

        let requestParameters = { ...utils.globalRequestParameters };
        let token = window.localStorage.getItem("token");
        requestParameters.headers.Authorization = "Bearer " + token;
        requestParameters.method = "POST";
        requestParameters.body = JSON.stringify(data);

        fetch(utils.url + "new_appointment", requestParameters)
          .then((res) => res.json())
          .then((res) => {
            if (
              res.message === "Decoding error!" ||
              res.message === "Your token expired!"
            ) {
              console.log("Probleme cu token-ul la adaugare!");
            } else {
              console.log("Am adaugat produsul cu id-ul: " + res.id);
              //document.getElementById('full_day_error').style.visibility='hidden' 
              this.message = "Ai creat o noua programare cu succes!";
              // document.getElementById('submit_appointment').style.visibility = 'hidden';
              document.getElementById('error_message').style.color = "green";
              document.getElementById('error_message').style.fontWeight = "bold";
              let new_app = {};
              new_app.date = data.date;
              new_app.doctorName = data.doctorName;
              new_app.doctorSpecialization = data.doctorSpecialization;
              new_app.id = res.id;
              new_app.hour = data.hour;
              this.days_with_app.push(new_app);
               this.$store.dispatch("addAppointment", new_app);

              while (this.free_hours.length) 
                this.free_hours.pop();
            }
          });
      }
    },
    clear() {
      while (this.days_with_app.length > 0) this.days_with_app.pop();
    },
    selectReferral(event) {
      this.message = "";
      if( event.target.value.length > 0){
        this.referral = 1;
        if( event.target.value === 'yes') {
          this.price = 0;
        } else {
          if(this.my_doctor.specialization === "Alergologie"){
            this.price = 300;
          } else if (this.my_doctor.specialization === "Cardiologie"){
            this.price = 250;
          }  else {
            this.price = 200;
          }
        }
      }
    },
  },
};
</script>

<style>

* {
  font-size: 105%;
}

.doctors_label {
  padding-right: 30px;
  font-size: 90%;
}

.appointment {
  width: 25%;
  float: left;
  display: inline;
}

</style>
