$(document).ready(function() {
  $('.upload-button').on('click', function(e) {
    e.preventDefault();
    $('#uploadModal').css('display', 'block');
  });

  $('#closeModal').on('click', function() {
    $('#uploadModal').css('display', 'none');
  });

  $(window).on('click', function(e) {
    if ($(e.target).is('#uploadModal')) {
      $('#uploadModal').css('display', 'none');
    }
  });
});

function addFileForm() {
    var html = `
    <div class='w3-card w3-padding w3-margin-bottom file-container'> 
      <div class='w3-row'>
        <div class='w3-col s11'>
          <label class='w3-text-dark-grey'><b>Nome (opcional)</b></label>        
          <input class='w3-input w3-border w3-light-grey w3-round' type='text' name='paths' placeholder='Ex: data/pasta/arquivo.jpg'/>
          
          <label class='w3-text-dark-grey' style='margin-top:10px'><b>Selecione o ficheiro</b></label>        
          <input class='w3-input w3-border w3-light-grey w3-round' type='file' name='ficheiros' required/>
        </div>
        <div class='w3-col s1 w3-center'>
          <button class='w3-button w3-circle w3-red' type='button' style='margin-top:25px' onclick='removeFileForm(this)'>
            <i class='fa fa-trash'></i>
          </button>
        </div>
      </div>
    </div>
    `

    $('#fields').append(html);
}

function removeFileForm(button) {
    $(button).closest('.file-container').remove();
}