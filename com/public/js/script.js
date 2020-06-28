axios.get("/api/templates/dokuTable")
    .then(templateReq =>(
        axios.get("/api/files")
        .then(response => (
            $("#app").html(ejs.render(templateReq.data,{dokus:response.data}))))
    ));


