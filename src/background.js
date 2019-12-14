// chrome.browserAction.onClicked.addListener(
//     function(){
//         chrome.browserAction.setPopup({popup:'../popup.html'})
//     }
// )
let cancel = false
const endTimerOptions = ['Current', 'Alarm', 'All']
let option = 'Current' //default

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === 'cancel'){
            cancel=true
        }
        else if (request.msg === 'endTimerOption'){
            option = endTimerOptions[parseInt(request.data,10)]
            setTimeout(()=>(null),500 )
        }
        else{
            console.log("Timer for " + request.data + " seconds")
            countDown(request.data)
        }
    }
)

function countDown(val,port){
    let counter = parseInt(val,10)

    if (counter <= 10 && counter > 0) {
        chrome.browserAction.setBadgeText({text: `${counter}`})
    }

    const intervalId = setInterval(function() {
        counter--;

        if (cancel){
            chrome.browserAction.setBadgeText({text: ""})
            clearInterval(intervalId);
            chrome.runtime.sendMessage({
                msg: ""
            });
            return
        }
        if (counter < 0){
            clearInterval(intervalId);    
            return
        }

        chrome.runtime.sendMessage({
            msg: `${counter}`
        });


        if (counter >= 0 && counter <= 10) {
            chrome.browserAction.setBadgeText({text: `${counter}`})
        }
        if (counter === 0) {
            chrome.browserAction.setBadgeText({text: ""})
            clearInterval(intervalId);
            chrome.runtime.sendMessage({
                msg: ""
            });
            endOfCounter()
        }
        }, 1000)
}

function endOfCounter(){
    if (option == 'All'){
        chrome.tabs.getAllInWindow(null, function(tabs){
            for (var i = 0; i < tabs.length; i++) {
                chrome.tabs.remove(tabs[i].id)                 
            }
        })
    }
    else if(option == 'Current'){
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            for (var i = 0; i < tabs.length; i++) {
                chrome.tabs.remove(tabs[i].id)

            }
        })
    }
    else{
        //play sound
        const myAudio = new Audio(chrome.runtime.getURL("alarm.mp3"));
        myAudio.play();
    }
}