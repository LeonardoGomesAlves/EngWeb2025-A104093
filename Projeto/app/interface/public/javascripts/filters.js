$(document).ready(function() {
  $('#tipo-section').hide();
  $('#classificadores-section').hide();

  $('#clearFiltersBtn').on('click', function(e) {
    e.preventDefault();
    $('input[type="checkbox"]').prop('checked', false);
    
    const username = $(this).data('username');
    if (username) {
      window.location.href = `/profile/${username}`;
    } else {
      window.location.href = '/';
    }
  });

  $('li[data-href]').css('cursor', 'pointer').on('click', function() {
    window.location.href = $(this).attr('data-href');
  });

  // pelo menos um classificador
  $('form[action="/upload"]').on('submit', function(e) {
    if ($('input[name="classificadores"]:checked').length === 0) {
      alert('Seleciona pelo menos um classificador!');
      e.preventDefault();
    }
  });
});

function toggleTipo() {
  const $section = $('#tipo-section');
  const $arrow = $('#tipoArrow');
  
  if ($section.is(':hidden')) {
    $section.show();
    $arrow.removeClass('fa-arrow-right').addClass('fa-arrow-down');
  } else {
    $section.hide();
    $arrow.removeClass('fa-arrow-down').addClass('fa-arrow-right');
  }
}

function toggleClassificadores() {
  const $section = $('#classificadores-section');
  const $arrow = $('#classificadoresArrow');
  
  if ($section.is(':hidden')) {
    $section.show();
    $arrow.removeClass('fa-arrow-right').addClass('fa-arrow-down');
  } else {
    $section.hide();
    $arrow.removeClass('fa-arrow-down').addClass('fa-arrow-right');
  }
}