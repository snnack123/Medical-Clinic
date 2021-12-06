<template>
  <div class='all'>
    <br /><br /><br /><br /><br /><br />
    <h1>Suntem AS în Sănătate!</h1>
    <br /><br /><br /><br /><br /><br />
    <make-fetch style="visible:none" :get_email =1 :get_appointments =1 />
    <div class='message'>Alături de tine la fiecare pas, de la identificarea afecțiunilor până la diagnostic și tratament. Avem grijă de sănătatea ta fizică și emoțională, într-un cadru intim, în deplină siguranță, prețuind intimitatea și confortul tău.</div>
    <br /><br /><br />
    <div class='why'><div class='square'></div> De ce Clinica AS?</div>
    <br />
    <div class='services'>
      <div><img src='../assets/servicii_1.png' style='padding-right:10px;'/></div>
      <div><img src='../assets/servicii_2.png'/></div>
    </div>
    <br /><br />
    <div class='description'>La Clinica AS tratăm pacienți, nu afecțiuni. Dedicăm timp și atenție pentru fiecare pacient în parte. Timpul este de cele mai multe ori esențial în detectarea și tratarea afecțiunilor, precum și în programele de prevenție, screening de sănătate pe grupe de vârstă și sex, în funcție de moștenirea genetică a fiecărui pacient. Echipa multidisciplinară de medici din cadrul clinicii urmărește un diagnostic precis, sigur și rapid pentru elaborarea schemei de tratament corespunzătoare, în cel mai scurt timp. La Clinica AS tratăm patologii cronice și acute. Nu ne oprim însă aici. Obiectivul nostru este să identificăm și să tratăm atât cauza, cât și efectul afecțiunilor. Știm că starea de sănătate a organismului la interior se reflectă la exterior. Pornind de la această idee, activitatea Clinicii AS este completată cu cea desfășurată în centrele Atelierul de Slăbit, unde redăm frumusețea fizică a corpului tău.</div>
    <br /><br />
    <div v-if="!this.auth">Pentru mai multe detalii poate fi vizualizat raportul care contine toate programarile efectuate pana in prezent aici: <a href="/raport_appointments" >Vizualizare Raport</a></div>
  </div>
</template>

<script>
import MakeFetch from '../components/MakeFetch.vue';

export default {
  name: "Home",
  components: {
    MakeFetch
  },
  data() {
   return{ 
     auth: false,
   }
  },
  computed: {
    this_client() {
      return this.$store.state.client;
    },
    all_appointments() {
      return this.$store.state.all_appointments;
    },
    check_authenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
  created() {
    if(this.check_authenticated) this.auth = 1;
    if(typeof this.this_client.email ==="undefined") {
      console.log('O sa fac rost de datele clientului pentru tine!');
      this.fetch_get_email =1;
    }
    else{
      console.log("Am deja datele clientului, multumesc!");
    }
    if(this.all_appointments.length === 0) {
      console.log('O sa fac rost de toate programarile pentru tine!');
      this.fetch_get_appointments = 1;
    }
    else {
      console.log("Am deja toate programarile, multumesc!");
    }
  }
};
</script>

<style lang='scss' scoped>

.all {
  margin: 0 50px;
}

h1{
  text-align:center; 
  font-size:200%; 
  text-decoration: underline;
}

.services {
  display:flex;
}

.message{
  background-color: lightgreen;
  font-weight: bold;
  letter-spacing: 2px;
  font-size: 120%;
  border-radius: 10px;
  padding: 20px;
  width: 50%;
  color:white;
}

.square {
  width: 20px;
  height: 20px;
  background-color: green;
  border-radius: 2px;
  display: inline-block;
}

.why{
  font-weight: bold;
  font-size: 105%;
}

.description {
  width:50%; 
  line-height: 120%;
  border: 2px solid lightgreen;
  padding: 10px;
  border-radius: 10px;
  box-shadow:10px 10px 5px 0px #C5FCAE;
}

//1200+
@media only screen and (max-width: 1200px) {
  
  h1 {
    font-size: 180%;
  }

  .message {
    font-size: 90%;
  }

  .why {
    font-size: 90%;
  }

  .services {

    img {
      width: 400px;
      padding-bottom: 20px;
    }
  }

  .description {
    font-size: 90%;
    line-height: 25px;
  }
}

  //768 - 1023
  @media only screen and (max-width: 1023px) {
    
    h1{
      font-size: 160%;
    }

    .description, .message, .services, .why {
      font-size: 85%;
      line-height: 25px;
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
    }

    .services {

      img {
        width: 350px;
        padding-bottom: 15px;
      }
    }
  }

  //481 - 767
  @media only screen and (max-width: 767px) {
    .services {
      flex-direction: column;
      justify-content: center;

    }
  }
</style>
