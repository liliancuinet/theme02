<template>
  <div class="graphUser">
    <Nav />
    <div class="statistics">
      <h1>Semaine du {{ testo }}</h1>
      <modelUserGraph1
        v-if="loaded"
        v-bind:userName="userName"
        v-bind:datasUser="datasUser"
        v-bind:average="average"
      />
    </div>
  </div>
</template>

<script>
import Nav from "./Nav.vue";
import modelUserGraph1 from "./modelUserGraph1.vue";

export default {
  name: "LineChartContainer",
  props: {},
  components: { modelUserGraph1, Nav },

  data() {
    return {
      loaded: false,
      userName: null,
      datasUser: null,
      average: null,
      testo:
        String(new Date().getDate()) +
        " " +
        String(new Date().toLocaleString("fr-FR", { month: "long" })),
    };
  },
  async mounted() {
    this.loaded = false;
    try {
      var curr = new Date();
      var curr2 = new Date(); // get current date
      var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
      var last = curr.getDate() - curr.getDay() + 7; // last day is the first day + 6
      this.date = new Array(7);

      for (let i = 1; i < 8; i++) {
        var curr3 = new Date();
        var jour = curr.getDate() - curr.getDay() + i;
        var thedate = new Date(curr3.setDate(jour));
        this.date[i - 1] = thedate.getDate();
      }

      var firstday =
        new Date(curr.setDate(first)).toISOString().split("T")[0] + " 00:00:00";
      var lastday =
        new Date(curr2.setDate(last)).toISOString().split("T")[0] + " 23:59:59";

      var myInit = {
        method: "GET",
        headers: {'Authorization': localStorage.token},
        mode: "cors",
        cache: "default",
      };

      const retrievingData = await fetch(
        `http://127.0.0.1:4000/api/workingtimes/${this.$route.params.userId}?start=${firstday}&end=${lastday}`,
        myInit
      ).then((res) => {
        return res.json();
      });

      // Attention, il faut bien MAJ le code pour que ce soit la semaine en cours qui s'affiche

      const bilanSemaine = [];
      const currentDay = new Date();
      const currentWeek = [currentDay.getDate() - currentDay.getDay() + 1];

      for (let i = 0; i < 6; i++) {
        currentWeek[i + 1] = currentWeek[i] + 1;
      }

      retrievingData.data.forEach((day) => {
        const dayStart = new Date(day.start);
        const dayEnd = new Date(day.end);

        const checkDay = currentWeek.find((day) => day === dayStart.getDate()); // Permet de checker si le jour du badgeage correspond à un jour de la semaine actuelle

        // Si le check est OK, on calcule la différence entre le start / end pour obtenir le nb d'heures travaillé, et on le place dans un tableau correspondant à son jour dans la semaine

        if (checkDay) {
          bilanSemaine[currentWeek.indexOf(checkDay)] = new Date(
            dayEnd.getTime() - dayStart.getTime()
          ).getHours();
        }
      });

      for (let i = 0; i < 7; i++) {
        if (!bilanSemaine[i]) {
          bilanSemaine[i] = 0;
        }
      }

      const dataUserId = await fetch(
        "http://127.0.0.1:4000/api/users/" + this.$route.params.userId,
        myInit
      ).then((res) => {
        return res.json();
      });

      this.userName = dataUserId.data.username;
      this.datasUser = bilanSemaine;

      this.average = [];

      this.average[0] = [
        bilanSemaine.reduce((test1, test2) => test1 + test2, 0) /
          bilanSemaine.length,
      ];

      for (let i = 1; i < 7; i++) {
        this.average[i] = this.average[0];
      }

      this.loaded = true;
    } catch (e) {
      console.error(e);
    }
  },
};
</script>

<style>
.statistics {
  background-color: white;
  clear: both;
  margin: 30px;
  width: 85%;
  border: medium solid #24758d;
  padding: 5px;
}

/* @media screen and (min-width: 800px) {
  .statistics {
    float: left;
  }
}
@media screen and (max-width: 800px) {
  .statistics {
    float: right;
  }
} */

@media screen {
}
.graphUser .menu {
  height: 7em;
}
.graphUser .btn {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #39697b;
  color: #e7e7e7;
}
.graphUser .btn:hover {
  background-color: #4f76a0;
}
</style>
