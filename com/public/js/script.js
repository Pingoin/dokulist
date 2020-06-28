axios.get("/api/templates/dokuTable").then(templateReq =>(
    axios.get("/api/files").then(respDokus => (
        axios.get("/api/fileCount").then(respCount =>
            $("#app").html(ejs.render(templateReq.data,{dokus:respDokus.data,dokuCount:respCount.data.count}))
        )
    ))   
));


