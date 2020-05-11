// catch click on 'Attiva notifiche desktop'
$('#notice').click(function() {
    // display pop-up => none
    $('.pop-up').removeClass('show');
    // extend log box too fill the space
    $('.log-box').toggleClass('longer');
});

// catch click on send bar to switch from mic button to paper plane button
$('#sendbar').click(function() {
    // display mic button => none;
    $('.voice-btn').removeClass('show');
    // display paper plane button => inline-block;
    $('.send-btn').addClass('show');
});

// catch click on the document and reverse display for paper plane button and mic button
$(document).mouseup(function(event) {
    // if the target isn't:
    // the send bar, nor the send button, nor one of their descendants
    if ( !$('.send-bar').is(event.target) && !$('.send-btn').is(event.target) && $('.send-bar').has(event.target).length == 0 && $('.send-btn').has(event.target).length == 0) {
        // show mic button
        $('.voice-btn').addClass('show');
        // hide paper plane button
        $('.send-btn').removeClass('show');
    }
});
