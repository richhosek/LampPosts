let map;
let geocoder;
let infoWindow;
let addLamppostInfoWindow;
let currentPosition;
let addOnClick = false;

let gMarker = null;
let gInfoWindow;

let parameters = new URLSearchParams(location.search);
let panToMarker = parameters.get("id");


const identity = localStorage.getItem("LampPostUserId");
if (!identity) {
    location.href = "login.html"
}
document.querySelector(".navbar-brand").textContent += " - " + identity;

function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 41.825, lng: -87.81 },
        zoom: 17,
        disableDefaultUI: true,
        streetViewControl: true
    });
    
    map.addListener("click", showAddLamppostInfoWindow)

    $("#findMeButton").on("click", function(event){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                currentPosition = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                displayAddLamppostInfoWindow(currentPosition);
              },
              () => {
                handleLocationError(true, addLamppostInfoWindow, map.getCenter());
              }
            );
          } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
          }
    })
    getLampposts();
}

function displayAddLamppostInfoWindow(currentPosition) {
    if (gMarker) {gMarker.close();}
    addLamppostInfoWindow = new google.maps.InfoWindow();
                addLamppostInfoWindow.setPosition(currentPosition);
                addLamppostInfoWindow.setContent(`
            <div class="iw-header">
                Add Lamppost
            </div>
            <div class="iw-content">
                <input id="lamppostId" class="form-control" type="text" placeholder="Lamppost ID">
            </div>
            <div class="iw-actions">
                <button class="add-lamppost btn btn-success w-100">ADD</button>
                <button class="cancel-add btn btn-danger w-100">CANCEL</button>
            </div>
                `);
                addLamppostInfoWindow.open(map);
                map.setCenter(currentPosition);
}

$(document).on("click", ".add-lamppost", function(event) {
    event.preventDefault();
    console.log("ADDING LAMPPOST", currentPosition)
    const lamppostId = $("#lamppostId").val().trim();
    if (lamppostId) {
        addLamppost(currentPosition, lamppostId);
        addLamppostInfoWindow.close();
    }

});

$(document).on("click", ".cancel-add", function(event) {
    event.preventDefault();
    console.log("CLOSE INFO WINDOW")
    addLamppostInfoWindow.close();
})

$("#addOnClickToggle").on("click", function(event){
    event.preventDefault();
    console.log("TOGGLE ADD ON CLICK");
    addOnClick = !addOnClick;
    if (addOnClick) {
        $("#addOnClickToggle").removeClass("btn-danger").addClass("btn-success").text("Add On Click On")
    } else {
        $("#addOnClickToggle").removeClass("btn-success").addClass("btn-danger").text("Add On Click Off")
    }
})

function showAddLamppostInfoWindow(event) {
    if (!addOnClick) {
        return
    }
    console.log("SHOW ADD INFO WINDOW", event)
    currentPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
    }
    console.log("Click Position", currentPosition);
    displayAddLamppostInfoWindow(currentPosition)
}

function getLampposts() {
    $.get("/api/lamppost")
    .then(function(lampposts){
        console.log(lampposts)
        lampposts.forEach(function(lamppost){
            addLampostMarker(lamppost);
            if (lamppost.lamppostId === panToMarker) {
                console.log("PAN", lamppost)

                map.setCenter({ lng: lamppost.lng, lat: lamppost.lat})
            }
        })

    })
}

function addLamppost(position, lamppostId) {
    console.log("Adding Lamppost", position.latLng);

    let geocoderRequest = {location: {
        lat: position.lat, 
        lng: position.lng
    }}
    
    geocoder.geocode(geocoderRequest)
    .then(function(response) {
        console.log("Geocoder", response)
        
        let newLamppost = {
            lamppostId: lamppostId,
            lat: position.lat,
            lng: position.lng,
            status: "new"
        }
        if (response.results[0]) {
            newLamppost.location = response.results[0].formatted_address.split(",")[0];
            
        }
        $.post("/api/lamppost", newLamppost);
        addLampostMarker(newLamppost)    
    })
}

function addLampostMarker(lamppost) {
    let icon = "red";
    if (lamppost.preppedAt) {
        icon = "orange";
    }
    if (lamppost.paintedAt) {
        icon = "green";
    }
    if (lamppost.inspectedAt) {
        icon = "black";
    }
    const newMarker = new google.maps.Marker({
        position: {
            lat: lamppost.lat,
            lng: lamppost.lng
        },
        map: map,
        icon: `assets/images/lightbulb-${icon}.png`,
        title: lamppost.lamppostId
    })
    newMarker.addListener("click", clickOnMarker)
}

function clickOnMarker() {
    if (gInfoWindow) { gInfoWindow.close();}
    let marker = this;
    console.log("YOU CLICKED ON LAMPOST: ", marker.title)
    $.get(`/api/lamppost/${marker.title}`)
    .then(function(lamppost){
        console.log("Lamppost from Database", lamppost)
        let content = $(document.getElementById("infoWindow").outerHTML);

        console.log(content.html())
        const infoWindow = new google.maps.InfoWindow()

        gInfoWindow = infoWindow;
        gMarker = marker;

        content.find(".iw-header").text("Lamp Post " + lamppost.lamppostId)
        content.find(".iw-content").text(lamppost.location)
        console.log("SETTING", infoWindow, marker)
        content.find(".prepped, .painted, .inspected")
            .prop("disabled", true)
            .attr("data-id", lamppost.lamppostId);
        content.find(".prepped").prop("disabled", false);
        
        if (lamppost.preppedAt) {
            content.find(".prepped").removeClass("btn-danger").addClass("btn-success").prop("disabled", true); 
            content.find(".painted").prop("disabled", false);


            if (lamppost.paintedAt) {
                content.find(".painted").removeClass("btn-danger").addClass("btn-success").prop("disabled", true);
                content.find(".inspected").prop("disabled", false);

                if (lamppost.inspectedAt) {
                    content.find(".inspected").removeClass("btn-danger").addClass("btn-success").prop("disabled", true);
                }
            }

        }
        infoWindow.setContent(content.html())
        // const infoWindow = new google.maps.InfoWindow({
        //     content: content.html()
        // })
        infoWindow.open({
            anchor: marker,
            map: map,
            shouldFocus: false
        })
    })
}

$(document).on("click", ".prepped", function(event){
    const lamppostId = $(event.target).data("id");
    console.log("prepped", lamppostId, gInfoWindow, gMarker)
    $.get(`/api/lamppost/prepped/${lamppostId}/${identity}`)
    .then(function(dbLamppost){
        console.log("PREPPED IN DB", dbLamppost)
        gInfoWindow.close();
        gMarker.setIcon(`assets/images/lightbulb-orange.png`);
    })
})



$(document).on("click", ".painted", function(event){
    const lamppostId = $(event.target).data("id");
    console.log("painted", lamppostId, gInfoWindow, gMarker)
    $.get(`/api/lamppost/painted/${lamppostId}/${identity}`)
    .then(function(dbLamppost){
        console.log("PAINTED IN DB", dbLamppost)
        gInfoWindow.close();
        gMarker.setIcon(`assets/images/lightbulb-green.png`);
    })
})


$(document).on("click", ".inspected", function(event){
    const lamppostId = $(event.target).data("id");
    console.log("inspected", lamppostId, gInfoWindow, gMarker)
    $.get(`/api/lamppost/inspected/${lamppostId}/${identity}`)
    .then(function(dbLamppost){
        console.log("INSPECTED IN DB", dbLamppost)
        gInfoWindow.close();
        gMarker.setIcon(`assets/images/lightbulb-black.png`);
    })
})

$(document).on("click", ".closeWindow", function(event){
    gInfoWindow.close();
})