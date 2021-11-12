<script>
import { Radar } from "vue-chartjs";

export default {
  extends: Radar,
  props: {
    datas: Array,
    average: Array,
  },
  mounted() {
    this.renderChart(
      {
        labels: [
          "Lundi",
          "Mardi",
          "Mercredi",
          "Jeudi",
          "Vendredi",
          "Samedi",
          "Dimanche",
        ],
        datasets: [
          {
            label: "Moyenne journalière",
            backgroundColor: "rgba(74,25,130,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: this.average,
          },
          {
            label: "Cumul d'heures par jour",
            backgroundColor: "#24758d",
            borderColor: "rgba(0,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data: this.datas,
          },
        ],
      },
      { responsive: true, maintainAspectRatio: false }
    );
  },
};
</script>
