let dokuTable=`<table class="table table-striped table-hover">
<thead>
    <tr>
        <th scope="col">Nr<span class="arrow"></span></th>
        <th scope="col">Doku<span class="arrow"></span></th>
        <th scope="col">Ordner<span class="arrow"></span></th>
        <th scope="col">Datum<span class="arrow"></span></th>
    </tr>
</thead>
<tbody>
    <% dokus.forEach(doku =>{%>
    <tr>
        <td scope="row"><%=doku.index %></td>
        <th>
            <%=doku.title %>
        </th>
        <td>
            <%=doku.path %>
        </td>
        <td>
            <%=doku.date %>
        </td>
        <td>
            <%=doku.ageRating %>
        </td>
    </tr>
    <% });%>
</tbody>
</table>`;

axios.get("/api/files")
    .then(response => (
        $("#app").html(ejs.render(dokuTable,{dokus:response.data}))));