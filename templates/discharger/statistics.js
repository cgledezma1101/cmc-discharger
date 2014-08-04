// Build the chart to be shown
$('#incidence-per-stage').highcharts({
  chart: {
    type: 'column'
  },
  title: {
    text: 'Incidencia de motivos de espera en tiempos de altas'
  },
  colors: ['#0000FF', '#FFFF00', '#FF0000', '#000000'],
  xAxis: {
    categories: [
      {% for stage in chart_data %}
        {% if forloop.last %}
          '{{ stage }}'
        {% else %}
          '{{ stage }}',
        {% endif %}
      {% endfor %}
    ]
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Cantidad de instancias'
    }
  },
  series: [{
      name: '< 2h',
      data: [
        {% for stages, counts in chart_data.items %}
          {% if forloop.last %}
            {{ counts.0 }}
          {% else %}
            {{ counts.0 }},
          {% endif %}
        {% endfor %}
      ]
    }, {
      name: '2h - 4h',
      data: [
        {% for stages, counts in chart_data.items %}
          {% if forloop.last %}
            {{ counts.1 }}
          {% else %}
            {{ counts.1 }},
          {% endif %}
        {% endfor %}
      ]
    }, {
      name: '4h - 6h',
      data: [
        {% for stages, counts in chart_data.items %}
          {% if forloop.last %}
            {{ counts.2 }}
          {% else %}
            {{ counts.2 }},
          {% endif %}
        {% endfor %}
      ]
    }, {
      name: '6h <',
      data: [
        {% for stages, counts in chart_data.items %}
          {% if forloop.last %}
            {{ counts.3 }}
          {% else %}
            {{ counts.3 }},
          {% endif %}
        {% endfor %}
      ]
    }
  ]
});

$('#average-discharge-time').text('{{ average_discharge_wait }} horas');
$('.statistics > .loader').hide();
$('.statistics > .charts').show();
