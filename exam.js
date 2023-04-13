var state = 'inp'
var inpcur = 1;

var timeLimit = 0;

$(function(){
    $('#timeCard').hide()
    $('#stop').hide()
});

$('body').keydown( function(event) {
    if(event.which >= 48  && event.which <=57 && state=='inp' && inpcur <= 4 ){
        var x = event.which-48
        for(var i = 1; i<=inpcur; i++){
            var y = $(`#i${i}`).html();
            $(`#i${i}`).html(x)
            x = y;
        }
        $(`#i${inpcur}`).removeClass('opacity-10')
        inpcur++;
        const mins = parseInt($(`#i1`).html()) + parseInt($(`#i2`).html())*10
        const hours = parseInt($(`#i3`).html()) + parseInt($(`#i4`).html())*10
        timeLimit = (mins*60) + (hours*360)
        console.log(timeLimit)
    }
    if(event.keyCode == 32 ){
        if(state=='running'){
            state='stopped'
            prevseconds = Number(seconds)
            $('#notif').html('Hit Space to Resume Timer')
            $('#stop').show()
        }
        else if(state=='stopped'){
            state='running'
            startTimer()
            $('#notif').html('Hit Space to Pause Timer')
            $('#stop').hide()
        }
    }
} )

var startDate; 
const showanimspeed = 200

$('#stop').click(()=>{
    if(state='stopped'){
        state='ended'
        $('#stop').animate({
            'scale': '0%'
        },showanimspeed);
        $('#timeCard').animate({
            'scale': '200%'
        },showanimspeed)
        $('#timer').removeClass('text-neutral-100')
        if(seconds < timeLimit){
            $('#notif').html('You finished within time!')
            $('#timer').addClass('text-green-700')
        }  
        else{
            $('#notif').html('You exceeded the time limit.')
            $('#timer').addClass('text-pink-700')
        }
    }
})

var prevseconds = 0;
var seconds = 0;

$('#start').click( ()=>{
    state='running'
    $('#inpCard').hide()
    $('#start').hide()
    $('#timeCard').show()
    startTimer()
})

function startTimer(){
    const date = new Date
    startDate = date.getTime()
    setInterval(function (){
        if(state=='running'){
            const date = new Date
            seconds = prevseconds + Math.abs((date.getTime() - startDate) / 1000);
            seconds = Number(seconds).toFixed(2)
            let str = ""
            str+= ("0"+Math.floor(seconds/3600)).slice(-2) + ':' + ("0" + Math.floor(seconds/60)%60).slice(-2) + ':' + ("0"+Math.floor(seconds% 60)).slice(-2)
            $('#timer').html(str)
        }
    }, 10)
}
