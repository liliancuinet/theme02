<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: {
    labels: Array,
    datas: Array,
    average: Array, //
  },
  mounted() {
    this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            label: "Cumul d'heure par utilisateur",
            backgroundColor: "#24758d",
            data: this.datas,
          },
          {
            label: "Moyenne du service",
            backgroundColor: "rgba(74,25,130,0.2)",
            data: this.average,
          },
        ],
      },
      { responsive: true, maintainAspectRatio: false }
    );
  },
};
</script>
<style scoped></style>
