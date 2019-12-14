document.getElementById("submit").addEventListener("click", onSubmit);
document.getElementById("cancel").addEventListener("click", onCancel);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        document.getElementById('counter').innerHTML = request.msg
        if (request.msg !== ""){
            document.getElementById('form').style.display = 'none'
            document.getElementById('counterDiv').style.display = 'block'
        }
        else{
            document.getElementById('form').style.display = 'block'
            document.getElementById('counterDiv').style.display = 'none'
        }
    }
)

function onSubmit(e) {
    const hours = document.getElementById('hours').value
    const minutes = document.getElementById('minutes').value
    const seconds = document.getElementById('seconds').value
    const endTimerOption = document.getElementById('endTimerOption').value

    const totalSeconds = (parseInt(hours,10) * 60) + (parseInt(minutes,10) * 60) + parseInt(seconds,10)
    chrome.runtime.sendMessage({
        msg: 'start',
        data: `${totalSeconds}`
    });
    chrome.runtime.sendMessage({
        msg: 'endTimerOption',
        data: `${endTimerOption}`
    });
    window.close()
}

function onCancel(e){
    chrome.runtime.sendMessage({
        msg: 'cancel'
    });
    window.close()
}