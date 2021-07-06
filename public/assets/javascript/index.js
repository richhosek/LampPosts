let map;

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


    map.addListener("click", function (event) {

        console.log(event.latLng.lat(), event.latLng.lng());
        const newMarker = new google.maps.Marker({
            position: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            },

            map: map,
            icon: "assets/images/lightbulb-red.png"
        })
        newMarker.addListener("click", clickOnMarker)

    })
}

function clickOnMarker() {
    console.log(this)
    let marker = this;
    let content = document.getElementById("infoWindow").innerHTML;
    console.log(content)
    let geocoderRequest = {location: {
        lat: this.position.lat(), 
        lng: this.position.lng()}
    }
    geocoder.geocode(geocoderRequest)
    .then(function(response) {
        console.log(response)
        if (response.results[0]) {
            console.log(response.results[0].formatted_address)

            content = content.replace("{address}", response.results[0].formatted_address)
            const infoWindow = new google.maps.InfoWindow({
                content
            })
            infoWindow.open({
                anchor: marker,
                map: map,
                shouldFocus: false
            })
        }
    })


    
}