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
    if( !$('.send-bar').is(event.target) && !$('.send-btn').is(event.target) && $('.send-bar').has(event.target).length == 0 && $('.send-btn').has(event.target).length == 0) {
        // show mic button
        $('.voice-btn').addClass('show');
        // hide paper plane button
        $('.send-btn').removeClass('show');
    }
});

// catch click on paper plane button
// nts.: the receiver sends .messages, while the user sends .answers 
$('.send-btn').click(function() {
    // get today's date
    var date = new Date();
    // write today's date as gg/mm/yyyy
    var today = getTodayDate(date);
    // get text message written in send bar
    var answer_text = $('#sendbar').val();
    // if the message to be sent is't empty and the chat container is empty
    if(answer_text != 0 && $('.chat-container').children().length == 0 ) {
        // print today's date
        printTodayDate(today);
        // print user's message
        printAnswer(answer_text);
    // if today's date is different from the date in the chat container and the last message in chat is a message from either the receiver or the user
    } else if(answer_text != 0 && today != $('.chat-container .date:last').text() && ( $('.chat-container').children().last().hasClass('message-wrapper') || $('.chat-container').children().last().hasClass('answer-wrapper') ) ) {
        // print today's date
        printTodayDate(today);
        // print user's message
        printAnswer(answer_text);
    // if the last message in chat is a message from the user
    } else if(answer_text != 0 && $('.chat-container').children().last().hasClass('answer-wrapper')) {
        // print a followup message
        printAnswerFollowUp(answer_text);
    // if the last message in chat is a message from the user
    } else if(answer_text != 0 && $('.chat-container').children().last().hasClass('message-wrapper')) {
        // print user's message
        printAnswer(answer_text);
    }
});

// concatenate current day, month and year into gg/mm/yyyy
function getTodayDate(date) {

    return (date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear());
}

// print gg/mm/yyyy into its label
function printTodayDate(today) {

    var date_label = $('#template .date').clone().appendTo('.chat-container');

    date_label.text(today);
}

// print user's message
function printAnswer(answer_text) {

    var answer_label = $('#template .answer-wrapper').clone().appendTo('.chat-container');

    $('.chat-container .answer-wrapper:last-child .answer').append(answer_text);
}

// print a follow up message under user's message
function printAnswerFollowUp(answer_text) {
    
    var answer_label = $('#template .answer').clone().appendTo('.chat-container .answer-wrapper:last-child');

    $('.chat-container .answer-wrapper:last-child .answer:last-child').append(answer_text);
}