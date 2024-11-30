<template>
  <div class="price-check">
    <div class="search-bar">
      <input 
        v-model="group3" 
        placeholder="상품 태그를 입력하세요" 
        @keyup.enter="fetchPriceData" 
      />
      <button @click="fetchPriceData">검색</button>
    </div>
    <div class="search-guide">
      <span class="guide-icon">ℹ️</span>
      <span class="guide-text">검색 키워드가 포함된 매물의 시세가 아래에 표시됩니다</span>
    </div>
    <div id="chart_div"></div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      group3: '',
      chartData: [],
    };
  },
  methods: {
    async fetchPriceData() {
      if (!this.group3) {
        alert("검색어를 입력하세요.");
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/price', {
          params: { group3: this.group3 },
        });
        this.chartData = response.data;
        this.drawChart();
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      }
    },

    drawChart() {
  if (!window.google) {
    console.error("Google Chart 라이브러리가 로드되지 않았습니다.");
    return;
  }

  const data = new window.google.visualization.DataTable();
  data.addColumn('string', '날짜');
  data.addColumn('number', '평균 시세');

  this.chartData.forEach(item => {
    const label = `${item.year}-${String(item.month).padStart(2, '0')}`;
    data.addRow([label, item.avg_price]);
  });

  const options = {
    title: `${this.group3} 평균시세`,
    titleTextStyle: {
      color: '#2c3e50',
      fontSize: 24,
      bold: true,
    },
    curveType: 'function',
    lineWidth: 3,
    colors: ['#42b983'],
    pointSize: 5, // 데이터 지점의 크기 설정
    backgroundColor: {
      fill: '#f8f9fa',
      stroke: '#ddd',
      strokeWidth: 1,
    },
    chartArea: {
      left: 100,
      right: 50,
      top: 50,
      bottom: 50,
      width: '80%',
      height: '75%',
    },
    hAxis: {
      title: '연월',
      titleTextStyle: {
        color: '#2c3e50',
        italic: false,
        bold: true,
      },
      gridlines: {
        color: '#f5f5f5',
      },
      baselineColor: '#ddd',
      textStyle: {
        fontSize: 11,
      },
    },
    vAxis: {
      title: '평균 시세',
      titleTextStyle: {
        color: '#2c3e50',
        italic: false,
        bold: true,
      },
      gridlines: {
        color: '#f5f5f5',
      },
      baselineColor: '#ddd',
      format: '₩#,###',
      textPosition: 'out',
      textStyle: {
        fontSize: 11,
      },
      viewWindow: {
        min: 0,
      },
    },
    legend: { position: 'none' },
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out',
    },
    tooltip: {
      textStyle: {
        color: '#2c3e50',
        fontSize: 14,
      },
      showColorCode: true,
      format: 'currency',
    },
    crosshair: {
      color: '#42b983',
      trigger: 'both',
    },
    series: {
      0: {
        pointSize: 5, // 점의 크기 설정
      },
    },
  };

  const chart = new window.google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
},
  },
  mounted() {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.onload = () => {
      window.google.charts.load('current', { 
        packages: ['corechart'],
        language: 'ko'
      });
      window.google.charts.setOnLoadCallback(() => {
        console.log("Google Chart API 로드 완료");
      });
    };
    document.head.appendChild(script);
  },
};
</script>

<style scoped>
/* 이전 스타일 유지 */
.price-check {
  text-align: center;
  margin: 30px auto;
  max-width: 1200px;
  padding: 0 20px;
}

.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.search-bar input {
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  width: 300px;
  transition: all 0.3s ease;
  outline: none;
}

.search-bar input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.search-bar button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-bar button:hover {
  background-color: #3aa876;
  transform: translateY(-1px);
}

.search-bar button:active {
  transform: translateY(0);
}

.search-guide {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  padding: 8px 16px;
  background-color: #f8f9fa;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: inline-flex;
}

.guide-icon {
  font-size: 16px;
}

.guide-text {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.3px;
}

#chart_div {
  margin: 0 auto;
  width: 100%;
  height: 600px;
  border-radius: 12px;
  background: #f8f9fa;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
</style>