document.getElementById("login-button").addEventListener("click", function(event){
    event.preventDefault();

    // check to make sure all fields are filled in properly
    const fullName = document.getElementById("fullName").value.trim();
    const adult = document.getElementById("adult");
    const scout = document.getElementById("scout");

    let valid = true;
    console.log(fullName)
    if (!(fullName.length > 5 && fullName.indexOf(" ") > -1)) {
        console.log("BAD NAME")
        valid = false;
    }

    if (!(adult.checked || scout.checked)) {
        console.log("NEED TO SPECIFY SCOUT OR ADULT")
        valid = false;
    }

    if (valid) {
        let type = $("[name='type']:checked").val();
        console.log(fullName, type)
        $.post("/api/volunteer", {name: fullName, type, status: "inactive"})
        .then(function(dbVoluneer){
            console.log("Volunteer in DB", dbVoluneer)
            localStorage.setItem("LampPostUserId", fullName);
            localStorage.setItem("LampPostUserIdType", type);
            location.href = "index.html";

        })
    }




})