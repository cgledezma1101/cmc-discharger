$(document).ready(function(){
  // This initializes the datepickers
  $('.datepicker').datepicker();

  // Handle the submission of the search form
  $('#search-submit').on('click', function(event){
    event.preventDefault();

    $('.form-errors').text("");
    date_o = $('#initialDate').val();
    date_f = $('#finalDate').val();

    if(date_o == "" || date_f == ""){
      $('.form-errors').text("Ambas fechas son obligatorias");
      return false;
    } else if($.datepicker.parseDate('mm/dd/yy', date_o) >=
              $.datepicker.parseDate('mm/dd/yy', date_f)){
      $('.form-errors').text("La fecha de fin debe ser después de la fecha " +
                             "de inicio")
    }
  })
})
