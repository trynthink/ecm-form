$(document).ready(function(){

  // Listener for climate zone selections
  var cz_sel = [];
  $("input[name=cz]").on("click", function() {
    cz_sel = checkedList("cz");

    // Update performance fields when the selections change (the function
    // takes care of whether the update is needed)
    cplFieldGenerator($("input[name=perf-spec-type]:checked").val(), "#perf-spec", "perf", "number");
    updateSourceFields("#perf-source", "perf");
  });

  // Listeners for residential and commercial building type selections
  var res_sel = [];
  $("input[name=res-type]").on("click", function() {
    res_sel = checkedList("res-type");

    // Update performance fields when the selections change (the function
    // takes care of whether the update is needed)
    cplFieldGenerator($("input[name=perf-spec-type]:checked").val(), "#perf-spec", "perf", "number");
    updateSourceFields("#perf-source", "perf");
  });

  var com_sel = [];
  $("input[name=com-type]").on("click", function() {
    com_sel = checkedList("com-type");

    // Update performance fields when the selections change (the function
    // takes care of whether the update is needed)
    cplFieldGenerator($("input[name=perf-spec-type]:checked").val(), "#perf-spec", "perf", "number");
    updateSourceFields("#perf-source", "perf");
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
  function buildList(entries, field_name, field_type) {
    var add_to_dom = "";
    for (i = 0; i < entries.length; i++) {
      add_to_dom += entries[i].capitalizeFirstLetter() + "<input type='" + field_type + "' class='sm-text-input' name='" + field_name + "' value='" + entries[i] + "'>";
    }
    return add_to_dom;
  }

  // Build table based on lists of strings passed to function
  function buildTable(rows, columns, field_name, field_type) {
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
        add_to_dom += "<td><input type='" + field_type + "' class='sm-text-input' name='" + rows[i] + "-" + columns[j] + "'></td>";
      }
      add_to_dom += "</tr>";
    }
    add_to_dom += "</table>";

    return add_to_dom;
  }



  ///////////////////////////////////////////////////////////////////////////
  // CPL-SPECIFIC FUNCTIONS
  ///////////////////////////////////////////////////////////////////////////

  // Generate fields for user input based on selected cost, performance, or
  // lifetime specification type and, if appropriate, additional user inputs
  // such as climate zones and building types
  function cplFieldGenerator(spec_type, location_id, field_class, field_type) {
    // Variable that indicates whether either climate zone or building type
    // selections have been made
    var watcher = false;

    // Create concatenated list of building types
    var bldg_sel = res_sel.concat(com_sel);
    
    // Update contents of DOM in the appropriate field based on the selection
    if (spec_type === "spec-by-cz") {
      // Clear contents of field
      $(location_id).empty();

      // Check for selection of climate zones
      if (cz_sel.length === 0) { $(location_id).append("Please select at least one climate zone. "); }
      else { $(location_id).append(buildList(cz_sel, field_class + "-cz", field_type)); }
    }
    else if (spec_type === "spec-by-bldg") {
      // Clear contents of field
      $(location_id).empty();

      // Check for selection of building types
      if (bldg_sel.length === 0) { $(location_id).append("Please select at least one building type. "); }
      else { $(location_id).append(buildList(bldg_sel, field_class + "-bldg", field_type)); }
    }
    else if (spec_type === "spec-by-cz-bldg") {
      // Clear contents of field
      $(location_id).empty();

      // Check for selections of building types and climate zones
      if (cz_sel.length === 0) { $(location_id).append("Please select at least one climate zone. "); watcher = true; }
      if (bldg_sel.length === 0) { $(location_id).append("Please select at least one building type. "); watcher = true; }

      // Step is suppressed by watcher variable
      if (watcher === false) { $(location_id).append(buildTable(bldg_sel, cz_sel, field_class + "-bldg-cz", field_type)); }
    }
  }

  // Update source fields dynamically based on other selections
  function updateSourceFields(location_id, field_class) {
    // Obtain the source specification option selected
    var source_type = $("input[name=" + field_class + "-source-type]:checked").val();

    // Obtain the data specification type specified
    var spec_type = $("input[name=" + field_class + "-spec-type]:checked").val();

    // Clear contents of applicable source area in DOM
    $(location_id).empty();

    // Add appropriate content based on wether that content 
    if (source_type === "single") {
      $(location_id).append(single_source);
    }
    else {
      // Update contents of DOM in the appropriate field based on the selection
      if (spec_type === "spec-unitary" || spec_type === "spec-by-prob"){
        $(location_id).append(single_source);
      }
      else {
        cplFieldGenerator(spec_type, location_id, field_class + "-src", "text");
      }
    }
  }

  function probFieldGenerator(distro_type, field_class) {
    // Define probability distribution parameter fields to add to DOM
    var prob_params = "<div id='" + field_class + "-prob-params'><div id='" + field_class + "-param-1'></div><input type='number' class='sm-text-input' name='distribution-param-1'><div id='" + field_class + "-param-2'></div><input type='number' class='sm-text-input' name='distribution-param-2'></div></div>";

    // Set the parameter field text labels accordingly
    if (distro_type === "uniform") {
      var p1name = "Minimum";
      var p2name = "Maximum";
    }
    else if (distro_type === "normal") {
      var p1name = "Mean";
      var p2name = "Standard Deviation";
    }
    else if (distro_type === "lognormal") {
      var p1name = "Mean";
      var p2name = "Standard Deviation";
    }
    else if (distro_type === "gamma") {
      var p1name = "Shape (k)";
      var p2name = "Scale (&#952;)"; // theta
    }
    else if (distro_type === "weibull") {
      var p1name = "Shape (k)";
      var p2name = "Scale (&#955;)"; // lambda
    }
    else { // triangular
      var p1name = "Lower limit";
      var p2name = "Mode";
      var p3name = "Upper limit";
    }

    // Add probability distribution parameter fields
    $("#" + field_class + "-prob-distro").append(prob_params);
    
    // Add correct field labels for the distribution type
    $("#" + field_class + "-param-1").append(p1name);
    $("#" + field_class + "-param-2").append(p2name);

    // Add special field for triangular distribution
    if (distro_type === "triangular") {
      $("#" + field_class + "-prob-params").append("<div id='" + field_class + "-param-3'></div><input type='number' class='sm-text-input' name='distribution-param-3'>");
      $("#" + field_class + "-param-3").append(p3name);
    }
  }

  // Insert probability dropdown menu for the specified field class
  // i.e., "cost", "perf", or "life"
  function configProbDropdown(field_class) {
    var prob_menu = "<div id='" + field_class + "-prob-distro'><select name='" + field_class + "-distro'><option selected disabled hidden style='display: none' value=''>Distribution Options</option><option value='uniform'>Uniform</option><option value='normal'>Normal</option><option value='lognormal'>Log-normal</option><option value='gamma'>Gamma</option><option value='weibull'>Weibull</option><option value='triangular'>Triangular</option></select></div>";
    return prob_menu
  }



  ///////////////////////////////////////////////////////////////////////////
  // PERFORMANCE
  ///////////////////////////////////////////////////////////////////////////

  // Define HTML content for unitary value input
  var perf_unitary = "<label>Value <input type='number' class='sm-text-input' name='perf-unitary'></label>"

  // On page load, add default performance field (single value) and check
  // the appropriate radio button
  $("input[name=perf-spec-type][value=spec-unitary]").prop("checked", true);
  $("#perf-spec").append(perf_unitary);

  // Update performance field based on climate zone and building type selection
  // Update performance source field if appropriate
  $("input[name=perf-spec-type]").change(function(){
    // Obtain the performance type specified
    var perf_spec_type = $("input[name=perf-spec-type]:checked").val();

    // Clear contents of field
    $("#perf-spec").empty();

    // Update contents of DOM in the appropriate field based on the selection
    if (perf_spec_type === "spec-unitary"){
      $("#perf-spec").append(perf_unitary);
    }
    else if (perf_spec_type === "spec-by-prob") {
      $("#perf-spec").append(configProbDropdown("perf"));
    }
    else {
      cplFieldGenerator(perf_spec_type, "#perf-spec", "perf", "number");
    }

    // Update performance source data field
    updateSourceFields("#perf-source", "perf");
  });

  ///////////////////////////////////////////////////////////////////
  // DISTRIBUTION TYPE SELECTION

  // Respond to distribution type selection
  $(document).on("change", "select[name=perf-distro]", function(){
    // Clear existing entries in the area
    $("#perf-prob-params").remove();

    // Get the dropdown menu selection
    var perf_distro_type = $("select[name=perf-distro] option:selected").val();

    // Call function to determine parameter names and add appropriate
    // fields to the DOM to specify the distribution parameters
    probFieldGenerator(perf_distro_type, "perf");
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
  $("input[name=perf-source-type]").change(function(){ updateSourceFields("#perf-source", "perf"); });



  ///////////////////////////////////////////////////////////////////////////
  // AUTOMATIC UNITS
  ///////////////////////////////////////////////////////////////////////////





});