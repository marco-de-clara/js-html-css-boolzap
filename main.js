// default settings: first in contact list is selected
// number of contacts
var max = 4;
//set default settings
for(var i = 0; i < max; i++) {
    // get contact name
    var receiver_name = $('p.name').eq(i).text();
    // get contact's chat path
    var receiver_path = '.chat-display[data-chat="' + receiver_name + '"]';
    // get last message in contact's chat
    var last_msg = $(receiver_path + ' .chat-container .message-wrapper:last-child .message:last-child .text-content').text();
    // set last message in contacts list
    $('p.last-message').eq(i).append(last_msg);
    // if first contact
    if(i == 0) {
        // get avatar path from contact list selected
         var src_contact = $('#avatar-' + receiver_name.toLowerCase()).attr('src');
        // set that avatar path to avatar in menu chat
        $('#current-avatar').attr('src', src_contact);
        // set contact name in menu chat 
        $('#receiver-name').append(receiver_name);
        // select this contact
        $('p.name').eq(i).parents('.contact-highlight').addClass('selected');
        // activate chat assigned to that contact name
        $(receiver_path).addClass('active');
    }
};

// catch click on 'Attiva notifiche desktop'
$('#notice').click(function(event) {
    // stop page from refreshing
    event.preventDefault();
    // display pop-up => none
    $('.pop-up').removeClass('show');
    // extend contacts box too fill the space
    $('.contacts').toggleClass('longer');
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
$(document).on('click', '.send-btn', function() {
    sendMessageWithSendBtn();
});

// catch keypress enter while sendbar is focused
$(document).on('keypress', '.send-bar', function(event) {
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
            // get name from contacts box in uppercase
            var name_text = $(this).text().toUpperCase();
            // verify if the name found equals to user's text
            if(name_text == search_text) {
                // show its parent
                $(this).parents('.contact-light').addClass('show');
            } else {
                // hide its parent
                $(this).parents('.contact-highlight').removeClass('show');
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
    // show every discussion in contacts box
    $('.contact-highlight').addClass('show');
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

// catch click on contact in contacts box
$('.contact-highlight').click(function() {
    // deactivate every chat displayed
    $('.chat-display').removeClass('active');
    // deselect every contact
    $('.contact-highlight').removeClass('selected');
    // select this contact
    $(this).addClass('selected');
    // get avatar path from contact list selected
    var src_contact = $(this).find('img').attr('src');
    // set that avatar path to avatar in menu chat
    $('#current-avatar').attr('src', src_contact);
    // remove name in menu chat
    $('#receiver-name').empty();
    // get name from selected contact
    var contact_name = $(this).find('p.name').text();
    // set receiver name in menu chat
    $('#receiver-name').append(contact_name);
    // activate chat assigned to that contact name
    $('.chat-display[data-chat="' + contact_name + '"]').addClass('active');
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
function printTimeStampMessage(receiver, time) {
    // select receiver's chat 
    var receiver_label = '.chat-display[data-chat="' + receiver + '"]';
    // clone template and append it to chat container
    var time_label = $('#template .timestamp').clone().appendTo(receiver_label + ' .chat-container .message-wrapper:last-child .message:last-child');
    // write content inside the clone
    time_label.append(time);
};

// print hh:mm into its label (user's messages)
function printTimeStampAnswer(receiver, time) {
    // select receiver's chat 
    var receiver_label = '.chat-display[data-chat="' + receiver + '"]';
    // clone template and append it to chat container
    var time_label = $('#template .timestamp').clone().appendTo(receiver_label + ' .chat-container .answer-wrapper:last-child .answer:last-child');
    // write content inside the clone
    time_label.text(time);
};

// print gg/mm/yyyy into its label
function printTodayDate(receiver, today) {
    // select receiver's chat 
    var receiver_label = '.chat-display[data-chat="' + receiver + '"]';
    // clone template and append it to chat container
    $('#template .date-wrapper').clone().appendTo(receiver_label + ' .chat-container');
    // write content inside the clone
    $(receiver_label + ' .chat-container .date-wrapper:last-child .date:last-child').append(today);
};

// print user's message
function printAnswer(receiver, answer_text) {
    // select receiver's chat 
    var receiver_label = '.chat-display[data-chat="' + receiver + '"]';
    // clone template and append it to chat container
    $('#template .answer-wrapper').clone().appendTo(receiver_label + ' .chat-container');
    // write content inside the clone
    $(receiver_label + ' .chat-container .answer-wrapper:last-child .answer  .text-content').append(answer_text);
};

// print a follow up message under user's message
function printAnswerFollowUp(receiver, answer_text) {
    // select receiver's chat 
    var receiver_label = '.chat-display[data-chat="' + receiver + '"]';
    // clone template and append it to chat container
    $('#template .answer').clone().appendTo(receiver_label + ' .chat-container .answer-wrapper:last-child');
    // write content inside the clone
    $(receiver_label + ' .chat-container .answer-wrapper:last-child .answer:last-child  .text-content').append(answer_text);
};

// print receiver's message
function printMessage(receiver, message_text) {
    // select receiver's chat 
    var receiver_label = '.chat-display[data-chat="' + receiver + '"]';
    // clone template and append it to chat container
    $('#template .message-wrapper').clone().appendTo(receiver_label + ' .chat-container');
    // write content inside the clone
    $(receiver_label + ' .chat-container .message-wrapper:last-child .message .text-content').append(message_text);
};

// print a follow up message under receiver's message
function printMessageFollowUp(receiver, message_text) {
    // select receiver's chat 
    var receiver_label = '.chat-display[data-chat="' + receiver + '"]';
    // clone template and append it to chat container
    $('#template .message').clone().appendTo(receiver_label + ' .chat-container .message-wrapper:last-child');
    // write content inside the clone
    $(receiver_label + ' .chat-container .message-wrapper:last-child .message:last-child .text-content').append(message_text);
};

// the receiver sends "Ok!"
function replyFromReceiver(receiver, time) {
    printMessage(receiver, 'Ok!');
    printTimeStampMessage(receiver, time);
    // push message to receiver's contact in contact list
    pushLastMsg(receiver);
};

// push last user message to receiver's contact in contact list
function pushLastAnswer(receiver) {
    // get contact's chat path
    var receiver_path = '.chat-display[data-chat="' + receiver + '"]';
    // get last message path
    var last_msg_path = '.contact-highlight[data-contact-name="' + receiver + '"]';
    // erase previous last message in contact list
    $(last_msg_path + ' p.last-message').empty();
    // get last message in contact's chat
    var last_msg = $(receiver_path + ' .chat-container .answer-wrapper:last-child .answer:last-child .text-content').text();
    // set new last message in contacts list
    $(last_msg_path).find('p.last-message').append(last_msg);
};

// push last receiver message to receiver's contact in contact list
function pushLastMsg(receiver) {
    // get contact's chat path
    var receiver_path = '.chat-display[data-chat="' + receiver + '"]';
    // get last message path
    var last_msg_path = '.contact-highlight[data-contact-name="' + receiver + '"]';
    // erase previous last message in contact list
    $(last_msg_path + ' p.last-message').empty();
    // get last message in contact's chat
    var last_msg = $(receiver_path + ' .chat-container .message-wrapper:last-child .message:last-child .text-content').text();
    // set new last message in contacts list
    $(last_msg_path).find('p.last-message').append(last_msg);
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
    //get current receiver name
    var receiver = $('#receiver-name').text();
    // if the message to be sent is't empty 
    if(answer_text.length != 0) {
        // if the chat container is empty
        if($('.chat-container').children().length == 0 ) {
            // print today's date
            printTodayDate(receiver, today);
            // print user's message
            printAnswer(receiver, answer_text);            
            // print timestamp
            printTimeStampAnswer(receiver, time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        // if today's date is different from the date in the chat container and the last message in chat is a message from either the receiver or the user
        } else if(today != $('.chat-container .date:last').text() && ( $('.chat-container').children().last().hasClass('message-wrapper') || $('.chat-container').children().last().hasClass('answer-wrapper') ) ) {
            // print today's date
            printTodayDate(receiver, today);
            // print user's message
            printAnswer(receiver, answer_text);
            // print timestamp
            printTimeStampAnswer(receiver, time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        // if the last message in chat is a message from the user
        } else if($('.chat-container').children().last().hasClass('answer-wrapper')) {
            // print a followup message
            printAnswerFollowUp(receiver, answer_text);
            // print timestamp
            printTimeStampAnswer(receiver, time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        // if the last message in chat is a message from the user
        } else if($('.chat-container').children().last().hasClass('message-wrapper')) {
            // print user's message
            printAnswer(receiver, answer_text);           
            // print timestamp
            printTimeStampAnswer(receiver, time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        }
        // push message to receiver's contact in contact list
        pushLastAnswer(receiver);
        // the receiver replies after 1s
        setTimeout( function() {replyFromReceiver(receiver, time)}, 1000);
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
    //get current receiver name
    var receiver = $('#receiver-name').text();
    // if the message to be sent is't empty 
    if(answer_text.length != 0 && event.which == 13) {
        //if the chat container is empty
        if($('.chat-container').children().length == 0 ) {
            // print today's date
            printTodayDate(receiver, today);
            // print user's message
            printAnswer(receiver, answer_text);            
            // print timestamp
            printTimeStampAnswer(receiver, time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        // if today's date is different from the date in the chat container and the last message in chat is a message from either the receiver or the user
        } else if(today != $('.chat-container .date:last').text() && ( $('.chat-container').children().last().hasClass('message-wrapper') || $('.chat-container').children().last().hasClass('answer-wrapper') ) ) {
            // print today's date
            printTodayDate(receiver, today);
            // print user's message
            printAnswer(receiver, answer_text);           
            // print timestamp
            printTimeStampAnswer(receiver, time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        // if the last message in chat is a message from the user
        } else if($('.chat-container').children().last().hasClass('answer-wrapper')) {
            // print a followup message
            printAnswerFollowUp(receiver, answer_text);            
            // print timestamp
            printTimeStampAnswer(receiver, time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        // if the last message in chat is a message from the user
        } else if($('.chat-container').children().last().hasClass('message-wrapper')) {
            // print user's message
            printAnswer(receiver, answer_text);           
            // print timestamp
            printTimeStampAnswer(receiver, time);
            // clear message
            $('#sendbar').val('');
            // hide send button show mic button
            showMic();
        }
        // push message to receiver's contact in contact list
        pushLastAnswer(receiver);
        // the receiver replies after 1s
        setTimeout( function() {replyFromReceiver(receiver, time)}, 1000);
    }
};
