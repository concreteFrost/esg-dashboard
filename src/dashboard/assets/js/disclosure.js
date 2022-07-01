/* minifyOnSave */
/**
 * @preserve =========================================================
 * esg:one Dashboard Application
 * =========================================================
 * @license Copyright 2021 Beathamm Ltd (https://esg-one.co)
 * @author  22 Digital Ltd (https://22digital.ltd)
 * @author  Justin Hartman <code@22digital.ltd>
 */
var DatatableSasb = (function () {
  // Variables
  var $dtDisc = $('#disclosure-datatable');

  // Methods
  function init($this) {
    var options = {
      stateSave: true,
      stateDuration: 60 * 60 * 24,
      pageLength: 20,
      dom: 'Bfrt',
      buttons: [
        {
          extend: 'collection',
          text: 'Show columns',
          columns: '.colhead',
          className: 'btn-outline-primary',
          buttons: ['columnsVisibility'],
          visibility: true,
        },
        'copy',
        {
          extend: 'print',
          exportOptions: {
            columns: ':visible',
          },
        },
        {
          extend: 'pdf',
          pageSize: 'A4',
          orientation: 'landscape',
          exportOptions: {
            columns: ':visible',
          },
        },
        'excel',
      ],
    };

    // Init the datatable
    var table = $this
      .on('init.dt', function () {
        $('.dt-buttons .btn')
          .removeClass('btn-secondary')
          .addClass('btn-sm btn-default');
      })
      .DataTable(options);
  }

  // Events
  if ($dtDisc.length) {
    init($dtDisc);
  }
})();

//Disclosure buttons
//esg-graph
//standards-reporting

//#esg-graph-btn

//Switching between graph and risk table
const esg_graph_btn = $('#esg-graph-btn');
const risk_table_btn = $('#risk-table-btn');

const esg_graph = $('#esg-graph');
const risk_table = $('#risk-table');
const standards_reporting = $("#standards-reporting")

const activeButton = '<style>'

$(document).ready(() => {
  risk_table.hide();
  esg_graph_btn.toggleClass("button-nav-active")
});


esg_graph_btn.click(() => {
  risk_table.hide();
  esg_graph.show();
  standards_reporting.show()
  esg_graph_btn.toggleClass("button-nav-active")
  risk_table_btn.removeClass("button-nav-active")
});

risk_table_btn.click(() => {
  risk_table.show();
  esg_graph.hide();
  standards_reporting.hide()
  risk_table_btn.toggleClass("button-nav-active")
  esg_graph_btn.removeClass("button-nav-active")
});
