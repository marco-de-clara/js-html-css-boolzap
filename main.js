// catch click on 'Attiva notifiche desktop'
$('#notice').click(function(event) {
    // stop page from refreshing
    event.preventDefault();
    // display pop-up => none
    $('.pop-up').removeClass('show');
    // extend log box too fill the space
    $('.log-box').toggleClass('longer');
});

// catch click on send bar to switch from mic button to paper send button
$('#sendbar').click(function() {
    // hide mic button and show send button
    showSend();
});

// catch click on the document and reverse display for send button and mic button
$(document).mouseup(function(event) {
    // if the target isn't:
    // the send bar, nor the send button, nor one of their descendants
    if( !$('.send-bar').is(event.target) && !$('.send-btn').is(event.target) && $('.send-bar').has(event.target).length == 0 && $('.send-btn').has(event.target).length == 0) {
        // hide send button and show mic button
        showMic();
    }
});

// catch click on send button
// nts.: the receiver sends .messages, while the user sends .answers 
$('.send-btn').click(function() {
    sendMessageWithSendBtn();
});

// catch keypress enter while sendbar is focused
$('.send-bar').keypress(function(event) {
    sendMessageWithEnter(event);
});

// catch click on search button
$('.search-btn').click(function() {
    // get user's text in uppercase
    var search_text = $('#searchbar').val().trim().toUpperCase();
    // if user's text isn't empty
    if(search_text.length != 0) {
        // search every name for a match
        $('p.name').each(function() {
            // get name from log box in uppercase
            var name_text = $(this).text().toUpperCase();
            // verify if the name found equals to user's text
            if(name_text == search_text) {
                // show its parent
                $(this).parents('.message-highlight').addClass('show');
            } else {
                // hide its parent
                $(this).parents('.message-highlight').removeClass('show');
            }
        });
        // show cancelsearch button
        showCancel();
    }
});

// catch click on cancelsearch button
$('.cancelsearch-btn').click(function() {
    // show search button
    showSearch();
    // clear user's text from searchbar
    $('#searchbar').val('');
    // show every discussion in log box
    $('.message-highlight').addClass('show');
});

// catch click on chevron to display a dropdown menu
$('.chat-container').on('click', '.fa-chevron-down', function() {
    $(this).siblings('.info-menu').toggleClass('show');
});

// catch click document to close dropdown menu
$(document).mouseup(function(event) {
    // if the target is neither the dropdown menu, nor the chevron icon, nor a descendant
    if ( !$('.info-menu').is(event.target) && !$('.fa-chevron-down').is(event.target) && $('.info-menu').has(event.target).length == 0 ) {
        // remove show class from dropdown menu
        $('.info-menu').removeClass('show');
    }
});

// catch click on delete class to remove the message selected
$('.chat-container').on('click', '.delete', function() {
    var parent = $(this).parents('.answer');
    // if this (delete class) has a parent with answer class
    if($(this).parents('.answer').length == 1) {
        // remove the user's message
        parent.remove();
    // else its parent has message class
    } else {
        // remove the receiver's message
        $(this).parents('.message').remove();
    }
});

// hide send button and show mic button 
function showMic() {
    // show mic button
    $('.voice-btn').addClass('show');
    // hide send button
    $('.send-btn').removeClass('show');
};

// hide mic button and show send button
function showSend() {
    // hide mic button
    $('.voice-btn').removeClass('show');
    // show send button
    $('.send-btn').addClass('show');
};

// hide cancelsearch button and show search button 
function showSearch() {
    // show search button
    $('.search-btn').addClass('show');
    // hide cancelsearch button
    $('.cancelsearch-btn').removeClass('show');
};

// hide search button and show cancelsearch button  
function showCancel() {
    // hide search button
    $('.search-btn').removeClass('show');
    // show cancelsearch button
    $('.cancelsearch-btn').addClass('show');
};

// concatenate current day, month and year into dd/mm/yyyy
function getTodayDate(date) {

    return date.toLocaleDateString('it-IT');
};

// concatenate current time into hh:mm
function getTimeStamp(date) {

    return date.toLocaleTimeString(undefined, {hour12: false, hour: '2-digit', minute: '2-digit' });
};

// print hh:mm into its label (receiver's messages)
function printTimeStampMessage(time) {
    // clone template and append it to chat container
    var time_label = $('#template .timestamp').clone().appendTo('.chat-container .message-wrapper:last-child .message:last-child');
    // write content inside the clone
    time_label.append(time);
};

// print hh:mm into its label (user's messages)
function printTimeStampAnswer(time) {
    // clone template and append it to chat container
    var time_label = $('#template .timestamp').clone().appendTo('.chat-container .answer-wrapper:last-child .answer:last-child');
    // write content inside the clone
    time_label.text(time);
};

// print gg/mm/yyyy into its label
function printTodayDate(today) {
    // clone template and append it to chat container
    $('#template .date-wrapper').clone().appendTo('.chat-container');
    // write content inside the clone
    $('.chat-container .date-wrapper:last-child .date:last-child').append(today);
};

// print user's message
function printAnswer(answer_text) {
    // clone template and append it to chat container
    $('#template .answer-wrapper').clone().appendTo('.chat-container');
    // write content inside the clone
    $('.chat-container .answer-wrapper:last-child .answer').append(answer_text);
};

// print a follow up message under user's message
function printAnswerFollowUp(answer_text) {
    // clone template and append it to chat container
    $('#template .answer').clone().appendTo('.chat-container .answer-wrapper:last-child');
    // write content inside the clone
    $('.chat-container .answer-wrapper:last-child .answer:last-child').append(answer_text);
};

// print receiver's message
function printMessage(message_text) {
    // clone template and append it to chat container
    $('#template .message-wrapper').clone().appendTo('.chat-container');
    // write content inside the clone
    $('.chat-container .message-wrapper:last-child .message').append(message_text);
};

// print a follow up message under receiver's message
function printMessageFollowUp(message_text) {
    // clone template and append it to chat container
    $('#template .message').clone().appendTo('.chat-container .message-wrapper:last-child');
    // write content inside the clone
    $('.chat-container .message-wrapper:last-child .message:last-child').append(message_text);
};

// function that sends messages when send button is pressed
function sendMessageWithSendBtn() {
    // get today's date
    var date = new Date();
    // write today's date as dd/mm/yyyy
    var today = getTodayDate(date);
    // write current time as hh:mm
    var time = getTimeStamp(date);
    // get text message written in send bar
    var answer_text = $('#sendbar').val();
    // if the message to be sent is't empty 
    if(answer_text.length != 0) {
        // if the chat container is empty
        if($('.chat-container').children().length == 0 ) {
            // print today's date
            printTodayDate(today);
            // print user's message
            printAnswer(answer_text);
            // print timestamp
            printTimeStampAnswer(time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        // if today's date is different from the date in the chat container and the last message in chat is a message from either the receiver or the user
        } else if(today != $('.chat-container .date:last').text() && ( $('.chat-container').children().last().hasClass('message-wrapper') || $('.chat-container').children().last().hasClass('answer-wrapper') ) ) {
            // print today's date
            printTodayDate(today);
            // print user's message
            printAnswer(answer_text);
            // print timestamp
            printTimeStampAnswer(time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        // if the last message in chat is a message from the user
        } else if($('.chat-container').children().last().hasClass('answer-wrapper')) {
            // print a followup message
            printAnswerFollowUp(answer_text);
            // print timestamp
            printTimeStampAnswer(time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        // if the last message in chat is a message from the user
        } else if($('.chat-container').children().last().hasClass('message-wrapper')) {
            // print user's message
            printAnswer(answer_text);
            // print timestamp
            printTimeStampAnswer(time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        }
        // the receiver replies after 1s
        setTimeout( function() {replyFromReceiver(time)}, 1000);
    }
};

// function that sends messages when ENTER is pressed
function sendMessageWithEnter(event) {
    // get today's date
    var date = new Date();
    // write today's date as dd/mm/yyyy
    var today = getTodayDate(date);
    // write current time as hh:mm
    var time = getTimeStamp(date);
    // get text message written in send bar
    var answer_text = $('#sendbar').val();
    // if the message to be sent is't empty 
    if(answer_text.length != 0 && event.which == 13) {
        //if the chat container is empty
        if($('.chat-container').children().length == 0 ) {
            // print today's date
            printTodayDate(today);
            // print user's message
            printAnswer(answer_text);
            // print timestamp
            printTimeStampAnswer(time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        // if today's date is different from the date in the chat container and the last message in chat is a message from either the receiver or the user
        } else if(today != $('.chat-container .date:last').text() && ( $('.chat-container').children().last().hasClass('message-wrapper') || $('.chat-container').children().last().hasClass('answer-wrapper') ) ) {
            // print today's date
            printTodayDate(today);
            // print user's message
            printAnswer(answer_text);
            // print timestamp
            printTimeStampAnswer(time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        // if the last message in chat is a message from the user
        } else if($('.chat-container').children().last().hasClass('answer-wrapper')) {
            // print a followup message
            printAnswerFollowUp(answer_text);
            // print timestamp
            printTimeStampAnswer(time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        // if the last message in chat is a message from the user
        } else if($('.chat-container').children().last().hasClass('message-wrapper')) {
            // print user's message
            printAnswer(answer_text);
            // print timestamp
            printTimeStampAnswer(time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        }
        // the receiver replies after 1s
        setTimeout( function() {replyFromReceiver(time)}, 1000);
    }
};

// the receiver sends "Ciao!"
function replyFromReceiver(time) {
    printMessage('Ciao!');
    printTimeStampMessage(time);
}



