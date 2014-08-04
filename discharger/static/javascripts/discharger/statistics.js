$(document).ready(function(){
  // This initializes the datepickers
  $('.datepicker').datepicker();

  // Handle the submission of the search form
  $('#search-submit').on('click', function(event){
    event.preventDefault();
    $('.statistics > .charts').hide();

    $('.form-errors').text("");
    date_o = $('#initialDate').val();
    date_f = $('#finalDate').val();

    // Perform validation over the fields
    if(date_o == "" || date_f == ""){
      $('.form-errors').text("Ambas fechas son obligatorias");
      return false;
    } else if($.datepicker.parseDate('mm/dd/yy', date_o) >=
              $.datepicker.parseDate('mm/dd/yy', date_f)){
      $('.form-errors').text("La fecha de fin debe ser después de la fecha " +
                             "de inicio")
      return false;
    }

    // If all validations were passed, perform the javascript call to perform
    // the search
    $('.statistics > .loader').show();
    request_params = 'date_o=' + date_o + '&date_f=' + date_f;
    request_url = '/altas/get_statistics?' + request_params
    $.getScript(request_url)
  })
})
