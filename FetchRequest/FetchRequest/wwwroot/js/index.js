var grid = new ej.grids.Grid({
    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
    allowPaging: true,
    actionBegin: actionBegin,
    actionComplete: actionComplete,
    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
    columns: [
        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, isPrimaryKey: true, type: 'number' },
        { field: 'CustomerID', width: 140, headerText: 'Customer ID', type: 'string' },
        { field: 'ShipCity', headerText: 'ShipCity', width: 140 },
        { field: 'ShipCountry', headerText: 'ShipCountry', width: 140 }
    ]
});
grid.appendTo('#Grid');

var button = new ej.buttons.Button({
    content: 'Bind data via Fetch',
    cssClass: 'e-success'
});
button.appendTo('#buttons');
let flag = false;

document.getElementById('buttons').onclick = function () {
    const fetchRequest = new ej.base.Fetch("https://localhost:7217/Grid/Getdata", 'POST');//Use remote server host number instead ****
    fetchRequest.send();
    fetchRequest.onSuccess = (data) => {
        grid.dataSource = data;
    };
};

function actionComplete(e) {
    if (e.requestType === 'save' || e.requestType === 'delete') {
        flag = false;
    }
}
function actionBegin(e) {

    if (!flag) {
        if (e.requestType == 'save' && (e.action == 'add')) {
            var editedData = e.data;
            e.cancel = true;
            var fetchRequest = new ej.base.Fetch({
                url: 'https://localhost:7217/Grid/Insert',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ value: editedData })
            });
            fetchRequest.onSuccess = () => {
                flag = true;
                grid.endEdit();
            };
            fetchRequest.onFailure = () => {
                flag = false;
            };
            fetchRequest.send();
        }
        if (e.requestType == 'save' && (e.action == "edit")) {
            var editedData = e.data;
            e.cancel = true;
            var fetchRequest = new ej.base.Fetch({
                url: 'https://localhost:7217/Grid/Update',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ value: editedData })
            });
            fetchRequest.onSuccess = () => {
                flag = true;
                grid.endEdit();
            };
            fetchRequest.onFailure = () => {
                flag = false;
            };
            fetchRequest.send();
        }
        if (e.requestType == 'delete') {
            var editedData = e.data;
            e.cancel = true;
            var fetchRequest = new ej.base.Fetch({
                url: 'https://localhost:7217/Grid/Delete',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ key: editedData[0][grid.getPrimaryKeyFieldNames()[0]] })
            });
            fetchRequest.onSuccess = () => {
                flag = true;
                grid.deleteRecord();
            };
            fetchRequest.onFailure = () => {
                flag = false;
            };
            fetchRequest.send();
        }
    }
}