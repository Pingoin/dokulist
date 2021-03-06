declare let axios: typeof import("axios").default;
declare let ejs: typeof import("ejs");

window.addEventListener("popstate",parseURL);
window.addEventListener("load", parseURL);

function goToPage(page: string) {// eslint-disable-line
    history.pushState({}, "title 1", page);
        parseURL( );
}

function fillDokuTable(page: number) {
    axios.get("/api/templates", {
        params: {
            template: "videoTable"
        }
    }).then(templateReq => (
        axios.get("/api/files", {
            params: {
                page: page
            }
        }).then(respDokus => (
            $("#app").html(ejs.render(templateReq.data,
                {
                    dokus: respDokus.data.dokus,
                    page: respDokus.data.page,
                    limit: respDokus.data.limit,
                    count: respDokus.data.count
                }))
        ))
    ));
}


function fillDokuPage(ID: number) {
    axios.get("/api/templates", {
        params: {
            template: "singleVideo"
        }
    }).then(templateReq => (
        axios.get("/api/Doku", {
            params: {
                ID: ID
            }
        }).then(respDokus => (
            $("#app").html(ejs.render(templateReq.data, { doku: respDokus.data }))
        ))
    ));
}

function parseURL() {
    const url = window.location.href.split("/");
    console.log(url);
    if (url.length > 2) {
        switch (url[3]) {
            case "dokus":
                fillDokuTable(parseInt(url[4].replace("page", "")));
                break;
            case "doku":
                fillDokuPage(parseInt(url[4].replace("id", "")));
                break;
            default:
                fillDokuTable(1);
        }
    } else {
        fillDokuTable(1);
    }
}

//parseURL();