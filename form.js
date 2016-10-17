$(document).ready(function(){

  // Listener for climate zone selections
  var cz_sel = [];
  $("input[name=cz]").on("click", function() {
    cz_sel = checkedList("cz"); 
    updateClimateZoneFields();
  });

  // Listeners for residential and commercial building type selections
  var res_sel = [];
  $("input[name=res-type]").on("click", function() {
    res_sel = checkedList("res-type");
    updateBldgTypeFields();
  });
  var com_sel = [];
  $("input[name=com-type]").on("click", function() {
    com_sel = checkedList("com-type");
    updateBldgTypeFields();
  });

  ///////////////////////////////////////////////////////////////////////////
  // GENERAL FUNCTIONS
  ///////////////////////////////////////////////////////////////////////////

  // Add to string type to create a function that makes the capitalizes
  // the first letter of the string
  String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  // Create and return a list of entries based on the selections
  // made in a set of check boxes with the name "list_name"
  function checkedList(list_name) {
    // Create empty list for checked entries in the list
    var the_list = [];

    // Populate list with all of the checked items in the input field
    $("input[name=" + list_name + "]:checked").each(function() {
      the_list.push($(this).prop("value"));
    });
    return the_list;
  }

  // Build list of numeric fields with labels based on entries (strings)
  // passed to function
  function buildList(entries, field_name) {
    var add_to_dom = "";
    for (i = 0; i < entries.length; i++) {
      add_to_dom += entries[i].capitalizeFirstLetter() + "<input type='number' class='sm-text-input' name='" + field_name + "' value='" + entries[i] + "'>";
    }
    return add_to_dom;
  }

  // Build table based on lists of strings passed to function
  function buildTable(rows, columns, field_name) {
    var add_to_dom = "<table>";

    // Header row
    add_to_dom += "<tr><td></td>"
    for (j = 0; j < columns.length; j++) {
      add_to_dom += "<td> " + columns[j].capitalizeFirstLetter() + " </td>";
    }

    // Rows
    for (i = 0; i < rows.length; i++) {
      add_to_dom += "<tr><td>" + rows[i].capitalizeFirstLetter() + "</td>";
      // Columns
      for (j = 0; j < columns.length; j++) {
        add_to_dom += "<td><input type='number' class='sm-text-input' name='" + rows[i] + "-" + columns[j] + "'></td>";
      }
      add_to_dom += "</tr>";
    }
    add_to_dom += "</table>";

    return add_to_dom;
  }



  ///////////////////////////////////////////////////////////////////////////
  // PERFORMANCE
  ///////////////////////////////////////////////////////////////////////////

  // Define HTML content for unitary value input
  var perf_unitary = "<label>Value <input type='number' class='sm-text-input' name='perf-unitary'></label>"

  // Define HTML content for probability distribution
  var prob_select = "<div id='prob-distro'><select name='distribution-type'><option selected disabled hidden style='display: none' value=''>Distribution Options</option><option value='uniform'>Uniform</option><option value='normal'>Normal</option><option value='lognormal'>Log-normal</option><option value='gamma'>Gamma</option><option value='weibull'>Weibull</option><option value='triangular'>Triangular</option></select></div>";

  var prob_params ="<div id='prob-params'><div id='param-1'></div><input type='number' class='sm-text-input' name='distribution-param-1'><div id='param-2'></div><input type='number' class='sm-text-input' name='distribution-param-2'></div></div>";

  // On page load, add default performance field (single value) and check
  // the appropriate radio button
  $("input[name=perf-spec-type][value=spec-unitary]").prop("checked", true);
  $("#perf-spec").append(perf_unitary);

  // Update performance field based on climate zone and building type selection
  $("input[name=perf-spec-type]").change(function(){
    // Obtain the performance type specified
    var perf_spec_type = $("input[name=perf-spec-type]:checked").val();

    // Create concatenated list of building types
    var bldg_sel = res_sel.concat(com_sel);

    // Clear contents of field
    $("#perf-spec").empty();

    // Initialize watcher variable (checks for both climate zone and
    // building type selections for the combined case)
    var watcher = false;

    // Update contents of DOM in the appropriate field based on the selection
    if (perf_spec_type === "spec-unitary"){
      $("#perf-spec").append(perf_unitary);
    }
    else if (perf_spec_type === "spec-by-cz") {
      // Check for selection of climate zones
      if (cz_sel.length === 0) { $("#perf-spec").append("Please select at least one climate zone. "); }
      else { $("#perf-spec").append(buildList(cz_sel, "perf-cz")); }
    }
    else if (perf_spec_type === "spec-by-bldg") {
      // Check for selection of building types
      if (bldg_sel.length === 0) { $("#perf-spec").append("Please select at least one building type. "); }
      else { $("#perf-spec").append(buildList(bldg_sel, "perf-bldg")); }
    }
    else if (perf_spec_type === "spec-by-cz-bldg") {
      // Check for selections of building types and climate zones
      if (cz_sel.length === 0) { $("#perf-spec").append("Please select at least one climate zone. "); watcher = true; }
      if (bldg_sel.length === 0) { $("#perf-spec").append("Please select at least one building type. "); watcher = true; }

      // Step is suppressed by watcher variable
      if (watcher === false) { $("#perf-spec").append(buildTable(bldg_sel, cz_sel, "perf-bldg-cz")); }
    }
    else {
      $("#perf-spec").append(prob_select);
    }
  });

  ///////////////////////////////////////////////////////////////////////////

  // Update performance field as appropriate if the climate zone selection
  // or building type selection is changed and that radio option is chosen

  // Check and update performance field as appropriate if a change occurs
  // in the climate zones selected and a climate zone-dependent specification
  // option has been selected
  function updateClimateZoneFields() {
    // Obtain the performance type specified
    var perf_spec_type = $("input[name=perf-spec-type]:checked").val();
    var watcher = false;
    // Create concatenated list of building types
    var bldg_sel = res_sel.concat(com_sel);

    if (perf_spec_type === "spec-by-cz") {
      // Clear contents of field
      $("#perf-spec").empty();
      // Check for selection of climate zones
      if (cz_sel.length === 0) { $("#perf-spec").append("Please select at least one climate zone. "); }
      else { $("#perf-spec").append(buildList(cz_sel, "perf-cz")); }
    }
    else if (perf_spec_type === "spec-by-cz-bldg") {
      // Clear contents of field
      $("#perf-spec").empty();
      // Check for selections of building types and climate zones
      if (cz_sel.length === 0) { $("#perf-spec").append("Please select at least one climate zone. "); watcher = true; }
      if (bldg_sel.length === 0) { $("#perf-spec").append("Please select at least one building type. "); watcher = true; }
      // Step is suppressed by watcher variable
      if (watcher === false) { $("#perf-spec").append(buildTable(bldg_sel, cz_sel, "perf-bldg-cz")); }
    }
  }

  // Same as above function but for building type selections
  function updateBldgTypeFields() {
    // Obtain the performance type specified
    var perf_spec_type = $("input[name=perf-spec-type]:checked").val();
    var watcher = false;
    // Create concatenated list of building types
    var bldg_sel = res_sel.concat(com_sel);

    if (perf_spec_type === "spec-by-bldg") {
      // Clear contents of field
      $("#perf-spec").empty();
      // Check for selection of building types
      if (bldg_sel.length === 0) { $("#perf-spec").append("Please select at least one building type. "); }
      else { $("#perf-spec").append(buildList(bldg_sel, "perf-bldg")); }
    }
    else if (perf_spec_type === "spec-by-cz-bldg") {
      // Clear contents of field
      $("#perf-spec").empty();
      // Check for selections of building types and climate zones
      if (cz_sel.length === 0) { $("#perf-spec").append("Please select at least one climate zone. "); watcher = true; }
      if (bldg_sel.length === 0) { $("#perf-spec").append("Please select at least one building type. "); watcher = true; }
      // Step is suppressed by watcher variable
      if (watcher === false) { $("#perf-spec").append(buildTable(bldg_sel, cz_sel, "perf-bldg-cz")); }
    }
  }

  ///////////////////////////////////////////////////////////////////////////

  // Respond to distribution type selection
  $(document).on("change", "select[name=distribution-type]", function(){
    // Clear existing entries in the area
    $("#prob-params").remove();

    // Get the dropdown menu selection
    var perf_distro_type = $("select[name=distribution-type] option:selected").val();
    // Set the parameter values accordingly
    if (perf_distro_type === "uniform") {
      var p1name = "Minimum";
      var p2name = "Maximum";
    }
    else if (perf_distro_type === "normal") {
      var p1name = "Mean";
      var p2name = "Standard Deviation";
    }
    else if (perf_distro_type === "lognormal") {
      var p1name = "Mean";
      var p2name = "Standard Deviation";
    }
    else if (perf_distro_type === "gamma") {
      var p1name = "Shape (k)";
      var p2name = "Scale (&#952;)";
    }
    else if (perf_distro_type === "weibull") {
      var p1name = "Shape (k)";
      var p2name = "Scale (&#955;)";
    }
    else { // triangular
      var p1name = "Lower limit";
      var p2name = "Mode";
      var p3name = "Upper limit";
    }

    // Add probability distribution parameter fields
    $("#prob-distro").append(prob_params);
    
    // Add correct field labels
    $("#param-1").append(p1name);
    $("#param-2").append(p2name);

    // Add special fields for triangular distribution
    if (perf_distro_type === "triangular") {
      $("#prob-params").append("<div id='param-3'></div><input type='number' class='sm-text-input' name='distribution-param-3'>");
      $("#param-3").append(p3name);
    }
  });

  ///////////////////////////////////////////////////////////////////
  // SOURCES

  // Define HTML content for single source option
  var single_source = "<label>Source <input type='text' name='single-source'></label>";

  // On page load, add default source field (single value) and check
  // the appropriate radio button
  $("input[name=perf-source-type][value=single]").prop("checked", true);
  $("#perf-source").append(single_source);

  // If selection option is changed, check for selection option and
  // update the HTML appropriately
  $("input[name=perf-source-type]").change(function() {
    // Obtain the performance source specification selected
    var perf_source_type = $("input[name=perf-source-type]:checked").val();

    // Clear contents of performance source area in DOM
    $("#perf-source").empty();

    // Add appropriate content
    if (perf_source_type === "single") {
    	$("#perf-source").append(single_source);
    }
    else {
    	// HAVE TO FIGURE OUT PERF SPEC TYPE AND THEN ACT ACCORDINGLY
    	// $("#perf-source").append();
    }
  });



  ///////////////////////////////////////////////////////////////////////////
  // AUTOMATIC UNITS
  ///////////////////////////////////////////////////////////////////////////





});