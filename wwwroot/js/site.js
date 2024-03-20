// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
function openErrorModal(strMessage) {
    var myDiv = document.getElementById("MyModalErrorAlertBody");
    myDiv.innerHTML = strMessage;
    $('#myModalError').modal('show');
}

function openSuccessModal(strMessage) {
    var myDiv = document.getElementById("MyModalSuccessAlertBody");
    myDiv.innerHTML = strMessage;
    $('#myModalSuccess').modal('show');
}

function AddItem(btn) {
    // Get the table element by its ID
    var table;
    table = document.getElementById('CodesTable');

    // Get all rows within the table
    var rows = table.getElementsByTagName('tr');

    // Get the HTML content of the last row
    var rowOuterHtml = rows[rows.length - 1].outerHTML;

    // Calculate indices for the new row based on the last row
    var lastrowIdx = rows.length - 2;
    var nextrowIdx = lastrowIdx + 1;

    // Replace indices in rowOuterHtml with the new indices
    rowOuterHtml = rowOuterHtml.replaceAll('_' + lastrowIdx + '_', '_' + nextrowIdx + '_');
    rowOuterHtml = rowOuterHtml.replaceAll('[' + lastrowIdx + ']', '[' + nextrowIdx + ']');
    rowOuterHtml = rowOuterHtml.replaceAll('-' + lastrowIdx, '-' + nextrowIdx);

    // Insert the new row with modified HTML content into the table
    var newRow = table.insertRow();
    newRow.innerHTML = rowOuterHtml;

    // Reset values of input fields within the new row
    var x = document.getElementsByTagName("INPUT");
    for (var cnt = 0; cnt < x.length; cnt++) {
        if (x[cnt].type == "text" && x[cnt].id.indexOf('_' + nextrowIdx + '_') > 0) {
            // Clear text inputs
            if (x[cnt].id.indexOf('Unit') == 0)
                x[cnt].value = '';
        }
        else if (x[cnt].type == "number" && x[cnt].id.indexOf('_' + nextrowIdx + '_') > 0)
            // Reset number inputs to 0
            x[cnt].value = 0;
    }

    // Rebind any validators
    rebindvalidators();
}
function rebindvalidators() {
    // Select the form with ID "CodeSbyAnizForm"
    var $form = $("#CodeSbyAnizForm");

    // Unbind any previous event handlers attached to the form
    $form.unbind();

    // Remove any existing validator data associated with the form
    $form.data("validator", null);

    // Parse and bind unobtrusive validators on the form
    $.validator.unobtrusive.parse($form);

    // Re-validate the form using unobtrusive validation options
    $form.validate($form.data("unobtrusiveValidation").options);
}

// function DeleteItem(btn) {

//     var table = document.getElementById('CodesTable');
//     var rows = table.getElementsByTagName('tr');

//     var VisibleRowCount = 0;
//     var x = document.querySelectorAll("[id*='Quantity']");

//     for (i = 0; i < x.length; i++) {
//         if (x[i].value > 0)
//             VisibleRowCount++;

//     }
//     if (VisibleRowCount <= 1) {
//         alert("This Row cannot be deleted.");
//         return;
//     }
//     var btIndx = btn.id.replaceAll('btnremove-', '');
//     var idOfQuantity = btIndx + "__Quantity";
//     var txtQuantity = document.querySelector("[id$='" + idOfQuantity + "']");
//     txtQuantity.value = 0;

//     $(btn).closest('tr').hide()

//     CalcTotals();

// }

function DeleteItem(btn) {
    // Get the table element by its ID
    var table = document.getElementById('CodesTable');

    // Get all rows within the table
    var rows = table.getElementsByTagName('tr');

    // Extract the index from the button's ID
    var btnIdx = btn.id.replaceAll('btnremove-', '');

    // Construct IDs for related elements based on the button index
    var idOfQuantity = btnIdx + "__Quantity";
    var idOfIsDeleted = btnIdx + "__IsDeleted";

    // Find the input element for quantity based on constructed ID and set its value to 0
    var txtQuantity = document.querySelector("[id$='" + idOfQuantity + "']");
    txtQuantity.value = 0;

    // Find the input element for 'IsDeleted' flag based on constructed ID and set its value to "true"
    var txtIsDeleted = document.querySelector("[id$='" + idOfIsDeleted + "']");
    txtIsDeleted.value = "true";

    // Hide the closest row containing the delete button
    $(btn).closest('tr').hide();

    // Call function to recalculate totals, assuming this function exists elsewhere
    CalcTotals();
}

function getExRate(currencyid) {
    // Get the dropdown element containing exchange rates by its ID
    var lstbox = document.getElementById('dropdownExRate');

    // Get the text input element for the exchange rate by its ID
    var txtExrate = document.getElementById('txtExchangeRate');

    // Get the options (items) of the dropdown
    var items = lstbox.options;

    // Iterate over the options in reverse order
    for (var i = items.length - 1; i >= 0; i--) {
        // Check if the value of the current option matches the value of the provided currency ID
        if (items[i].value == currencyid.value) {
            // Set the value of the text input to the text of the matching option
            txtExrate.value = items[i].text;
            // Exit the function since we found the matching exchange rate
            return;
        }
    }
    // If no matching exchange rate is found, return without setting the value
    return;
}

function SetUnitName(txtProductCode) {
    // Generate the ID of the text input for unit name based on the provided product code input's ID
    var txtunitNameId = txtProductCode.id.replaceAll('ProductCode', 'UnitName');

    // Get the text input element for unit name using the generated ID
    var txtunitName = document.getElementById(txtunitNameId);

    // Get the dropdown element containing unit names by its ID
    var lstbox = document.getElementById('dropdownUnitNames');

    // Get the options (items) of the dropdown
    var items = lstbox.options;

    // Iterate over the options in reverse order
    for (var i = items.length - 1; i >= 0; i--) {
        // Check if the value of the current option matches the value of the provided product code
        if (items[i].value == txtProductCode.value) {
            // Set the value of the unit name text input to the text of the matching option
            txtunitName.value = items[i].text;
            // Exit the function since we found the matching unit name
            return;
        }
    }
    // If no matching unit name is found, return without setting the value
    return;
}
function setSameWidth(srcElement, desElement) {
    //style = window.getComputedStyle(srcElement);
    //wdt = style.getPropertyValue('width');
    //desElement.style.width = wdt;
    desElement.style.width = "230px";
}

function CalcTotals() {
    // Get all elements with class 'QtyTotal'
    var x = document.getElementsByClassName('QtyTotal');

    // Initialize variables for total quantity and total amount
    var totalQty = 0;
    var totalAmount = 0;

    // Get the exchange rate from the 'txtExchangeRate' input element
    var txtExchangeRate = eval(document.getElementById('txtExchangeRate').value);

    // Iterate over each element with class 'QtyTotal'
    for (var i = 0; i < x.length; i++) {
        // Construct IDs for related elements based on the loop index
        var idofIsDeleted = i + "__IsDeleted";
        var idofPrice = i + "__PrcInBaseCur";
        var idofFob = i + "__Fob";
        var idofTotal = i + "__Total";

        // Get the IDs of related elements
        var hidIsDelId = document.querySelector("[id$='" + idofIsDeleted + "']").id;
        var priceTxtId = document.querySelector("[id$='" + idofPrice + "']").id;
        var fobTxtId = document.querySelector("[id$='" + idofFob + "']").id;
        var totalTxtId = document.querySelector("[id$='" + idofTotal + "']").id;

        // Check if the item is not marked as deleted
        if (document.getElementById(hidIsDelId).value != "true") {
            // Increment total quantity by the value of current 'QtyTotal' element
            totalQty += eval(x[i].value);

            // Get input elements for price, fob, and total
            var txttotal = document.getElementById(totalTxtId);
            var txtprice = document.getElementById(priceTxtId);
            var txtfob = document.getElementById(fobTxtId);

            // Calculate price based on exchange rate and fob value
            txtprice.value = txtExchangeRate * eval(txtfob.value);

            // Calculate total based on quantity and price
            txttotal.value = eval(x[i].value) * txtprice.value;

            // Accumulate total amount
            totalAmount += eval(txttotal.value);
        }
    }

    // Update the total quantity and total amount fields
    document.getElementById('txtQtyTotal').value = totalQty;
    document.getElementById('txtAmountTotal').value = totalAmount.toFixed(2);

    return;
}


// Event listener for changes on the document
document.addEventListener('change', function (e) {
    // Check if the change occurred in an element with an ID containing 'ProductCode'
    if (event.target.id.indexOf('ProductCode') >= 0) {
        // Call the SetUnitName function and pass the event target (changed element)
        SetUnitName(event.target);
    }
}, false);

// Another event listener for changes on the document
document.addEventListener('change', function (e) {
    // Check if the change occurred in an element with class 'QtyTotal', 'PriceTotal', 'FobTotal', 
    // or if the changed element has an ID equal to 'PoCurrencyId'
    if (e.target.classList.contains('QtyTotal') ||
        e.target.classList.contains('PriceTotal') ||
        e.target.classList.contains('FobTotal') ||
        event.target.id == 'PoCurrencyId') {
        // Call the CalcTotals function
        CalcTotals();
    }
}, false);



function ShowSearchableList(event) {

    if (event.target.id.indexOf('ProductCode') < 0) {
        return;
    }


    var tid = event.target.id;

    var txtDescId = tid.replaceAll('ProductCode', 'Description');

    var txtValue = document.getElementById('txtValue');

    var txtText = document.getElementById(txtDescId);

    var txtSearch = event.target;


    var lstbox = document.getElementById("mySelect");

    $(txtSearch).after($(lstbox).show('slow'));




    if (event.keyCode === 13 || event.keyCode == 9) {

        txtSearch.value = txtValue.value;
        lstbox.style.visibility = "hidden";

        var divlst = document.getElementById("HiddenDiv");
        $(divlst).after($(lstbox).show('slow'));

        if (event.keyCode === 13) {
            event.preventDefault();
            txtSearch.focus();
            return;
        }
        else
            return;
    }

    setSameWidth(txtSearch, lstbox);
    lstbox.style.visibility = "visible";


    txtValue.value = "";
    txtText.value = "";

    var items = lstbox.options;
    for (var i = items.length - 1; i >= 0; i--) {
        if (items[i].text.toLowerCase().indexOf(txtSearch.value.toLowerCase()) > -1) {
            items[i].style.display = 'block';
            items[i].selected = true;
            txtValue.value = items[i].value;
            txtText.value = items[i].text;
        }
        else {
            items[i].style.display = 'none';
            items[i].selected = false;
        }
    }


    var objDiv = document.getElementById("CsDiv");
    objDiv.scrollTop = objDiv.scrollHeight - 200;

}

document.addEventListener('keydown'// Function to show a searchable list when a keydown event occurs
function ShowSearchableList(event) {
        // Check if the event target does not have an ID containing 'ProductCode'
        if (event.target.id.indexOf('ProductCode') < 0) {
            // If not, return without further action
            return;
        }

        // Get the ID of the event target
        var tid = event.target.id;

        // Generate the ID of the description text input based on the event target's ID
        var txtDescId = tid.replaceAll('ProductCode', 'Description');

        // Get references to various elements
        var txtValue = document.getElementById('txtValue');
        var txtText = document.getElementById(txtDescId);
        var txtSearch = event.target;
        var lstbox = document.getElementById("mySelect");

        // Show the listbox slowly
        $(txtSearch).after($(lstbox).show('slow'));

        // Check if the key pressed is Enter (keyCode 13) or Tab (keyCode 9)
        if (event.keyCode === 13 || event.keyCode == 9) {
            // Set the value of the search input to the selected value
            txtSearch.value = txtValue.value;
            // Hide the listbox
            lstbox.style.visibility = "hidden";
            // Show the listbox again after hiding it
            var divlst = document.getElementById("HiddenDiv");
            $(divlst).after($(lstbox).show('slow'));
            // Prevent default behavior if the key pressed is Enter
            if (event.keyCode === 13) {
                event.preventDefault();
                txtSearch.focus();
                return;
            } else {
                return;
            }
        }

        // Set the width of the listbox to match the width of the search input
        setSameWidth(txtSearch, lstbox);
        // Make the listbox visible
        lstbox.style.visibility = "visible";

        // Clear the value and text of the search input
        txtValue.value = "";
        txtText.value = "";

        // Iterate over options in the listbox
        var items = lstbox.options;
        for (var i = items.length - 1; i >= 0; i--) {
            // Check if the text of the current option matches the search input value
            if (items[i].text.toLowerCase().indexOf(txtSearch.value.toLowerCase()) > -1) {
                // If it does, display the option and select it
                items[i].style.display = 'block';
                items[i].selected = true;
                // Set the value and text of the search input based on the selected option
                txtValue.value = items[i].value;
                txtText.value = items[i].text;
            } else {
                // If it doesn't match, hide the option and deselect it
                items[i].style.display = 'none';
                items[i].selected = false;
            }
        }

        // Scroll to the bottom of the listbox
        var objDiv = document.getElementById("CsDiv");
        objDiv.scrollTop = objDiv.scrollHeight - 200;
    }

// Attach the ShowSearchableList function to the keydown event on the document
document.addEventListener('keydown', ShowSearchableList);, ShowSearchableList);