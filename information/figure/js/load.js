define(['jquery'], function(jquery) {
  return function(name, div_id) {
    jquery.ajax({ url: name, async: false, success: function (data) {
      data = $(data).attr('ng-init', 'init(\'' + div_id + '\')');
      document.getElementById(div_id).innerHTML = data[0].outerHTML;
    }});
  };
});
