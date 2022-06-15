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
