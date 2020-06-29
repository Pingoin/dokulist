parseURL();
function fillDokuTable(page) {
    axios.get("/api/files", {
        params: {
            page: page
        }
    }).then(respDokus => (
        $("#app").html(ejs.render(respDokus.data.template, 
            { 
                dokus: respDokus.data.dokus, 
                page:respDokus.data.page,
                limit:respDokus.data.limit,
                count:respDokus.data.count }))
    ));
}

function goToPage(page) {
    history.pushState({}, "title 1", page);
    parseURL();

}

function parseURL() {
    let url = window.location.href.split("/");
    if (url.length > 2) {
        switch (url[3]) {
            case "dokus":
                fillDokuTable(parseInt(url[4].replace("page", "")));
                break;
            default:
                fillDokuTable(1);
        }
    } else {
        fillDokuTable(1);
    }


}