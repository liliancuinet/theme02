<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    userName: String,
    datasUser: Array,
    average: Array,
  },
  data() {
    return {
      gradient: null,
      gradient2: null,
    };
  },
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    this.gradient.addColorStop(0, "rgba(2, 0,0, 0.5)");
    this.gradient.addColorStop(0.5, "rgba(2, 0, 0, 0.25)");
    this.gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    this.gradient2.addColorStop(0, "rgba(0, 100, 150, 0.9)");
    this.gradient2.addColorStop(0.5, "rgba(0, 50, 100, 0.25)");
    this.gradient2.addColorStop(1, "rgba(50, 50, 50, 50)");

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
            label: this.userName,
            borderColor: "#224870",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "white",
            backgroundColor: this.gradient2,
            data: this.datasUser,
          },
          {
            label: "Moyenne sur la semaine",
            // borderColor: "#224870",
            // pointBackgroundColor: "white",
            pointBorderColor: "white",
            borderWidth: 1,
            // backgroundColor: this.gradient2,
            data: this.average,
          },
        ],
      },
      { responsive: true, maintainAspectRatio: false }
    );
  },
};
</script>
