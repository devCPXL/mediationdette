var TableEditable = function () {

    var handleTable = function ($scope, Data) {

        function restoreRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);

            //for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
            //    oTable.fnUpdate(aData[i], nRow, i, false);
            //}

            oTable.fnUpdate(aData.name_creditor, nRow, 0, false);
            oTable.fnUpdate(aData.address_creditor, nRow, 1, false);
            oTable.fnUpdate(aData.zipcode_creditor, nRow, 3, false);
            oTable.fnUpdate(aData.common_creditor, nRow, 2, false);
            oTable.fnUpdate(aData.title_address_creditor, nRow, 4, false);
            oTable.fnUpdate(aData.title_creditor, nRow, 5, false);
            oTable.fnUpdate(aData.phone_creditor, nRow, 6, false);
            oTable.fnUpdate(aData.email_creditor, nRow, 7, false);

            oTable.fnDraw();
        }

        function editRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);

            var jqTds = $('>td', nRow);
            jqTds[0].innerHTML = '<input type="text" class="form-control input-small" value="' + aData.name_creditor + '">';
            jqTds[1].innerHTML = '<input type="text" class="form-control input-small" value="' + aData.address_creditor + '">';
            jqTds[2].innerHTML = '<input type="text" class="form-control input-small" value="' + aData.zipcode_creditor + '">';
            jqTds[3].innerHTML = '<input type="text" class="form-control input-small" value="' + aData.common_creditor + '">';

            jqTds[4].innerHTML = '<input type="text" class="form-control input-small" value="' + aData.title_address_creditor + '">';
            jqTds[5].innerHTML = '<input type="text" class="form-control input-small" value="' + aData.title_creditor + '">';
            jqTds[6].innerHTML = '<input type="text" class="form-control input-small" value="' + aData.phone_creditor + '">';
            jqTds[7].innerHTML = '<input type="text" class="form-control input-small" value="' + aData.email_creditor + '">';

            jqTds[8].innerHTML = '<a class="edit" href="">Save</a>';
            jqTds[9].innerHTML = '<a class="cancel" href="">Cancel</a>';
        }

        function saveRow(oTable, nRow) {
            var jqInputs = $('input', nRow);
            var aData = oTable.fnGetData(nRow);
            Data.put('creditor/', aData).then(function(data){
                console.log(data);
            });
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
            oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
            oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
            oTable.fnUpdate(jqInputs[4].value, nRow, 4, false);
            oTable.fnUpdate(jqInputs[5].value, nRow, 5, false);
            oTable.fnUpdate(jqInputs[6].value, nRow, 6, false);
            oTable.fnUpdate(jqInputs[7].value, nRow, 7, false);
            oTable.fnUpdate('<a class="edit" href="">Editer</a>', nRow, 8, false);
            oTable.fnUpdate('<a class="delete" href="">Supprimer</a>', nRow, 9, false);
            oTable.fnDraw();
        }

        function cancelEditRow(oTable, nRow) {
            var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs.name_creditor.value, nRow, 0, false);
            oTable.fnUpdate(jqInputs.address_creditor.value, nRow, 1, false);
            oTable.fnUpdate(jqInputs.zipcode_creditor.value, nRow, 2, false);
            oTable.fnUpdate(jqInputs.common_creditor.value, nRow, 3, false);
            oTable.fnUpdate(jqInputs.title_address_creditor.value, nRow, 4, false);
            oTable.fnUpdate(jqInputs.title_creditor.value, nRow, 5, false);
            oTable.fnUpdate(jqInputs.phone_creditor.value, nRow, 6, false);
            oTable.fnUpdate(jqInputs.email_creditor.value, nRow, 7, false);
            oTable.fnUpdate('<a class="edit" href="">Editer</a>', nRow, 8, false);
            oTable.fnDraw();
        }



        var table = $('#sample_editable_1');

        var oTable = table.dataTable({
            "ajax": "//webtest/mediationdetteTest/api/Slim/public/creditors/",
            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "tout"] // change per page values here
            ],
            "language": {
               url: '//webtest/mediationdetteTest/assets/global/plugins/datatables/plugins/i18n/French.json'
            },
            "pageLength": 5,
            columns: [
                { data:"name_creditor"},
                { data:"address_creditor"},
                { data:"zipcode_creditor" },
                { data:"common_creditor" },
                { data:"title_address_creditor" },
                { data:"title_creditor" },
                { data:"phone_creditor" },
                { data:"email_creditor" },
                { data: null, render: function ( data, type, row ) {
                        return "<a class='edit' href=''>Editer</a>"; }},
                { data: null, render: function ( data, type, row ) {
                        return "<a class='delete' href=''>Supprimer</a>";}}
            ],
            //    'orderable': true,
            //    'targets': [0]
            //}, {
            //    "searchable": true,
            //    "targets": [0]
            //}],
            "order": [
                [0, "asc"]
            ] // set first column as a default sort by asc
        });

        var tableWrapper = $("#sample_editable_1_wrapper");

        tableWrapper.find(".dataTables_length select").select2({
            showSearchInput: true //hide search box with special css class
        }); // initialize select2 dropdown

        var nEditing = null;
        var nNew = false;

        $('#sample_editable_1_new').click(function (e) {
            e.preventDefault();

            if (nNew && nEditing) {
                if (confirm("Previose row not saved. Do you want to save it ?")) {
                    saveRow(oTable, nEditing); // save
                    $(nEditing).find("td:first").html("Untitled");
                    nEditing = null;
                    nNew = false;

                } else {
                    oTable.fnDeleteRow(nEditing); // cancel
                    nEditing = null;
                    nNew = false;
                    
                    return;
                }
            }

            var aiNew = oTable.fnAddData(['', '', '', '', '', '']);
            var nRow = oTable.fnGetNodes(aiNew[0]);
            editRow(oTable, nRow);
            nEditing = nRow;
            nNew = true;
        });

        table.on('click', '.delete', function (e) {
            e.preventDefault();

            if (confirm("Voulez vous vraiment supprimer cet enregistrement ?") == false) {
                return;
            }

            var nRow = $(this).parents('tr')[0];
            oTable.fnDeleteRow(nRow);
            //alert("Deleted! Do not forget to do some ajax to sync with backend :)");
        });

        table.on('click', '.cancel', function (e) {
            e.preventDefault();
            if (nNew) {
                oTable.fnDeleteRow(nEditing);
                nEditing = null;
                nNew = false;
            } else {
                restoreRow(oTable, nEditing);
                nEditing = null;
            }
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();

            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];

            if (nEditing !== null && nEditing != nRow) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                restoreRow(oTable, nEditing);
                editRow(oTable, nRow);
                nEditing = nRow;
            } else if (nEditing == nRow && this.innerHTML == "Save") {
                /* Editing this row and want to save it */
                saveRow(oTable, nEditing);
                nEditing = null;
                //alert("Updated! Do not forget to do some ajax to sync with backend :)");
            } else {
                /* No edit in progress - let's start one */
                editRow(oTable, nRow);
                nEditing = nRow;
            }
        });
    }

    return {

        //main function to initiate the module
        init: function ($scope, Data) {
            handleTable($scope, Data);
        }

    };

}();