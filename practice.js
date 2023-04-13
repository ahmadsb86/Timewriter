const showanimspeed = 200
var state = 'reset'
var seconds = 0
let startDate;
var data = {prs:[]};

$(function(){
    $('#past-runs-section').hide()
    hideCards()

    if(JSON.parse(window.localStorage.getItem("myData")) != null){
        data = JSON.parse(window.localStorage.getItem("myData"))
    }
    updateSideBar()
    
});

function startTimer(){
    const date = new Date
    startDate = date.getTime()
    setInterval(function (){
        if(state=='running'){
            const date = new Date
            seconds = Math.abs((date.getTime() - startDate) / 1000);
            updateTimer()
        }
    }, 10)
}

function updateTimer(){
    seconds = seconds.toFixed(2)
    let str = ""
    str+= ("0"+Math.floor(seconds/60)).slice(-2) + ':' + ("0" + Math.floor(seconds%60)).slice(-2) + ':' + ("0"+Math.floor((seconds - Math.floor(seconds))*100)).slice(-2)
    $('#timer').html(str)
}

// function getSeconds(){
    
// }

function openSideBar(){
    $('#past-runs-section').show()
    $('#past-runs-section').animate({
        'width': '50%'
    },showanimspeed);
}
function closeSideBar(){
    $('#past-runs-section').hide()
    $('#past-runs-section').animate({
        'width': '0%'
    },showanimspeed);
}

function displayCards(){
    $('#calc-card').show()
    $('#calc-card').animate({
        'height': '100%'
    },showanimspeed);
    $('#comments-card').show()
    $('#comments-card').animate({
        'height': '100%'
    },showanimspeed);
    $('#stats').show()
    $('#stats').animate({
        'height': '100%'
    },showanimspeed);
    $('#w').focus();
}

function hideCards(){
    $('#calc-card').hide()
    $('#calc-card').animate({
        'height': '0%'
    },showanimspeed);
    $('#comments-card').hide()
    $('#comments-card').animate({
        'height': '0%'
    },showanimspeed);
    $('#stats').hide()
    $('#stats').animate({
        'height': '0%'
    },showanimspeed);
}

function setColor(){
    $('#timer').toggleClass("text-neutral-100")
    $('#timer').toggleClass("text-pink-700")
}



function resetAll(){
    hideCards()
    closeSideBar()
    seconds = 0
    updateTimer()
    $('#w').val('')
    $('#WPM').html('----')
    $('#comment-inp').val('')
}

$('body').keydown( function(event) {
  if (event.keyCode == 32) { //Space pressed
    switch (state) {
        case 'running':
            state = 'ended'
            $('#notif').html('Press Space to Go Again')
            displayCards()
            break;
        case 'ended':
            if(!$("#comment-inp").is(":focus")){
                $('#notif').html('Hold Space When You\'re Ready')
                state = 'reset'
                resetAll()
            }
            break;
        case 'reset':
            state = 'set'
            setColor()
            $('#notif').html('Release Space to Start')
            
            break;
        default:
            break;
    }
  }
})

$('#retry').click(()=>{
    $('#notif').html('Hold Space When You\'re Ready')
    state = 'reset'
    resetAll()
})

$('body').keyup( function(event){
    if(event.keyCode==32 && state=='set'){
        state='running'
        setColor()
        $('#notif').html('Press Space to Stop')
        startTimer()
    }
})

var wpm = 0.00;

$('#save').click(()=>{
    data.prs.push({"wpm": wpm, "words": $('#w').val(), "comment": $('#comment-inp').val()})
    window.localStorage.setItem("myData", JSON.stringify(data));
    updateSideBar()
    openSideBar()
})

$(`#sidebar`).on('click', '.trash', function (){
    const index = parseInt(($(this).attr('id')).slice(6))
    console.log(`DELETING INDEX ${index}`)
    data.prs.splice(index,1)
    window.localStorage.setItem("myData", JSON.stringify(data))
    updateSideBar()
})

$('#view').click(()=>{
    openSideBar()
})

var prevAvg = -1;
var prevBest = -1;

function updateSideBar(){
    $('#sidebar').empty()
    var avg = 0;
    var best = 0;
    for(i in data.prs){
        const WPM = data.prs[i].wpm
        const words = data.prs[i].words
        const comment = data.prs[i].comment
        $('#sidebar').prepend(`<div class="flex justify-start w-full items-center"><div class="bg-neutral-800 p-4 rounded-md text-neutral-100 my-2 w-full"><span class="text-pink-500">${WPM} WPM [${words} words]</span>:  ${comment}</div><button class="trash ml-2 p-4 bg-neutral-800 bg-opacity-0 hover:bg-opacity-30 rounded-md text-neutral-100" id="trash-${i}">X</button></div>`)
        avg+=parseInt(WPM)
        best = Math.max(best,parseInt(WPM))
    }

    if(data.prs.length>0){
        console.log(typeof(avg))
        avg = (avg/data.prs.length).toFixed(2)
        if(prevAvg == -1){
            prevAvg = avg
            prevBest = best
        }
    
        $('#best').html(`Best: ${best}`)
        $('#avg').html(`Avg: ${avg}`)
        
        if(best > prevBest) setStatColor($('#best'), 'green')
        else setStatColor($('#best'), 'white')
        
        if(avg == prevAvg) setStatColor($('#avg'), 'white')
        else if(avg > prevAvg) setStatColor($('#avg'), 'green')
        else  setStatColor($('#avg'), 'red')
    
        prevAvg = avg
        prevBest = best
    }
    else{
        $('#best').html(`Best: -`)
        $('#avg').html(`Avg: -`)
        setStatColor($('#avg'), 'white')
        setStatColor($('#best'), 'white')
    }
}

function setStatColor(e,color){
    switch (color) {
        case 'green':
            e.removeClass('text-neutral-100')
            e.removeClass('text-pink-700')
            e.addClass('text-green-700')
            break;
        case 'red':
            e.removeClass('text-neutral-100')
            e.removeClass('text-green-700')
            e.addClass('text-pink-700')
            break;
        case 'white':
            e.addClass('text-neutral-100')
            e.removeClass('text-pink-700')
            e.removeClass('text-green-700')
            break;
            
        default:
            break;
    }
}

$('#w').change(function (){
    wpm = (($(this).val())/(seconds/60)).toFixed(2)
    $('#WPM').html((($(this).val())/(seconds/60)).toFixed(2))
})