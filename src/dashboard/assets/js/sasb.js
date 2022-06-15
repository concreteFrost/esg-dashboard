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
  var $dtSasb = $('#sasb-datatable');

  // Methods
  function init($this) {
    // Parse data using CSV with PapaParse.
    Papa.parse('/dashboard/assets/data/sasb.csv', {
      download: true,
      complete: function (results) {
        // console.log(results.data)
        var options = {
          data: results.data,
          lengthChange: !1,
          stateSave: true,
          stateDuration: 60 * 60 * 24,
          pageLength: 20,
          dom: 'Bfrtip',
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
              pageSize: 'A4',
              orientation: 'landscape',
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
          language: {
            paginate: {
              previous: "<i class='fas fa-angle-left'>",
              next: "<i class='fas fa-angle-right'>",
            },
          },
        };

        // Init the datatable
        var table = $this
          .on('init.dt', function () {
            $('.dt-buttons .btn')
              .removeClass('btn-secondary')
              .addClass('btn-sm btn-default');
          })
          .DataTable(options);
      },
    });
  }

  // Events
  if ($dtSasb.length) {
    init($dtSasb);
  }
})();
