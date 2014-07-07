function updateMin(){
    $('.modal-dialog.modal-max').css('min-height',$(window).height());
}
$( document ).ready(function() {
    updateMin();
});

$( window ).resize(function() {
    updateMin();
});