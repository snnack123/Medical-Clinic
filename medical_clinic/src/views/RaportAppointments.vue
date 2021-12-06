<template>
  <div> 
    <br /><br /><br /><br /><br />
    <h1 style="text-align:center">Istoric Programari</h1>
    <br /><br />
    <div class="table-wrapper"  style="width: 100px;">
      <table class="fl-table">
        <thead>
          <tr>
            <th>Sortare</th>
            <th colspan="2">Filtre</th>
            <th colspan="2">Anulare filtre</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Ordoneaza dupa data:</b></td>
            <td><b>Specializare:</b></td>
            <td><b>Cost:</b></td>
            <td><b>Specializare:</b></td>
            <td><b>Cost:</b></td>
          </tr>
          <tr>
            <td><input type="radio" style="text-align: left;" name="order" id="asc" @click="order($event)">Crescator</td>
            <td><input type="radio" name="specialization" id="Alergologie" @click="specialization($event)">Alergologie</td>
            <td><input type="radio" name="cost" id="free" @click="priceInterval($event)">Gratuit</td>
            <td><span style="color:tomato; font-weight: bold;" @click="cancel_spec($event)">{{this.sort_specialization !== '' ? this.sort_specialization : 'Nu exista filtre'}}</span></td>
            <td><span style="color:tomato; font-weight: bold;" @click="cancel_cost($event)">{{this.sort_cost === 'free' ? 'Gratuit' : this.sort_cost === 'max250' ? '0 - 250' : this.sort_cost === 'max300' ? '250 - 300' : 'Nu exista filtre'}}</span></td>
          </tr>
          <tr>
            <td><input type="radio" name="order" id="desc" @click="order($event)">Descrescator</td>
            <td><input type="radio" name="specialization" id="Cardiologie" @click="specialization($event)">Cardiologie</td>
            <td><input type="radio" name="cost" id="max250" @click="priceInterval($event)">0 - 250</td>
            <td rowspan="4"></td>
            <td rowspan="4"></td>
          </tr>
          <tr>
            <td rowspan="3"></td>
            <td><input type="radio" name="specialization"  id="Dermatologie" @click="specialization($event)">Dermatologie</td>
            <td><input type="radio" name="cost"  id="max300" @click="priceInterval($event)">250 - 300</td>
          </tr>
          <tr>
            <td><input type="radio" name="specialization"  id="Reumatologie" @click="specialization($event)">Reumatologie</td>
            <td rowspan="2"></td>
          </tr>
          <tr>
            <td><input type="radio" name="specialization"  id="Pneumologie" @click="specialization($event)">Pneumologie</td>
          </tr>
        </tbody>
      </table>
    </div>
    <button v-if="this.show_reset" type="submit" style="padding: 5px; border-radius: 5px;">Anuleaza filtre</button>
    <div class="table-wrapper">
      <table class="fl-table">
        <thead>
          <tr>
            <th>Nr.</th>
            <th>Data</th>
            <th>Specializare</th>
            <th>Nume Medic</th>
            <th>Trimitere medicala</th>
            <th>Cost programare</th>
          </tr>
        </thead>
        <tbody v-for="(elem, index) in my_appointments" :key=elem>
          <tr v-if="index >= min && index < max">
            <td><b>{{index+1}}.</b></td>
            <td>{{`${elem.date.getDate()}-${elem.date.getMonth()+1}-${elem.date.getFullYear()}`}}</td>
            <td>{{elem.doctorSpecialization}}</td>
            <td>Dr. {{elem.doctorName}}</td>
            <td>{{elem.price !== '0' ? 'Nu' : 'Da'}}</td>
            <td>{{elem.price}} lei</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-wrapper" style="width: 50px;">
      <table class="fl-table">
          <thead>
            <tr>
              <th>Detalii</th>
              <th>First</th>
              <th>Prev</th>
              <th>Next</th>
              <th>Last</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pagina nr. <span><b>{{this.this_page}}</b></span> din <span><b>{{this.pages_number}}</b></span></td>
              <td><fa id="fp" icon="angle-double-left" class='fa_icons' @click="first_page"></fa></td>
              <td><fa id="pp" icon="arrow-left" class='fa_icons' @click="prev_page"></fa></td>
              <td><fa id="np" icon="arrow-right" class='fa_icons' @click="next_page"></fa></td>
              <td><fa id="lp" icon="angle-double-right" class='fa_icons' @click="last_page"></fa></td>
            </tr>
          </tbody>
      </table>
    </div>
    <make-fetch style="visible:none" :get_email ="this.fetch_get_email" :get_appointments ="this.fetch_get_appointments" :raport=1 />
  </div>
</template>

<script>
import MakeFetch from '../components/MakeFetch.vue';

export default {
  name: "MyAppointments",
  data() {
    return {
      my_appointments: [],
      backup_appointments: [],
      this_page_appointments: [],
      fetch_get_email: 0,
      fetch_get_appointments: 0,
      pages_number: 0,
      this_page: 1,
      min: 0,
      max: 20,
      filter_specialization: "",
      filter_cost: "",
      show_reset: 0,
      sort_order: "desc",
      sort_specialization: '',
      sort_cost: '',
      edit: 0,
    }
  },
  components: {
    MakeFetch,
  },
  computed: {
    this_client() {
      return this.$store.state.client;
    },
    all_appointments() {
      return this.$store.state.all_appointments_without_token;
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
  mounted() {
    document.getElementById('fp').style.color = '#ddd';
    document.getElementById('pp').style.color = '#ddd';
  },
  methods: {
    searchData() {
        let appointments_length = this.all_appointments.length;
        for( let i = 0; i < appointments_length; i++ ) {
            let day = parseInt(`${this.all_appointments[i].date.split("-")[0]}`);
            let month = parseInt(`${this.all_appointments[i].date.split("-")[1]}`)
            let year = parseInt(`${this.all_appointments[i].date.split("-")[2]}`)
            let date = new Date(year, month-1, day);
            let appointment = {};
            appointment.id= this.all_appointments[i].id;
            appointment.doctorName = this.all_appointments[i].doctorName;
            appointment.doctorSpecialization =  this.all_appointments[i].doctorSpecialization;
            appointment.pacientName = this.all_appointments[i].pacientName;
            appointment.pacientYearsOld = this.all_appointments[i].pacientYearsOld;
            appointment.hour = this.all_appointments[i].hour;
            appointment.date = date;
            appointment.price = this.all_appointments[i].price;
            this.backup_appointments.push(appointment);
            this.my_appointments.push(appointment);
        }
      this.getSize();
      function compare( a, b ) {
        if ( b.date < a.date ){
          return -1;
        }
        if ( b.date > a.date ){
          return 1;
        }
        return 0;
      }

      this.my_appointments.sort( compare );
    },
    getSize() {
      let total_number = this.my_appointments.length/20;
      let number = 0;
      if(total_number < 1 ) {
        number = 1;
      } else if(total_number > Math.round(total_number)) {
        number = Math.round(total_number) + 1;
      } else if(total_number === Math.round(total_number)) {
        number = Math.round(total_number);
      } else if(total_number < Math.round(total_number)) {
        number = Math.round(total_number)-1;
      }
      this.pages_number = number;
      if(Math.round(number) === 1) {
          document.getElementById('fp').style.color = '#ddd';
          document.getElementById('pp').style.color = '#ddd';
          document.getElementById('np').style.color = '#ddd';
          document.getElementById('lp').style.color = '#ddd';
      }
    },
    first_page() {
      if(this.this_page != 1) {
        setTimeout(() => {
          this.min = -1;
          this.max = 20;
          this.this_page = 1;
          document.getElementById('fp').style.color = '#ddd';
          document.getElementById('pp').style.color = '#ddd';
          document.getElementById('np').style.color = 'black';
          document.getElementById('lp').style.color = 'black';
        }, 1000);
      } else {
        console.log("Esti deja pe prima pagina!");
      }
    },
    prev_page() {
      if(this.this_page > 1) {
        setTimeout(() => {
          this.min -= 20;
          this.max -= 20;
          this.this_page = this.this_page - 1;
          if(this.this_page === 1) {
            document.getElementById('fp').style.color = '#ddd';
            document.getElementById('pp').style.color = '#ddd';
          }
            document.getElementById('np').style.color = 'black';
            document.getElementById('lp').style.color = 'black';
        }, 1000);
      } else {
        console.log('Prima pagina');
      }
    },
    next_page() {
      if(this.my_appointments.length > this.this_page * 20) {
        setTimeout(() => {
          this.min += 20;
          this.max += 20;
          this.this_page = this.this_page + 1;
          if(this.this_page === this.pages_number)
          {
            document.getElementById('np').style.color = '#ddd';
            document.getElementById('lp').style.color = '#ddd';
          }
          else {
            document.getElementById('np').style.color = 'black';
            document.getElementById('lp').style.color = 'black';
          }
          document.getElementById('fp').style.color = 'black';
          document.getElementById('pp').style.color = 'black';
        }, 1000);
      } else {
        console.log('Ultima pagina');
      }
    },
    last_page() {
      if(this.this_page !== this.pages_number) {
        setTimeout(() => {
          let no_of_pages = Math.round(this.my_appointments.length/20);
          this.min = no_of_pages * 20;
          this.max = no_of_pages * 20 + 20;
          this.this_page = this.pages_number;
          document.getElementById('fp').style.color = 'black';
          document.getElementById('pp').style.color = 'black';
          document.getElementById('np').style.color = '#ddd';
          document.getElementById('lp').style.color = '#ddd';
        }, 1000);
      } else {
        console.log('Esti deja pe ultima pagina!');
      }
    },
    order(event) {
      console.log(event.target.id);
      if(event.target.id === 'asc') {
        this.sort_order = "asc";
        this.my_appointments.sort( function compare(a,b) {
          if ( b.date > a.date ){
            return -1;
          }
          if ( b.date < a.date ){
            return 1;
          }
          return 0;

        } );
      } else {
          this.sort_order = "desc";
          this.my_appointments.sort( function compare(a,b) {
          if ( b.date < a.date ){
            return -1;
          }
          if ( b.date > a.date ){
            return 1;
          }
          return 0;

        } );
      }
    },
    orderInSpecialization() {
      if(this.sort_order === 'asc') {
          this.my_appointments.sort( function compare(a,b) {
          if ( b.date > a.date ){
            return -1;
          }
          if ( b.date < a.date ){
            return 1;
          }
          return 0;

        } );
      } else {
        this.sort_order = "desc";
        this.my_appointments.sort( function compare(a,b) {
          if ( b.date < a.date ){
            return -1;
          }
          if ( b.date > a.date ){
            return 1;
          }
          return 0;

        } );
      }
    },
    specialization(event) {
        this.my_appointments = this.backup_appointments;
        this.sort_specialization = event.target.id;
        this.orderInSpecialization();

      if(this.sort_cost !== "") {
          if(this.sort_cost === 'free') {
          this.my_appointments = this.my_appointments.filter(function (item) {
            return item.price === '0';
          });
        } else if(this.sort_cost === 'max250') {
          this.my_appointments = this.my_appointments.filter(function (item) {
            return item.price >= '0' && item.price <= '250';
          });
        } else {
            this.my_appointments = this.my_appointments.filter(function (item) {
            return item.price >= '250' && item.price <= '300';
          });
        }
      }

      if(event.target.id === 'Alergologie') {
        this.my_appointments = this.my_appointments.filter(function (item) {
          return item.doctorSpecialization === 'Alergologie';
        });
      } else if(event.target.id === 'Cardiologie') {
        this.my_appointments = this.my_appointments.filter(function (item) {
          return item.doctorSpecialization === 'Cardiologie';
        });
      } else if(event.target.id === 'Dermatologie') {
        this.my_appointments = this.my_appointments.filter(function (item) {
          return item.doctorSpecialization === 'Dermatologie';
        });
      } else if(event.target.id === 'Reumatologie') {
        this.my_appointments = this.my_appointments.filter(function (item) {
          return item.doctorSpecialization === 'Reumatologie';
        });
      } else if(event.target.id === 'Pneumologie') {
        this.my_appointments = this.my_appointments.filter(function (item) {
          return item.doctorSpecialization === 'Pneumologie';
        });
      }

      this.getSize();
      this.filter_specialization = 1;
    },
    priceInterval(event) {
      this.my_appointments = this.backup_appointments;
      this.sort_cost = event.target.id;
      this.orderInSpecialization();
      let spec = this.sort_specialization;

      if(this.sort_specialization !== "") {
        this.my_appointments = this.my_appointments.filter(function (item) {
          return item.doctorSpecialization === spec;
        });
      }

      if(event.target.id === 'free') {
        this.my_appointments = this.my_appointments.filter(function (item) {
          return item.price === '0';
        });
      } else if(event.target.id === 'max250') {
        this.my_appointments = this.my_appointments.filter(function (item) {
          return item.price >= '0' && item.price <= '250';
        });
      } else {
          this.my_appointments = this.my_appointments.filter(function (item) {
          return item.price >= '250' && item.price <= '300';
        });
      }

      this.getSize();
      this.filter_cost = 1;
    },
    cancel_spec(event) {
      if(event.target.innerHTML !== 'Nu exista filtre') {
        this.my_appointments = this.backup_appointments;
        this.orderInSpecialization();

        if(this.sort_cost !== "") {
          if(this.sort_cost === 'free') {
            this.my_appointments = this.my_appointments.filter(function (item) {
              return item.price === '0';
            });
          } else if(this.sort_cost === 'max250') {
            this.my_appointments = this.my_appointments.filter(function (item) {
              return item.price >= '0' && item.price <= '250';
            });
          } else {
              this.my_appointments = this.my_appointments.filter(function (item) {
              return item.price >= '250' && item.price <= '300';
            });
          }
        }

        this.getSize();
        document.getElementById(this.sort_specialization).checked = false;
        this.sort_specialization = "";

      } else {
        console.log('Nu exista filtre');
      }
    },
    cancel_cost(event) {
      if(event.target.innerHTML !== 'Nu exista filtre') {
        this.my_appointments = this.backup_appointments;
        this.orderInSpecialization();

        if(this.sort_specialization !== "") {
          if(this.sort_specialization === 'Alergologie') {
            this.my_appointments = this.my_appointments.filter(function (item) {
              return item.doctorSpecialization === 'Alergologie';
            });
          } else if(this.sort_specialization === 'Cardiologie') {
            this.my_appointments = this.my_appointments.filter(function (item) {
              return item.doctorSpecialization === 'Cardiologie';
            });
          } else if(this.sort_specialization === 'Dermatologie') {
            this.my_appointments = this.my_appointments.filter(function (item) {
              return item.doctorSpecialization === 'Dermatologie';
            });
          } else if(this.sort_specialization === 'Reumatologie') {
            this.my_appointments = this.my_appointments.filter(function (item) {
              return item.doctorSpecialization === 'Reumatologie';
            });
          } else if(this.sort_specialization === 'Pneumologie') {
            this.my_appointments = this.my_appointments.filter(function (item) {
              return item.doctorSpecialization === 'Pneumologie';
            });
          }
        }

        this.getSize();
        document.getElementById(this.sort_cost).checked = false;
        this.sort_cost = "";

      } else {
        console.log('Nu exista filtre');
      }
    },
  }
}
</script>

<style scoped>

.fa_icons {
  padding: 5px;
  font-size: 30px;
}

.fa_icons:hover {
  border-bottom: 1px solid blue;
}

.appointments_list {
  display: flex;
  margin-bottom: 10px;
}

.cancel_appointment, .delete_appointment {
  padding: 2px;
  border-radius: 5px;
}

.number{
  padding: 5px;
  width: 50px;
  text-align: center;
}

.elements {
  padding: 5px;
  justify-content: center;
  align-items: center;
}

table, th, td, tbody {
  border: 1px solid black;
  border-collapse: collapse;
  text-align: center;
  padding: 5px;
}

.center {
  margin-left: auto;
  margin-right: auto;
}


.table-wrapper{
  border-collapse: collapse;
  margin: 10px 70px 70px;
  box-shadow: 0px 35px 50px rgba( 0, 0, 0, 0.2 );
}

.fl-table {
    border-radius: 5px;
    font-size: 12px;
    font-weight: normal;
    border: 1px solid black;
    border-collapse: collapse;
    width: 100%;
    max-width: 100%;
    white-space: nowrap;
    background-color: white;
}

.fl-table td, .fl-table th {
    text-align: center;
    padding: 8px;
}

.fl-table td {
    border-right: 1px solid black;
    font-size: 15px;
}

.fl-table thead th {
    color: #ffffff;
    background: #4FC3A1;
}


.fl-table thead th:nth-child(odd) {
    color: #ffffff;
    background: #324960;
}

.fl-table tr:nth-child(even) {
    background: #F8F8F8;
}

/* Responsive */

@media (max-width: 767px) {
    .fl-table {
        display: block;
        width: 100%;
    }
    .table-wrapper:before{
        content: "Scroll horizontally >";
        display: block;
        text-align: right;
        font-size: 11px;
        color: white;
        padding: 0 0 10px;
    }
    .fl-table thead, .fl-table tbody, .fl-table thead th {
        display: block;
    }
    .fl-table thead th:last-child{
        border-bottom: none;
    }
    .fl-table thead {
        float: left;
    }
    .fl-table tbody {
        width: auto;
        position: relative;
        overflow-x: auto;
    }
    .fl-table td, .fl-table th {
        padding: 20px .625em .625em .625em;
        height: 60px;
        vertical-align: middle;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: auto;
        width: 120px;
        font-size: 13px;
        text-overflow: ellipsis;
    }
    .fl-table thead th {
        text-align: left;
        border-bottom: 1px solid #f7f7f9;
    }
    .fl-table tbody tr {
        display: table-cell;
    }
    .fl-table tbody tr:nth-child(odd) {
        background: none;
    }
    .fl-table tr:nth-child(even) {
        background: transparent;
    }
    .fl-table tr td:nth-child(odd) {
        background: #F8F8F8;
        border-right: 1px solid #E6E4E4;
    }
    .fl-table tr td:nth-child(even) {
        border-right: 1px solid #E6E4E4;
    }
    .fl-table tbody td {
        display: block;
        text-align: center;
    }
  
}

</style>