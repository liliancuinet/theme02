<template>
  <div class="d-flex align-items-center justify-content-center">
    <div class="content">
      <div class="md-layout">
        <h2>Dashboard</h2>
        <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33"
        >
          <h3>Heures cumulées par utilisateurs</h3>

          <teamGraph1
            v-if="loaded"
            v-bind:labels="labels"
            v-bind:datas="datas"
            v-bind:average="average"
          />
        </div>
        <br />
        <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33"
        >
          <h3>Jours de la semaine les plus travaillés</h3>

          <teamGraph2
            v-if="loaded"
            v-bind:datas="datas2"
            v-bind:average="average2"
          />
        </div>
        <br />

        <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33"
        >
          <h3>Top 3 des travailleurs</h3>

          <teamGraph3
            v-if="loaded"
            v-bind:labelPie="labelPie"
            v-bind:dataPie="dataPie"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import teamGraph1 from "@/components/modelTeamGraph1.vue";
import teamGraph2 from "@/components/modelTeamGraph2.vue";
import teamGraph3 from "@/components/modelTeamGraph3.vue";
import jwt_decode from "jwt-decode";

export default {
  // name: "dashboard",
  components: { teamGraph1, teamGraph2, teamGraph3 },

  data: () => ({
    loaded: false,
    labels: null,
    labelPie: null,
    datas: null,
    datas2: null,
    dataPie: null,
    average2: [],
    average: null,
    users: [],
    usersData: [],
    user_id_connected: -1,
    user_role_connected: ""
  }),
  beforeMount () {
    if (localStorage.token) {
      var decoded = jwt_decode(localStorage.token);
      this.user_role_connected = decoded.user_role;
      this.user_id_connected = decoded.user_id;
      if (this.user_role_connected == "user") {
        this.$router.push("/workingtimes/"+this.user_id_connected);
      }
    }else{
      this.$router.push("/login");
    }
  },
  async mounted() {
    this.loaded = false;
    try {
      // Récupération des dates

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

      // Récupération des utilisateurs

      this.users = await fetch("http://127.0.0.1:4000/api/users", myInit).then(
        (res) => {
          return res.json();
        }
      );

      // Tri de la donnée pour obtenir un tableau d'objets avec 1 username et ses données

      let i = 0;
      for (const user of this.users.data) {
        const retrievingData = await fetch(
          `http://127.0.0.1:4000/api/workingtimes/${user.id}?start=${firstday}&end=${lastday}`,
          myInit
        ).then((res) => {
          return res.json();
        });
        this.usersData[i] = {};
        this.usersData[i].userData = retrievingData.data;
        this.usersData[i].userName = user.username;

        i++;
      }

      // CONSTRUCTION DU PREMIER GRAPHIQUE, REPARTITION PAR HEURES

      const totaux = { ID: [], total: [] };
      let difference = 0;
      let userTotal = 0;

      const top3 = [0, 0, 0, 0];
      const top3userName = [];
      // Pour construire le top 3 et la PIE chart

      for (const user of this.usersData) {
        for (const paire of user.userData) {
          difference = new Date(
            new Date(paire.end).getTime() - new Date(paire.start).getTime()
          ).getHours();
          // On calcule la différence entre chaque jour travaillé pour calculer le nombre d'heures quotidien

          userTotal = userTotal + difference;
          // Cela nous permet d'ajouter chaque nombre d'heures journaliers à un nombre d'heures total
          difference = 0;
        }

        totaux.ID.push(user.userName);
        totaux.total.push(userTotal);
        // Suite de If pour construire le top 3
        if (userTotal > top3[2]) {
          if (userTotal > top3[1]) {
            if (userTotal > top3[0]) {
              top3[2] = top3[1];
              top3userName[2] = top3userName[1];

              top3[1] = top3[0];
              top3userName[1] = top3userName[0];

              top3[0] = userTotal;
              top3userName[0] = user.userName;
            } else {
              top3[2] = top3[1];
              top3userName[2] = top3userName[1];

              top3[1] = userTotal;
              top3userName[1] = user.userName;
            }
          } else {
            top3[2] = userTotal;
            top3userName[2] = user.userName;
          }
        }

        userTotal = 0;
      }

      this.labels = totaux.ID;
      this.datas = totaux.total;
      this.average = [
        totaux.total.reduce((test1, test2) => test1 + test2, 0) /
          totaux.total.length,
      ];

      top3[3] = this.average;
      top3userName[3] = "Moyenne";

      // CONSTRUCTION DE LA "PIE"
      this.dataPie = top3;
      this.labelPie = top3userName;

      // CONSTRUCTION DU SECOND GRAPHIQUE, JOUR LES PLUS TRAVAILLÉS

      const bilanSemaine = [];
      const currentDay = new Date();

      // On construit la semaine selon le jour d'aujourd'hui (ici on se place au 25 octobre)

      const currentWeek = [currentDay.getDate() - currentDay.getDay() + 1];

      for (let i = 0; i < 6; i++) {
        currentWeek[i + 1] = currentWeek[i] + 1;
      }

      // Ensuite on boucle sur chaque utilisateur et ses données pour matcher le jour actuel avec celui de la semaine.
      // (à adapter si le tableau n'est pas sliced, cas où il n'y aurait pas plus de 30 entrées dans un tableau sliced)
      for (const user of this.usersData) {
        for (const day of user.userData) {
          const dayStart = new Date(day.start);
          const dayEnd = new Date(day.end);

          const checkDay = currentWeek.find(
            (day) => day === dayStart.getDate()
          ); // Permet de checker si le jour du badgeage correspond à un jour de la semaine actuelle

          // Si le check est OK, on calcule la différence entre le start / end pour obtenir le nb d'heures travaillé, et on le place dans un tableau correspondant à son jour dans la semaine

          if (
            checkDay &&
            bilanSemaine[currentWeek.indexOf(checkDay)] != undefined
          ) {
            bilanSemaine[currentWeek.indexOf(checkDay)] =
              bilanSemaine[currentWeek.indexOf(checkDay)] +
              new Date(dayEnd.getTime() - dayStart.getTime()).getHours();
          }
          if (
            checkDay &&
            bilanSemaine[currentWeek.indexOf(checkDay)] === undefined
          ) {
            bilanSemaine[currentWeek.indexOf(checkDay)] = new Date(
              dayEnd.getTime() - dayStart.getTime()
            ).getHours();
          }
        }
      }

      this.average2[0] = [
        bilanSemaine.reduce((test1, test2) => test1 + test2, 0) /
          bilanSemaine.length,
      ];

      for (let i = 1; i < 7; i++) {
        this.average2[i] = this.average[0];
      }

      this.datas2 = bilanSemaine;

      // On charge les deux graphiques
      this.loaded = true;
    } catch (e) {
      console.error(e);
    }
  },
};
</script>

<style>
.content h2 {
  color: gray;
}
.content::-webkit-scrollbar-track
{
	border-radius: 10px;
	background-color: #1e4753;
}
.content::-webkit-scrollbar
{
	width: 9px;
	background-color: #1e4753;
}
.content::-webkit-scrollbar-thumb
{
	border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #296172;
}
.content {
  background-color: white;
  margin: 30px;
  padding: 30px;
  width: 85%;
  overflow: auto;
  height: 44em;
}

.md-layout-item {
  border: dashed 0.5px rgb(0, 24, 77);
  padding: 5px;
}
/* @media screen and (min-width: 800px) {
  .content {
    width: 90%;
  }
}
@media screen and (max-width: 800px) {
  .content {
    width: 100%;
  }
} */
</style>
