<template>
  <div class="myCalendar">
    <head>
      <link rel="stylesheet" href="style.css" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </head>

    <div class="container">
      <div class="calendar">
        <div class="month">
          <i class="fas fa-angle-left prev" v-on:click="prev"></i>
          <div class="date">
            <h1>{{ thisMounth }}</h1>
            <p>{{ thisDay }}</p>
          </div>
          <i class="fas fa-angle-right next" v-on:click="next"></i>
        </div>
        <div class="weekdays">
          <div>Dum</div>
          <div>Lun</div>
          <div>Mar</div>
          <div>Mie</div>
          <div>Joi</div>
          <div>Vin</div>
          <div>Sam</div>
        </div>
        <div class="days" id="days">
          <div
            @click="show1(elem)"
            v-for="elem in prev_days"
            :key="elem"
            :id="elem"
            class="prev-date"
          >
            {{ elem.split("_")[1] }}
          </div>
          <div
            @click="show2(elem)"
            v-for="elem in current_days"
            :key="elem"
            v-bind:id="elem"
            v-bind:class="
              elem === this.not_change_date.getDate() &&
              this.not_change_date.getMonth() === this.current_date.getMonth()
                ? 'today'
                : ''
            "
          >
            {{ elem }}
          </div>
          <div
            @click="show3(elem)"
            v-for="elem in next_days"
            :key="elem"
            v-bind:id="elem"
            class="next-date"
          >
            {{ elem.split("_")[1] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Calendar",
  data() {
    return {
      thisMounth: "",
      thisDay: "",
      current_date: "",
      prev_days: [],
      current_days: [],
      next_days: [],
      not_change_date: "",

    };
  },
  props: {
    specialization: String,
  },
  computed: {
    appointments() {
      return this.$store.state.all_appointments;
    },
  },
  created() {
    this.not_change_date = new Date();
    this.current_date = new Date();
    this.generateCalendar();
  },
  updated() {
      if(this.specialization){
      let spec_appointments = [];
      for (let i = 0; i < this.appointments.length; i++) {
        if (this.appointments[i].doctorSpecialization === this.specialization)
          spec_appointments.push(this.appointments[i]);
      }
      let divs_with_date_length = parseInt(document.getElementById("days").getElementsByTagName("div").length);

      for (let j = 0; j < divs_with_date_length; j++) {
        let suma = 0;
        for (let k = 0; k < spec_appointments.length; k++) {
          let div_id = document.getElementById("days").getElementsByTagName("div")[j].id;
          if (isNaN(parseInt(div_id)) === false) {
            let date = `${div_id}-${this.current_date.getMonth() + 1}-${this.current_date.getFullYear()}`;
            if (spec_appointments[k].date === date) {
              suma++;
            }
          } else if (div_id.split("_")[0] === "prev") {
            let date = `${div_id.split("_")[1]}-${this.current_date.getMonth()}-${this.current_date.getFullYear()}`;
            if (spec_appointments[k].date === date) {
              suma++;
            }
          } else if (div_id.split("_")[1] === "next") {
            let date = `${div_id.split("_")[1]}-${this.current_date.getMonth() + 2}-${this.current_date.getFullYear()}`;
            if (spec_appointments[k].date === date) {
              suma++;
            }
          }
        }
        let my_div = document.getElementById("days").getElementsByTagName("div")[j];
        if(my_div.classList.contains('canBeAdded')) {
            my_div.classList.remove('canBeAdded')
          }
          if(my_div.classList.contains('oneMore')) {
            my_div.classList.remove('oneMore')
          }
          if(my_div.classList.contains('fullDay')) {
            my_div.classList.remove('fullDay')
          }
        if (suma < 3) {
          my_div.classList.add("canBeAdded");
        } else if (suma == 3) {
          my_div.classList.add("oneMore");
        } else if (suma >= 4) {
          my_div.classList.add("fullDay");
        }
      }
      this.$emit("spec_appointments_list", spec_appointments.sort((a,b) => (a.hour > b.hour) ? 1 : ((b.hour > a.hour) ? -1 : 0)));
    }
  },
  methods: {
    generateCalendar() {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      this.thisMounth = months[this.current_date.getMonth()];
      this.thisDay = this.current_date.toDateString();
    },
    clear() {
      while (this.prev_days.length) this.prev_days.pop();
      while (this.current_days.length) this.current_days.pop();
      while (this.next_days.length) this.next_days.pop();
    },
    next() {
      this.clear();
      this.current_date.setMonth(this.current_date.getMonth() + 1);
      this.generateCalendar();
      this.new_Days();
    },
    prev() {
      this.clear();
      this.current_date.setMonth(this.current_date.getMonth() - 1);
      this.generateCalendar();
      this.new_Days();
    },
    new_Days() {

      const date = new Date(this.current_date);
      date.setDate(1);

      // lastDay = ultima zi din luna curenta
      const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();

      //prevLastDay = ultima zi din luna trecuta
      const prevLastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        0
      ).getDate();

      // Sunday - Saturday : 0 - 6; index-ul zilei curente
      const firstDayIndex = date.getDay();

      //indexul ultimei zile din luna curenta
      const lastDayIndex = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDay();

      //cate zile au mai ramas din saptamana
      const nextDays = 7 - lastDayIndex - 1;

      for (let x = firstDayIndex; x > 0; x--) {
        this.prev_days.push("prev_" + (prevLastDay - x + 1));
      }

      for (let i = 1; i <= lastDay; i++) {
        if (
          i === new Date().getDate() &&
          date.getMonth() === new Date().getMonth()
        ) {
          this.current_days.push(i);
        } else {
          this.current_days.push(i);
        }
      }

      for (let j = 1; j <= nextDays; j++) {
        this.next_days.push("next_" + j);
      }
    },
    show1(x) {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let searched_mounth = 0;
      for (let i = 0; i < months.length; i++) {
        if (months[i] === this.thisMounth) searched_mounth = i;
      }
      let new_date = new Date(
        this.current_date.getFullYear(),
        searched_mounth - 1,
        x.split("_")[1]
      );
      this.$emit("setAppointmentsOnDate", new_date);
    },
    show2(x) {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let searched_mounth = 0;
      for (let i = 0; i < months.length; i++) {
        if (months[i] === this.thisMounth) searched_mounth = i;
      }
      let new_date = new Date(
        this.current_date.getFullYear(),
        searched_mounth,
        x
      );
      this.$emit("setAppointmentsOnDate", new_date);
    },
    show3(x) {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let searched_mounth = 0;
      for (let i = 0; i < months.length; i++) {
        if (months[i] === this.thisMounth) searched_mounth = i;
      }
      let new_date = new Date(
        this.current_date.getFullYear(),
        searched_mounth + 1,
        x.split("_")[1]
      );
      this.$emit("setAppointmentsOnDate", new_date);
    },
  },
  mounted() {
    const date = new Date();
    date.setDate(1);

    // lastDay = ultima zi din luna curenta
    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    //prevLastDay = ultima zi din luna trecuta
    const prevLastDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      0
    ).getDate();

    // Sunday - Saturday : 0 - 6; index-ul zilei curente
    const firstDayIndex = date.getDay();

    //indexul ultimei zile din luna curenta
    const lastDayIndex = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDay();

    //cate zile au mai ramas din saptamana
    const nextDays = 7 - lastDayIndex - 1;

    for (let x = firstDayIndex; x > 0; x--) {
      this.prev_days.push("prev_" + (prevLastDay - x + 1));
    }

    for (let i = 1; i <= lastDay; i++) {
      if (
        i === new Date().getDate() &&
        date.getMonth() === new Date().getMonth()
      ) {
        this.current_days.push(i);
      } else {
        this.current_days.push(i);
      }
    }

    for (let j = 1; j <= nextDays; j++) {
      this.next_days.push("next_" + j);
    }
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Quicksand", sans-serif;
}

.container {
  color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar {
  width: 45rem;
  height: 52rem;
  background-color: #222227;
  box-shadow: 0 0.5rem 3rem rgba(0, 0, 0, 0.4);
}

.month {
  width: 100%;
  height: 12rem;
  background-color: #167e56;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  text-align: center;
  text-shadow: 0 0.3rem 0.5rem rgba(0, 0, 0, 0.5);
}

.month i {
  font-size: 2.5rem;
  cursor: pointer;
}

.month h1 {
  font-size: 3rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  margin-bottom: 1rem;
}

.month p {
  font-size: 1.6rem;
}

.weekdays {
  width: 100%;
  height: 5rem;
  padding: 0 0.4rem;
  display: flex;
  align-items: center;
}

.weekdays div {
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.1rem;
  width: calc(44.2rem / 7);
  display: flex;
  justify-content: center;
  align-items: center;
  text-shadow: 0 0.3rem 0.5rem rgba(0, 0, 0, 0.5);
}

.days {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 0.2rem;
}

.days div {
  font-size: 1.4rem;
  margin: 0.3rem;
  width: calc(40.2rem / 7);
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-shadow: 0 0.3rem 0.5rem rgba(0, 0, 0, 0.5);
  transition: background-color 0.2s;
}

.days div:hover:not(.today) {
  /* background-color: #262626; */
  border: 0.2rem solid #777;
  cursor: pointer;
}

.prev-date,
.next-date {
  opacity: 0.5;
}

.today {
  background-color: #167e56;
}

.fullDay {
  background-color: red;
}

.oneMore {
  background-color: yellow;
}

.canBeAdded {
  background-color: yellowgreen;
}

.myCalendar {
  width: 50%;
  float: left;
  display: inline;
}
</style>
