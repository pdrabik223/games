document.getElementById("showSettings").addEventListener("click", toggleSettings);
document.getElementById("buttonSinglePlayer").addEventListener("click", () => { toggleGameMode(0) });
document.getElementById("buttonMlTraining").addEventListener("click", () => { toggleGameMode(1) });


function toggleGameMode(btnId) {
    if (btnId == 0) {
        document.getElementById("buttonSinglePlayer").style.background = "grey"
        document.getElementById("buttonMlTraining").style.background = "transparent"
        document.getElementById("gameModeSelectionText").innerHTML = "Game Mode: Single Player"
    } else {

        document.getElementById("buttonSinglePlayer").style.background = "transparent"
        document.getElementById("buttonMlTraining").style.background = "grey"
        document.getElementById("gameModeSelectionText").innerHTML = "Game Mode: ML Training"
    }


}

function toggleSettings() {
    var x = document.getElementById("settings");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}