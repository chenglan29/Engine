visit = (api, body = undefined, callback) => {
    if (typeof body == "function") {
        callback = body;
        body = undefined;
    }
    var form;
    if (body == undefined) {
        form = {
            method: "GET",
            headers: {
                "token": SRead("token")
            },
        };
    }
    else {
        form = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "token": SRead("token")
            },
            body: JSON.stringify(body)
        }
    }
    fetch(location.origin + "/" + api, form)
        .then(response => response.json())
        .then(data => {
            if (data.success == false) return alert(data.message);
            callback(data);
        })
        .catch(error => console.error('Error:', error));
}