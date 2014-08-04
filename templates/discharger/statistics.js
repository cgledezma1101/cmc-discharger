/*
  This template responds to the get_statistics call. It renders the average
  waiting time for the discharges and a chart showing the incidence of each
  stage on the discharge process.

  @param int average_discharge_wait The average time in which discharges have
    been fully attended
  @param dict<str x List> chart_data A dictionary containing the information to
    be printed on the chart. Each key here is the name of the stage described
    and each value is an array of 4 positions, containing the amount of
    discharges that passed by the corresponding stage in blue, yellow, red and
    black conditions, respectively
*/
$('.statistics > .loader').hide();
$('.statistics > .charts').show();
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
