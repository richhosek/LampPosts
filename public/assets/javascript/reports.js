let filterState = "All";
let lamppostList = [];
let stateMap = {
    Prep: "new",
    Paint: "prepped",
    Inspect: "painted",
    Done: "inspected"
}
const identity = localStorage.getItem("LampPostUserId");
if (!identity) {
    location.href = "login.html"
}
document.querySelector(".navbar-brand").textContent += " - " + identity;
$.get(`/api/lamppost`)
    .then(function(lampposts){
        console.log(lampposts)
        lamppostList = lampposts;
        showLampposts();
        
    })

$("#filterButtons button").on("click", function(event){
    $("#filterButtons button")
        .removeClass("btn-primary")
        .addClass("btn-secondary");
    $(event.target).removeClass("btn-secondary").addClass("btn-primary");
    filterState = event.target.textContent;
    showLampposts();
})

function showLampposts() {
    let filteredLampposts = lamppostList.filter(function(lamppost){
        if (filterState === "All") {
            return true;
        } else if (lamppost.status === stateMap[filterState]) {
            return true;
        }
        return false;
    });
    $("#lampposts").empty();
    console.log(filteredLampposts)
    $.each(filteredLampposts, function(index, lamppost){
        console.log(lamppost);
        $("<tr>").append(
            $("<td>").text(lamppost.lamppostId).attr("scope", "row"),
            $("<td>").append($(`<img src='/assets/images/lightbulb-${lamppost.status == "new" ? "red" : lamppost.status == "prepped" ? "orange" : lamppost.status == "painted" ? "green" : "black"}.png'>`), lamppost.location),
            $("<td>").append($("<a>").addClass("btn btn-primary").text("Map").attr("href", `/?id=${lamppost.lamppostId}`))
        ).appendTo("#lampposts")
    })

}